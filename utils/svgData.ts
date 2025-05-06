// SVG şekilleri için örnek veriler
export type ShapeKey = 'square' | 'circle' | 'triangle' | 'star' | 'cat' | 'dog' | 'flower' | 'tree' | 'house' | 'apple';

export const svgShapes: Record<ShapeKey, string> = {
  // Basit şekiller
  square: `<svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" stroke="black" stroke-width="2" fill="none"/></svg>`,
  circle: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" fill="none"/></svg>`,
  triangle: `<svg viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" stroke="black" stroke-width="2" fill="none"/></svg>`,
  star: `<svg viewBox="0 0 100 100"><polygon points="50,10 61,35 90,35 65,55 75,80 50,65 25,80 35,55 10,35 39,35" stroke="black" stroke-width="2" fill="none"/></svg>`,
  apple: `<svg viewBox="0 0 100 100">
    <path d="M50,20 Q60,10 65,20 Q70,10 60,25 L60,25 Q75,25 80,40 Q85,60 70,80 Q60,90 50,80 Q40,90 30,80 Q15,60 20,40 Q25,25 40,25 L40,25 Q30,10 35,20 Q40,10 50,20 Z" stroke="black" stroke-width="2" fill="none"/>
    <path d="M50,20 L50,35" stroke="black" stroke-width="2" fill="none"/>
  </svg>`,
  
  // Hayvanlar
  cat: `<svg viewBox="0 0 100 100">
    <path d="M30,30 Q50,10 70,30 L70,70 Q50,90 30,70 Z" stroke="black" stroke-width="2" fill="none"/>
    <circle cx="40" cy="40" r="5" stroke="black" stroke-width="2" fill="none"/>
    <circle cx="60" cy="40" r="5" stroke="black" stroke-width="2" fill="none"/>
    <path d="M45,55 Q50,60 55,55" stroke="black" stroke-width="2" fill="none"/>
    <path d="M30,20 L20,10" stroke="black" stroke-width="2" fill="none"/>
    <path d="M70,20 L80,10" stroke="black" stroke-width="2" fill="none"/>
  </svg>`,
  dog: `<svg viewBox="0 0 100 100">
    <path d="M30,40 Q50,20 70,40 L70,70 Q50,90 30,70 Z" stroke="black" stroke-width="2" fill="none"/>
    <circle cx="40" cy="45" r="5" stroke="black" stroke-width="2" fill="none"/>
    <circle cx="60" cy="45" r="5" stroke="black" stroke-width="2" fill="none"/>
    <path d="M45,60 Q50,65 55,60" stroke="black" stroke-width="2" fill="none"/>
    <path d="M20,40 L30,40" stroke="black" stroke-width="2" fill="none"/>
    <path d="M20,30 Q30,20 40,30" stroke="black" stroke-width="2" fill="none"/>
    <path d="M60,30 Q70,20 80,30" stroke="black" stroke-width="2" fill="none"/>
  </svg>`,
  
  // Çiçekler
  flower: `<svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="15" stroke="black" stroke-width="2" fill="none"/>
    <ellipse cx="50" cy="20" rx="15" ry="10" stroke="black" stroke-width="2" fill="none"/>
    <ellipse cx="80" cy="50" rx="10" ry="15" stroke="black" stroke-width="2" fill="none"/>
    <ellipse cx="50" cy="80" rx="15" ry="10" stroke="black" stroke-width="2" fill="none"/>
    <ellipse cx="20" cy="50" rx="10" ry="15" stroke="black" stroke-width="2" fill="none"/>
    <path d="M50,85 L50,95" stroke="black" stroke-width="2" fill="none"/>
  </svg>`,
  
  // Manzaralar
  tree: `<svg viewBox="0 0 100 100">
    <rect x="45" y="60" width="10" height="30" stroke="black" stroke-width="2" fill="none"/>
    <path d="M30,60 Q50,30 70,60 Z" stroke="black" stroke-width="2" fill="none"/>
    <path d="M35,45 Q50,20 65,45 Z" stroke="black" stroke-width="2" fill="none"/>
  </svg>`,
  house: `<svg viewBox="0 0 100 100">
    <rect x="30" y="50" width="40" height="30" stroke="black" stroke-width="2" fill="none"/>
    <polygon points="30,50 50,30 70,50" stroke="black" stroke-width="2" fill="none"/>
    <rect x="45" y="60" width="10" height="20" stroke="black" stroke-width="2" fill="none"/>
    <rect x="35" y="55" width="10" height="10" stroke="black" stroke-width="2" fill="none"/>
    <rect x="55" y="55" width="10" height="10" stroke="black" stroke-width="2" fill="none"/>
  </svg>`,
};

