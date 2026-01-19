import { prisma } from "@/lib/prisma";

async function main() {
  const categoriesData = [
    { name: "mouse", imageUrl: "https://i.ibb.co/nT62Jp6/mouse.png" },
    { name: "keyboard", imageUrl: "https://i.ibb.co/B59RgwhV/keyboard.png" },
    { name: "headphone", imageUrl: "https://i.ibb.co/chZjgGBC/headphones.png" },
    { name: "monitor", imageUrl: "https://i.ibb.co/Tx8ry1Fs/monitor.png" },
    {
      name: "webcam",
      imageUrl: "https://i.ibb.co/6Rpms9F4/webcam.jpg",
    },
  ];

  const categories: Record<string, { id: number; imageUrl?: string }> = {};

  for (const c of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: c.name },
      update: { imageUrl: c.imageUrl },
      create: { name: c.name, imageUrl: c.imageUrl },
    });
    categories[c.name] = {
      id: category.id,
      imageUrl: category.imageUrl ?? undefined,
    };
  }

  const brandsData = [
    { name: "rog", imageUrl: "https://i.ibb.co/hxZ62bqS/ROG-Logo.png" },
    {
      name: "logitech",
      imageUrl: "https://i.ibb.co/jvD8fKQK/Logitech-Logo.png",
    },
    { name: "jbl", imageUrl: "https://i.ibb.co/FbKvp2Jw/JBL-Logo.png" },
    { name: "aoc", imageUrl: "https://i.ibb.co/TqLh8gDT/AOC-Logo.png" },
    { name: "razer", imageUrl: "https://i.ibb.co/35ZNnRVR/Razer-Logo.png" },
    { name: "rexus", imageUrl: "https://i.ibb.co/NgS9rbbn/Rexus-Logo.png" },
  ];
  const brands: Record<string, { id: number; imageUrl?: string }> = {};

  for (const brandData of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { name: brandData.name },
      update: { imageUrl: brandData.imageUrl },
      create: { name: brandData.name, imageUrl: brandData.imageUrl },
    });
    brands[brandData.name] = {
      id: brand.id,
      imageUrl: brand.imageUrl ?? undefined,
    };
  }

 const products = [
  {
    name: "ROG Strix Gaming Mouse",
    price: 69.99,
    stock: 30,
    description:
      "The ROG Strix Gaming Mouse is engineered for competitive gamers who demand precision and durability. It features a high-accuracy optical sensor with adjustable DPI, lightweight chassis for fast flicks, and fully programmable buttons and profiles so you can customize macros and sensitivity on the fly. The textured grips and tuned switches deliver consistent clicks session after session, while the RGB lighting and software integration let you tailor the mouse to your rig.",
    category: "mouse",
    brand: "rog",
  },
  {
    name: "Logitech MX Master Mouse",
    price: 99.99,
    stock: 20,
    description:
      "The Logitech MX Master is a premium ergonomic mouse built for productivity and comfort during long workdays. It offers an advanced scroll wheel for both precise and hyper-fast scrolling, multi-device pairing, and application-specific customizations. Its sculpted shape supports your hand naturally, reducing fatigue; the precise sensor tracks on virtually any surface, including glass.",
    category: "mouse",
    brand: "logitech",
  },
  {
    name: "Razer DeathAdder Essential",
    price: 59.99,
    stock: 25,
    description:
      "The Razer DeathAdder Essential is a classic, no-nonsense gaming mouse known for its comfortable shape and reliable performance. It delivers precise tracking, responsive switches, and a lightweight but sturdy design that suits both newcomers and seasoned players. With straightforward software for sensitivity and button mapping, it provides an accessible entry point to competitive gaming.",
    category: "mouse",
    brand: "razer",
  },
  {
    name: "AOC Gaming Mouse GM200",
    price: 49.99,
    stock: 18,
    description:
      "The AOC GM200 is an affordable gaming mouse that punches above its price with adjustable DPI and a durable build. It offers a comfortable grip, responsive buttons, and tactile feedback for everyday gaming and casual esports. Ideal for budget-conscious players, the GM200 balances essential features with solid ergonomics to deliver dependable performance.",
    category: "mouse",
    brand: "aoc",
  },
  {
    name: "Rexus Daxa Air Mini",
    price: 44.99,
    stock: 22,
    description:
      "The Rexus Daxa Air Mini is a lightweight, compact mouse designed for fast movement and accuracy in MOBAs and FPS games. Its slim profile and low weight allow quick wrist motions, while its modern aesthetic fits minimalist setups. Tuned for swift response and comfort during longer sessions, it’s a practical choice for gamers who prefer agility over bulk.",
    category: "mouse",
    brand: "rexus",
  },
  {
    name: "ROG Mechanical Keyboard RX",
    price: 149.99,
    stock: 15,
    description:
      "The ROG Mechanical Keyboard RX is built for high-performance gaming with tactile mechanical switches and dynamic per-key RGB lighting. It provides crisp actuation, durable keycaps, and an aluminum top plate for rigidity and premium feel. Advanced macro support, on-board profiles, and anti-ghosting guarantee reliable input during intense competitive play.",
    category: "keyboard",
    brand: "rog",
  },
  {
    name: "Logitech MX Keys",
    price: 119.99,
    stock: 18,
    description:
      "Logitech MX Keys is a low-profile wireless keyboard designed for comfortable, accurate typing in professional settings. It features smart backlighting, stable key switches that reduce noise, and cross-device connectivity for seamless workflow across a laptop, tablet, and desktop. The refined layout and responsive keys make it well suited for heavy typing, editing, and creative work.",
    category: "keyboard",
    brand: "logitech",
  },
  {
    name: "Razer BlackWidow V3",
    price: 159.99,
    stock: 10,
    description:
      "The Razer BlackWidow V3 is a feature-rich mechanical keyboard tailored to gamers who want premium switches and extensive customization. It includes Razer’s tactile or linear switches, robust media controls, and full RGB Chroma lighting with deep software integration. With a reinforced frame and high actuation reliability, it’s engineered for longevity through years of intense gameplay.",
    category: "keyboard",
    brand: "razer",
  },
  {
    name: "AOC Mechanical Keyboard GK500",
    price: 89.99,
    stock: 14,
    description:
      "The AOC GK500 is a solid mechanical keyboard offering strong responsiveness and durability for everyday gaming and typing. It combines dependable mechanical switches with an ergonomic layout and a clean aesthetic. Designed for users seeking mechanical feel without premium pricing, the GK500 delivers satisfying key travel and consistent performance.",
    category: "keyboard",
    brand: "aoc",
  },
  {
    name: "Rexus Mechanical Keyboard Legionare",
    price: 79.99,
    stock: 20,
    description:
      "The Rexus Legionare is a budget-friendly mechanical keyboard that balances performance and value. It provides a classic key layout, durable switches, and a sturdy build that stands up to long gaming sessions and daily use. With simple customization options and reliable actuation, it’s a practical pick for gamers and typists alike.",
    category: "keyboard",
    brand: "rexus",
  },
  {
    name: "JBL Quantum 100",
    price: 79.99,
    stock: 25,
    description:
      "JBL Quantum 100 offers clear and balanced audio tuned for gaming, providing immersive sound at an accessible price point. The headset features a comfortable, lightweight design and an integrated microphone for clear voice communication. Its audio profile emphasizes clarity for in-game cues and chat, making it a solid option for casual and competitive players.",
    category: "headphone",
    brand: "jbl",
  },
  {
    name: "Logitech G Pro Headset",
    price: 129.99,
    stock: 12,
    description:
      "The Logitech G Pro Headset is engineered for esports pros and streamers seeking accurate sound staging and comfortable build quality. It delivers crisp highs and strong mids for positional audio, effective noise isolation, and a detachable boom mic for broadcast-quality voice capture. The lightweight frame and plush earcups allow extended wear without sacrificing performance.",
    category: "headphone",
    brand: "logitech",
  },
  {
    name: "Razer Kraken X",
    price: 89.99,
    stock: 20,
    description:
      "Razer Kraken X is a lightweight gaming headset that emphasizes comfort and virtual surround sound to enhance in-game awareness. It offers well-padded ear cushions, precise audio tuning for gaming, and a bendable mic for clear communications. Compact and easy to wear for hours, it’s a great all-around headset for multiplayer sessions and streaming.",
    category: "headphone",
    brand: "razer",
  },
  {
    name: "AOC Gaming Headset GH200",
    price: 69.99,
    stock: 15,
    description:
      "The AOC GH200 is a budget-friendly gaming headset that provides dependable sound and solid construction for everyday use. It features cushioned earcups, an adjustable headband, and a reliable microphone for team voice chat. Designed to deliver comfortable audio performance without breaking the bank, it’s practical for casual gamers.",
    category: "headphone",
    brand: "aoc",
  },
  {
    name: "Rexus Gaming Headset Vonix",
    price: 59.99,
    stock: 18,
    description:
      "Rexus Vonix is an eye-catching gaming headset offering comfortable fit and decent audio quality at an entry-level price. It’s built with breathable ear padding and a flexible microphone for clear communication. While focused on affordability, it provides satisfactory sound for in-game effects and voice calls.",
    category: "headphone",
    brand: "rexus",
  },
  {
    name: 'AOC Gaming Monitor 24" 144Hz',
    price: 229.99,
    stock: 10,
    description:
      "The AOC 24\" 144Hz gaming monitor delivers smooth motion and low input lag ideal for fast-paced FPS and competitive titles. Its high refresh rate and responsive pixel response time reduce motion blur and improve target tracking. With adaptive-sync support and vivid colors, it offers excellent value for players seeking performance at a reasonable price.",
    category: "monitor",
    brand: "aoc",
  },
  {
    name: 'ROG Swift Monitor 27"',
    price: 399.99,
    stock: 6,
    description:
      "The ROG Swift 27\" is a high-end gaming monitor designed for enthusiasts who demand superior color accuracy and ultra-low latency. It features fast panel technology, wide color gamut, and advanced synchronization for tear-free gameplay. Built with a robust stand and premium materials, it’s aimed at creators and competitive gamers who want best-in-class visuals.",
    category: "monitor",
    brand: "rog",
  },
  {
    name: 'Logitech Office Monitor 24"',
    price: 189.99,
    stock: 14,
    description:
      "The Logitech Office Monitor 24\" is optimized for productivity with a comfortable viewing angle and eye-care technologies to reduce fatigue. It provides a crisp picture for spreadsheets, documents, and video calls, and integrates easily into multi-monitor setups. The reliable panel and ergonomic adjustments make it ideal for office environments or home workstations.",
    category: "monitor",
    brand: "logitech",
  },
  {
    name: 'Razer Raptor Monitor 27"',
    price: 499.99,
    stock: 5,
    description:
      "The Razer Raptor 27\" is a premium gaming monitor that combines high refresh rates, excellent color reproduction, and a sleek industrial design. It includes fast response times and advanced HDR features to deliver vivid, lifelike images and smooth gameplay. Designed for enthusiasts and creators, the Raptor brings both style and performance to desktop setups.",
    category: "monitor",
    brand: "razer",
  },
  {
    name: 'Rexus Curved Monitor 32"',
    price: 279.99,
    stock: 8,
    description:
      "The Rexus 32\" Curved Monitor enhances immersion with a gentle curve and a large, spacious screen ideal for productivity and gaming. The curved panel reduces eye movement across the display and improves perceived depth, while the high-resolution panel supports multitasking and cinematic viewing. It’s a great choice for users who want a more enveloping visual experience without stepping into ultra-premium pricing.",
    category: "monitor",
    brand: "rexus",
  },
  {
    name: "Logitech C920 HD Pro",
    price: 99.99,
    stock: 20,
    description:
      "The Logitech C920 HD Pro is a versatile Full HD webcam that delivers sharp video for conferencing and streaming. It offers clear image quality, reliable autofocus, and stereo audio capture to improve clarity in calls and recordings. Built for professionals and content creators, it integrates well with popular streaming and meeting platforms.",
    category: "webcam",
    brand: "logitech",
  },
  {
    name: "Razer Kiyo Pro",
    price: 179.99,
    stock: 10,
    description:
      "The Razer Kiyo Pro is a premium webcam aimed at streamers and creators who need superior image quality in diverse lighting. It features a large sensor with excellent low-light performance, configurable field-of-view, and high-quality color reproduction. Lightweight and compact, it’s ideal for live streaming, podcasts, and professional video production.",
    category: "webcam",
    brand: "razer",
  },
  {
    name: "AOC Webcam HD 1080p",
    price: 69.99,
    stock: 15,
    description:
      "The AOC 1080p webcam is an affordable, easy-to-use option for everyday video calls and remote work. It produces reliable HD video, has straightforward plug-and-play setup, and delivers stable performance for online meetings and classes. Designed for practicality, it’s suitable for home offices and students.",
    category: "webcam",
    brand: "aoc",
  },
  {
    name: "Rexus Webcam Pro 720p",
    price: 49.99,
    stock: 18,
    description:
      "The Rexus Webcam Pro 720p is a basic camera for clear video conferencing and casual streaming. It offers dependable 720p resolution with simple controls and broad compatibility with common conferencing apps. Lightweight and budget-oriented, it’s useful for users who need a straightforward, no-frills webcam.",
    category: "webcam",
    brand: "rexus",
  },
  {
    name: "ROG Eye Webcam",
    price: 129.99,
    stock: 12,
    description:
      "The ROG Eye Webcam is built for gamers and streamers who require crisp video and professional features. It offers high-resolution capture, reliable autofocus, and enhanced low-light capabilities to ensure consistent image quality during streams. With a design that complements gaming setups and solid software support, it’s a strong option for content creators.",
    category: "webcam",
    brand: "rog",
  },
];

  for (const p of products) {
    const category = categories[p.category];
    const brand = brands[p.brand];

    if (!category || !brand) {
      console.warn(`Skipping product "${p.name}": category or brand not found`);
      continue;
    }

    await prisma.product.upsert({
      where: { name: p.name },
      update: {
        price: p.price,
        stock: p.stock,
        imageUrl: category.imageUrl || "",
        description: p.description,
        categoryId: category.id,
        brandId: brand.id,
      },
      create: {
        name: p.name,
        price: p.price,
        stock: p.stock,
        imageUrl: category.imageUrl || "",
        description: p.description,
        categoryId: category.id,
        brandId: brand.id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
