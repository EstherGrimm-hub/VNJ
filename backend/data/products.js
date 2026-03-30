const products = [
  {
    id: 1,
    category: "apple watch",
    name: "Apple Watch Series 10 [GPS 42 mm] Smartwatch with Silver Aluminum Case",
    price: 550,
    oldPrice: 600,
    rating: 5,
    reviews: "3.2k Reviews",
    stock: 10,
    images: [
      "https://cdn.tgdd.vn/Products/Images/7077/344750/Slider/apple-watch-series-11-42mm-vien-nhom-day-the-thao638943104052964278.jpg",
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/e/text_ng_n_31__7_4.png",
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/e/text_ng_n_26__6_4.png",
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/e/text_ng_n_34__7_2.png"
    ],
    colors: [
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/e/text_ng_n_31__7_4.png",
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/e/text_ng_n_26__6_4.png",
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/e/text_ng_n_34__7_2.png"
    ],
    sizes: ["42mm", "46mm"],
    description: `
  WHY APPLE WATCH ULTRA 3 — Meet the ultimate sports and adventure watch. Advanced features for runners, cyclists, swimmers, hikers, divers and more.

  EXTREMELY RUGGED, INCREDIBLY CAPABLE — 49mm corrosion-resistant titanium case. Sapphire front crystal. Large Digital Crown and customizable Action button.

  THE FREEDOM OF CELLULAR — With a cellular service plan, you can call and text without your iPhone nearby.
  `,
    specs: {
      model: "MWWD3HN/A",
      display: "Retina Display",
      strapColor: "Blue",
      strapMaterial: "Fabric",
      size: "Free Size",
      touchscreen: "Yes",
      waterResistant: "50m",
      compatibleOS: "iOS"
    }
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    category: "headphones",
    price: 399,
    oldPrice: 450,
    rating: 5,
    reviews: "5.8k Reviews",
    stock: 15,
    images: [
      "https://img.youtube.com/vi/f-68kUYG6iI/maxresdefault.jpg",
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/s/o/sony-wh-1000xm6-11_1.jpg",
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/w/h/wh1000xm6_primarytout_0pt-image1.jpg"
    ],
    colors: [
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/s/o/sony-wh-1000xm6-11_1.jpg",
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/w/h/wh1000xm6_primarytout_0pt-image1.jpg"
    ],
    sizes: ["Standard"],
    description: `
Industry-leading noise cancellation.
Crystal clear hands-free calling.
30-hour battery life with quick charge.
`,
    specs: {
      model: "WH-1000XM5",
      display: "—",
      strapColor: "Black",
      strapMaterial: "Plastic",
      size: "Standard",
      touchscreen: "No",
      waterResistant: "No",
      compatibleOS: "Android / iOS"
    }
  },
  {
    id: 4,
    category: "mouse",
    name: "Logitech MX Master 3S Wireless Performance Mouse",
    price: 99,
    oldPrice: 129,
    rating: 5,
    reviews: "4.1k Reviews",
    stock: 25,
    images: [
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lt8mdzkrf4pl2b.webp",
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lqasap0wqfqvde@resize_w450_nl.webp"
    ],
    colors: [
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lt8mdzkrf4pl2b.webp",
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lqasap0wqfqvde@resize_w450_nl.webp"
    ],
    sizes: ["Standard"],
    description: `
Iconic ergonomic mouse with ultra-fast scrolling.
8K DPI sensor for high precision.
USB-C fast charging and multi-device support.
`,
    specs: {
      model: "MX Master 3S",
      display: "—",
      strapColor: "Graphite",
      strapMaterial: "Plastic",
      size: "Standard",
      touchscreen: "No",
      waterResistant: "No",
      compatibleOS: "Windows / macOS"
    }
  },
  {
    id: 5,
    category: "phone",
    name: "Samsung Galaxy S24 Ultra 5G Smartphone",
    price: 1199,
    oldPrice: 1299,
    rating: 5,
    reviews: "5.6k Reviews",
    stock: 20,
    images: [
      "https://cdn.tgdd.vn/Products/Images/42/307174/Slider/samsung-galaxy-s24-ultra-5g-thumb-youtube-1020x570.jpg",
      "https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-xam-1-750x500.jpg"
    ],
    colors: [
      "https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-xam-1-750x500.jpg"
    ],
    sizes: ["256GB", "512GB"],
    description: `
Flagship Samsung smartphone with advanced AI features.
200MP pro-grade camera system.
Ultra-smooth AMOLED display and powerful Snapdragon processor.
`,
    specs: {
      model: "Galaxy S24 Ultra",
      display: '6.8" AMOLED',
      strapColor: "Titanium Black",
      strapMaterial: "Glass + Aluminum",
      size: "6.8 inch",
      touchscreen: "Yes",
      waterResistant: "IP68",
      compatibleOS: "Android"
    }
  },
  {
    id: 6,
    category: "laptop",
    name: "Apple MacBook Air M3 13-inch Laptop",
    price: 1299,
    oldPrice: 1399,
    rating: 5,
    reviews: "3.8k Reviews",
    stock: 12,
    images: [
      "https://macone.vn/wp-content/uploads/2024/03/mba13-m3-midnight-gallery1-202402.jpeg",
      "https://macone.vn/wp-content/uploads/2024/03/mba13-m3-midnight-gallery2-202402.jpeg"
    ],
    colors: [
      "https://macone.vn/wp-content/uploads/2024/03/mba13-m3-midnight-gallery1-202402.jpeg"
    ],
    sizes: ["13 inch", "15 inch"],
    description: `
Supercharged by the Apple M3 chip.
Ultra-thin and lightweight design.
Up to 18 hours of battery life.
`,
    specs: {
      model: "MacBook Air M3",
      display: '13.6" Liquid Retina',
      strapColor: "Midnight",
      strapMaterial: "Aluminum",
      size: "13 inch",
      touchscreen: "No",
      waterResistant: "No",
      compatibleOS: "macOS"
    }
  },
  {
    id: 7,
    category: "headphones",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    price: 399,
    oldPrice: 449,
    rating: 5,
    reviews: "8.2k Reviews",
    stock: 30,
    images: [
      "https://img.youtube.com/vi/v6EjmbMgv80/maxresdefault.jpg",
      "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg",
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/_/t_i_xu_ng_67__2_7.png"
    ],
    colors: [
      "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg",
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/t/_/t_i_xu_ng_67__2_7.png"
    ],
    sizes: ["Standard"],
    description: `
Industry-leading noise cancellation.
Crystal clear call quality with AI microphone.
Up to 30 hours battery life.
`,
    specs: {
      model: "WH-1000XM5",
      display: "—",
      strapColor: "Black",
      strapMaterial: "Plastic",
      size: "Standard",
      touchscreen: "No",
      waterResistant: "No",
      compatibleOS: "Android / iOS"
    }
  },
  {
    id: 8,
    category: "apple watch",
    name: "Apple Watch Ultra 3 GPS + Cellular Smartwatch",
    price: 799,
    oldPrice: 899,
    rating: 5,
    reviews: "4.5k Reviews",
    stock: 18,
    images: [
      "https://cdn.tgdd.vn/Products/Images/7077/344764/Slider/vi-vn-apple-watch-ultra-3-gps-cellular-49mm-vien-titanium-day-ocean-sld-(1).jpg",
      "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7077/344764/apple-watch-ultra-3-gps-cellular-49mm-vien-titanium-day-ocean-tu-nhien-1-638931884423100114-750x500.jpg",
      "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7077/344764/apple-watch-ultra-3-gps-cellular-49mm-vien-titanium-day-ocean-tu-nhien-2-638931884428984160-750x500.jpg"
    ],
    colors: [
      "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7077/344764/apple-watch-ultra-3-gps-cellular-49mm-vien-titanium-day-ocean-tu-nhien-1-638931884423100114-750x500.jpg"
    ],
    sizes: ["49mm"],
    description: `
Ultimate smartwatch designed for sports and adventure.
Titanium case with the brightest Apple display.
Advanced GPS and health tracking features.
`,
    specs: {
      model: "Apple Watch Ultra 2",
      display: "Retina LTPO OLED",
      strapColor: "Orange",
      strapMaterial: "Fabric",
      size: "49mm",
      touchscreen: "Yes",
      waterResistant: "100m",
      compatibleOS: "iOS"
    }
  },
  {
    id: 2,
    category: "apple watch",
    name: "Samsung Galaxy Watch6 Classic LTE (43mm, Black)",
    price: 349,
    oldPrice: 400,
    rating: 5,
    reviews: "1.9k Reviews",
    stock: 15,
    images: [
      "https://img.youtube.com/vi/2vOceSQXjvA/maxresdefault.jpg",
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/s/m/sm-r960_001_front_silver_1_1.png",
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/s/m/sm-r950_001_front_black_1_1.png"
    ],
    colors: [
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/s/m/sm-r960_001_front_silver_1_1.png",
      "https://cdn2.cellphones.com.vn/358x/media/catalog/product/s/m/sm-r950_001_front_black_1_1.png"
    ],
    sizes: ["43mm", "47mm"],
    description: `
  Galaxy Watch6 Classic keeps you connected and tracks your health with advanced sensors.

  Track heart rate, sleep, stress and workouts with precision.

  Premium stainless steel design with rotating bezel.
  `,
    specs: {
      model: "SM-R955F",
      display: "Super AMOLED",
      strapColor: "Black",
      strapMaterial: "Silicone",
      size: "43mm",
      touchscreen: "Yes",
      waterResistant: "50m",
      compatibleOS: "Android"
    }
  }
];

module.exports = products;