// Çıkartmalar için örnek veriler
export const stickerData = {
  heart: {
    svg: `<svg viewBox="0 0 100 100"><path d="M50,30 Q60,10 75,25 Q90,40 50,80 Q10,40 25,25 Q40,10 50,30 Z" stroke="black" stroke-width="2" fill="none"/></svg>`,
    name: "Kalp"
  },
  star: {
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,10 61,35 90,35 65,55 75,80 50,65 25,80 35,55 10,35 39,35" stroke="black" stroke-width="2" fill="none"/></svg>`,
    name: "Yıldız"
  },
  cloud: {
    svg: `<svg viewBox="0 0 100 100"><path d="M30,50 Q20,40 30,30 Q40,20 50,30 Q60,20 70,30 Q80,40 70,50 Q80,60 70,70 Q60,80 50,70 Q40,80 30,70 Q20,60 30,50 Z" stroke="black" stroke-width="2" fill="none"/></svg>`,
    name: "Bulut"
  },
  sun: {
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="20" stroke="black" stroke-width="2" fill="none"/>
      <line x1="50" y1="20" x2="50" y2="10" stroke="black" stroke-width="2"/>
      <line x1="50" y1="90" x2="50" y2="80" stroke="black" stroke-width="2"/>
      <line x1="20" y1="50" x2="10" y2="50" stroke="black" stroke-width="2"/>
      <line x1="90" y1="50" x2="80" y2="50" stroke="black" stroke-width="2"/>
      <line x1="30" y1="30" x2="22" y2="22" stroke="black" stroke-width="2"/>
      <line x1="70" y1="30" x2="78" y2="22" stroke="black" stroke-width="2"/>
      <line x1="30" y1="70" x2="22" y2="78" stroke="black" stroke-width="2"/>
      <line x1="70" y1="70" x2="78" y2="78" stroke="black" stroke-width="2"/>
    </svg>`,
    name: "Güneş"
  },
  rainbow: {
    svg: `<svg viewBox="0 0 100 100">
      <path d="M20,80 Q50,20 80,80" stroke="red" stroke-width="4" fill="none"/>
      <path d="M25,80 Q50,25 75,80" stroke="orange" stroke-width="4" fill="none"/>
      <path d="M30,80 Q50,30 70,80" stroke="yellow" stroke-width="4" fill="none"/>
      <path d="M35,80 Q50,35 65,80" stroke="green" stroke-width="4" fill="none"/>
      <path d="M40,80 Q50,40 60,80" stroke="blue" stroke-width="4" fill="none"/>
      <path d="M45,80 Q50,45 55,80" stroke="purple" stroke-width="4" fill="none"/>
    </svg>`,
    name: "Gökkuşağı"
  },
};

// Renk paleti - çocuklar için daha canlı ve eğlenceli renkler
export const colorPalette = [
  '#FF0000', // Kırmızı
  '#FF4500', // Turuncu Kırmızı
  '#FF7F00', // Turuncu
  '#FFD700', // Altın
  '#FFFF00', // Sarı
  '#ADFF2F', // Yeşil Sarı
  '#00FF00', // Yeşil
  '#00FFFF', // Açık Mavi
  '#1E90FF', // Dodger Mavi
  '#0000FF', // Mavi
  '#8A2BE2', // Mavi Mor
  '#9400D3', // Mor
  '#FF1493', // Pembe
  '#FF69B4', // Sıcak Pembe
  '#FFC0CB', // Açık Pembe
  '#8B4513', // Kahverengi
  '#A0522D', // Sienna
  '#000000', // Siyah
  '#FFFFFF', // Beyaz
  '#FFA500', // Turuncu
  '#32CD32', // Lime Yeşil
  '#FF00FF', // Fuşya
  '#00CED1', // Koyu Turkuaz
  '#FF6347', // Domates
  '#9370DB', // Orta Mor
];