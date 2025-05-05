import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export function useCanvas() {
  const [canvasState, setCanvasState] = useState({});
  
  /**
   * Load SVG data from a string and convert it to paths
   */
  const loadSvgData = (svgData) => {
    if (!svgData) return {};
    
    try {
      // SVG verisi bir string olarak geliyor
      // SVG içindeki path, rect, circle gibi şekilleri çıkarmak için basit bir regex kullanıyoruz
      // Gerçek bir uygulamada daha gelişmiş bir SVG parser kullanılabilir
      const pathMatches = svgData.match(/<(path|rect|circle|polygon)[^>]*\/?>/g) || [];
      
      const paths = {};
      pathMatches.forEach((pathStr, index) => {
        // Her şekil için benzersiz bir ID oluştur
        const pathId = `svg-path-${Date.now()}-${index}`;
        
        // Stroke ve fill özelliklerini çıkar
        const strokeMatch = pathStr.match(/stroke="([^"]*)"/); 
        const strokeWidthMatch = pathStr.match(/stroke-width="([^"]*)"/); 
        const fillMatch = pathStr.match(/fill="([^"]*)"/); 
        
        const stroke = strokeMatch ? strokeMatch[1] : 'black';
        const strokeWidth = strokeWidthMatch ? parseFloat(strokeWidthMatch[1]) : 2;
        const fill = fillMatch ? fillMatch[1] : 'none';
        
        // SVG şeklini bir path olarak kaydet
        // Path özelliklerini çıkarmak için regex kullanıyoruz
        const dMatch = pathStr.match(/d="([^"]*)"/); 
        const pointsMatch = pathStr.match(/points="([^"]*)"/); 
        const rectMatch = pathStr.match(/<rect[^>]*x="([^"]*)"[^>]*y="([^"]*)"[^>]*width="([^"]*)"[^>]*height="([^"]*)"[^>]*\/?>/i);
        const circleMatch = pathStr.match(/<circle[^>]*cx="([^"]*)"[^>]*cy="([^"]*)"[^>]*r="([^"]*)"[^>]*\/?>/i);
        
        // Path veya polygon için d özelliğini kullan
        if (dMatch && dMatch[1]) {
          paths[pathId] = {
            d: dMatch[1],
            stroke,
            strokeWidth,
            fill
          };
        } 
        // Polygon için points özelliğini M ve L komutlarına dönüştür
        else if (pointsMatch && pointsMatch[1]) {
          const points = pointsMatch[1].trim().split(/\s+/);
          if (points.length >= 2) {
            let pathData = `M${points[0]}`;
            for (let i = 1; i < points.length; i++) {
              pathData += ` L${points[i]}`;
            }
            // Poligonu kapatmak için ilk noktaya geri dön
            pathData += ` L${points[0]}`;
            paths[pathId] = {
              d: pathData,
              stroke,
              strokeWidth,
              fill
            };
          }
        }
        // Rect elementini path'e dönüştür
        else if (rectMatch) {
          const [, x, y, width, height] = rectMatch;
          const x1 = parseFloat(x);
          const y1 = parseFloat(y);
          const x2 = x1 + parseFloat(width);
          const y2 = y1 + parseFloat(height);
          
          // Dikdörtgeni path olarak tanımla
          paths[pathId] = {
            d: `M${x1},${y1} L${x2},${y1} L${x2},${y2} L${x1},${y2} Z`,
            stroke,
            strokeWidth,
            fill
          };
        }
        // Circle elementini path'e dönüştür (basitleştirilmiş yaklaşım)
        else if (circleMatch) {
          const [, cx, cy, r] = circleMatch;
          const centerX = parseFloat(cx);
          const centerY = parseFloat(cy);
          const radius = parseFloat(r);
          
          // Daireyi 4 bezier eğrisi ile yaklaşık olarak tanımla
          const k = 0.552284749831; // Daire için bezier kontrol noktası katsayısı
          const kRadius = k * radius;
          
          const pathD = `
            M${centerX},${centerY - radius}
            C${centerX + kRadius},${centerY - radius} ${centerX + radius},${centerY - kRadius} ${centerX + radius},${centerY}
            C${centerX + radius},${centerY + kRadius} ${centerX + kRadius},${centerY + radius} ${centerX},${centerY + radius}
            C${centerX - kRadius},${centerY + radius} ${centerX - radius},${centerY + kRadius} ${centerX - radius},${centerY}
            C${centerX - radius},${centerY - kRadius} ${centerX - kRadius},${centerY - radius} ${centerX},${centerY - radius}
            Z
          `.trim().replace(/\n\s+/g, ' ');
          
          paths[pathId] = {
            d: pathD,
            stroke,
            strokeWidth,
            fill
          };
        }
        // Diğer SVG elementleri için orijinal string'i sakla
        else {
          paths[pathId] = pathStr;
        }
      });
      
      return paths;
    } catch (error) {
      console.error('Error loading SVG data:', error);
      return {};
    }
  };
  
  /**
   * Save the current paths to local storage
   */
  const savePaths = async (paths) => {
    try {
      const jsonPaths = JSON.stringify(paths);
      await AsyncStorage.setItem('saved_canvas_paths', jsonPaths);
      return true;
    } catch (error) {
      console.error('Error saving canvas paths:', error);
      return false;
    }
  };
  
  /**
   * Load saved paths from local storage
   */
  const loadSavedPaths = async () => {
    try {
      const jsonPaths = await AsyncStorage.getItem('saved_canvas_paths');
      if (jsonPaths) {
        return JSON.parse(jsonPaths);
      }
      return {};
    } catch (error) {
      console.error('Error loading saved canvas paths:', error);
      return {};
    }
  };
  
  /**
   * Clear all paths from the canvas
   */
  const clearCanvas = () => {
    setCanvasState({});
    return {};
  };
  
  /**
   * Fill a path with the specified color
   * @param {string} pathId - The ID of the path to fill
   * @param {string} color - The color to fill the path with
   * @param {object} paths - The current paths object
   * @returns {object} - The updated paths object
   */
  const fillPath = (pathId, color, paths) => {
    if (!paths[pathId]) return paths;
    
    const updatedPaths = { ...paths };
    
    // Path verisi bir obje ise
    if (typeof updatedPaths[pathId] === 'object') {
      updatedPaths[pathId] = {
        ...updatedPaths[pathId],
        fill: color
      };
    }
    // Path verisi bir string ise (SVG elementi)
    else if (typeof updatedPaths[pathId] === 'string') {
      // fill özelliğini güncelle
      let pathStr = updatedPaths[pathId];
      pathStr = pathStr.replace(/fill="[^"]*"/g, `fill="${color}"`); 
      
      // Eğer fill özelliği yoksa ekle
      if (!pathStr.includes('fill=')) {
        pathStr = pathStr.replace(/(\/?>)/, ` fill="${color}"$1`);
      }
      
      updatedPaths[pathId] = pathStr;
    }
    
    return updatedPaths;
  };
  
  /**
   * Find the path at the given coordinates
   * @param {number} x - The x coordinate
   * @param {number} y - The y coordinate
   * @param {object} paths - The current paths object
   * @returns {string|null} - The ID of the path at the coordinates, or null if none found
   */
  const findPathAtPoint = (x, y, paths) => {
    // Hata ayıklama için konsola bilgi yazdır
    console.log(`Finding path at point (${x}, ${y})`);
    
    // Koordinatları doğrudan kullan - koordinat dönüşümü ColoringCanvas bileşeninde yapılıyor
    const svgX = x;
    const svgY = y;
    
    // Hata ayıklama için ek bilgi
    console.log(`Checking ${Object.keys(paths).length} paths for hit detection`);
    
    // SVG elementlerini kontrol et
    for (const [pathId, pathData] of Object.entries(paths)) {
      // SVG şekli bir obje ise (path, rect, circle, vb.)
      if (typeof pathData === 'object' && pathData.d) {
        // Path verisi içindeki koordinatları analiz et
        const pathStr = pathData.d;
        
        // Tüm komutları (M, L, C, Z vb.) ve koordinatları ayır
        const commands = pathStr.match(/[MLHVCSQTAZmlhvcsqtaz][^MLHVCSQTAZmlhvcsqtaz]*/g) || [];
        
        // Path'in tüm noktalarını topla
        let points = [];
        let currentX = 0;
        let currentY = 0;
        
        commands.forEach(cmd => {
          const type = cmd[0]; // Komut tipi (M, L, C, vb.)
          const args = cmd.substring(1).trim().split(/[\s,]+/).map(parseFloat);
          
          switch(type.toUpperCase()) {
            case 'M': // Move to
              currentX = args[0];
              currentY = args[1];
              points.push({ x: currentX, y: currentY });
              break;
            case 'L': // Line to
              currentX = args[0];
              currentY = args[1];
              points.push({ x: currentX, y: currentY });
              break;
            case 'H': // Horizontal line
              currentX = args[0];
              points.push({ x: currentX, y: currentY });
              break;
            case 'V': // Vertical line
              currentY = args[0];
              points.push({ x: currentX, y: currentY });
              break;
            case 'Z': // Close path
              // Eğer başlangıç noktası varsa, onu tekrar ekle
              if (points.length > 0 && points[0]) {
                points.push({ x: points[0].x, y: points[0].y });
              }
              break;
            // Diğer komutlar için de benzer işlemler yapılabilir
          }
        });
        
        // Noktaların sınırlarını bul
        if (points.length > 0) {
          let minX = Math.min(...points.map(p => p.x));
          let maxX = Math.max(...points.map(p => p.x));
          let minY = Math.min(...points.map(p => p.y));
          let maxY = Math.max(...points.map(p => p.y));
          
          // Tıklanan nokta şeklin sınırları içinde mi kontrol et
          // Sınır kontrolü için biraz tolerans ekle
          const tolerance = 10; // Toleransı artırdık
          if (svgX >= minX - tolerance && svgX <= maxX + tolerance && 
              svgY >= minY - tolerance && svgY <= maxY + tolerance) {
            // Nokta içeride mi daha kesin kontrol et (ray casting algoritması)
            if (isPointInPath(points, svgX, svgY)) {
              console.log(`Found path ${pathId} with object data`);
              return pathId;
            }
          }
        }
      }
      // SVG şekli bir string ise (SVG elementi)
      else if (typeof pathData === 'string' && pathData.includes('<')) {
        // SVG elementi içindeki şekilleri kontrol et
        // Rect elementi için
        const rectMatch = pathData.match(/<rect[^>]*x="([^"]*)".+?y="([^"]*)".+?width="([^"]*)".+?height="([^"]*)"[^>]*\/?>/i);
        if (rectMatch) {
          const [, xStr, yStr, widthStr, heightStr] = rectMatch;
          const rectX = parseFloat(xStr);
          const rectY = parseFloat(yStr);
          const rectWidth = parseFloat(widthStr);
          const rectHeight = parseFloat(heightStr);
          
          // Tolerans ekleyerek kontrol et
          const tolerance = 5;
          if (svgX >= rectX - tolerance && svgX <= rectX + rectWidth + tolerance && 
              svgY >= rectY - tolerance && svgY <= rectY + rectHeight + tolerance) {
            console.log(`Found rect path ${pathId}`);
            return pathId;
          }
        }
        
        // Circle elementi için
        const circleMatch = pathData.match(/<circle[^>]*cx="([^"]*)".+?cy="([^"]*)".+?r="([^"]*)"[^>]*\/?>/i);
        if (circleMatch) {
          const [, cxStr, cyStr, rStr] = circleMatch;
          const cx = parseFloat(cxStr);
          const cy = parseFloat(cyStr);
          const r = parseFloat(rStr);
          
          // Tolerans ekleyerek kontrol et
          const tolerance = 5;
          const distance = Math.sqrt(Math.pow(svgX - cx, 2) + Math.pow(svgY - cy, 2));
          if (distance <= r + tolerance) {
            console.log(`Found circle path ${pathId}`);
            return pathId;
          }
        }
        
        // Polygon elementi için
        const polygonMatch = pathData.match(/<polygon[^>]*points="([^"]*)"[^>]*\/?>/i);
        if (polygonMatch) {
          const [, pointsStr] = polygonMatch;
          const pointPairs = pointsStr.trim().split(/\s+/);
          const points = pointPairs.map(pair => {
            const [x, y] = pair.split(',').map(parseFloat);
            return { x, y };
          });
          
          if (points.length > 0) {
            // Sınırları kontrol et
            let minX = Math.min(...points.map(p => p.x));
            let maxX = Math.max(...points.map(p => p.x));
            let minY = Math.min(...points.map(p => p.y));
            let maxY = Math.max(...points.map(p => p.y));
            
            const tolerance = 10;
            if (svgX >= minX - tolerance && svgX <= maxX + tolerance && 
                svgY >= minY - tolerance && svgY <= maxY + tolerance) {
              if (isPointInPath(points, svgX, svgY)) {
                console.log(`Found polygon path ${pathId}`);
                return pathId;
              }
            }
          }
        }
        
        // Path elementi için
        const pathMatch = pathData.match(/<path[^>]*d="([^"]*)"[^>]*\/?>/i);
        if (pathMatch) {
          const [, dStr] = pathMatch;
          // Path'i analiz et ve noktaları çıkar
          const commands = dStr.match(/[MLHVCSQTAZmlhvcsqtaz][^MLHVCSQTAZmlhvcsqtaz]*/g) || [];
          let points = [];
          let currentX = 0;
          let currentY = 0;
          
          commands.forEach(cmd => {
            const type = cmd[0];
            const args = cmd.substring(1).trim().split(/[\s,]+/).map(parseFloat);
            
            switch(type.toUpperCase()) {
              case 'M':
                currentX = args[0];
                currentY = args[1];
                points.push({ x: currentX, y: currentY });
                break;
              case 'L':
                currentX = args[0];
                currentY = args[1];
                points.push({ x: currentX, y: currentY });
                break;
              case 'H':
                currentX = args[0];
                points.push({ x: currentX, y: currentY });
                break;
              case 'V':
                currentY = args[0];
                points.push({ x: currentX, y: currentY });
                break;
              case 'Z':
                if (points.length > 0 && points[0]) {
                  points.push({ x: points[0].x, y: points[0].y });
                }
                break;
            }
          });
          
          if (points.length > 0) {
            let minX = Math.min(...points.map(p => p.x));
            let maxX = Math.max(...points.map(p => p.x));
            let minY = Math.min(...points.map(p => p.y));
            let maxY = Math.max(...points.map(p => p.y));
            
            const tolerance = 10;
            if (svgX >= minX - tolerance && svgX <= maxX + tolerance && 
                svgY >= minY - tolerance && svgY <= maxY + tolerance) {
              if (isPointInPath(points, svgX, svgY)) {
                console.log(`Found path element ${pathId}`);
                return pathId;
              }
            }
          }
        }
      }
    }
    
    console.log('No path found at point');
    return null;
  };
  
  /**
   * Bir noktanın bir poligon içinde olup olmadığını kontrol eder (Ray Casting algoritması)
   * @param {Array} points - Poligonun köşe noktaları
   * @param {number} x - Kontrol edilecek noktanın x koordinatı
   * @param {number} y - Kontrol edilecek noktanın y koordinatı
   * @returns {boolean} - Nokta poligon içindeyse true, değilse false
   */
  const isPointInPath = (points, x, y) => {
    // Geçersiz veya yetersiz nokta sayısı kontrolü
    if (!points || points.length < 3) {
      console.log('Invalid points array for isPointInPath');
      return false;
    }
    
    // Noktaların geçerli olduğunu kontrol et ve geçersiz noktaları filtrele
    const validPoints = points.filter(point => 
      point && typeof point.x === 'number' && typeof point.y === 'number' && 
      !isNaN(point.x) && !isNaN(point.y)
    );
    
    // Geçerli nokta sayısı kontrolü
    if (validPoints.length < 3) {
      console.log('Not enough valid points for isPointInPath');
      return false;
    }
    
    let inside = false;
    for (let i = 0, j = validPoints.length - 1; i < validPoints.length; j = i++) {
      const xi = validPoints[i].x;
      const yi = validPoints[i].y;
      const xj = validPoints[j].x;
      const yj = validPoints[j].y;
      
      // Yatay çizgiler için özel durum kontrolü
      if (Math.abs(yi - yj) < 0.0001) {
        // Yatay çizgi üzerinde mi kontrol et
        if (Math.abs(y - yi) < 0.0001 && 
            x >= Math.min(xi, xj) && x <= Math.max(xi, xj)) {
          return true; // Çizgi üzerinde
        }
        continue; // Yatay çizgi kesişim hesaplamasını atla
      }
      
      const intersect = ((yi > y) !== (yj > y)) && 
                        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    
    console.log(`Point (${x}, ${y}) is ${inside ? 'inside' : 'outside'} the path`);
    return inside;
  };

  return {
    canvasState,
    loadSvgData,
    savePaths,
    loadSavedPaths,
    clearCanvas,
    fillPath,
    findPathAtPoint
  };
}