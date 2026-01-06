import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

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
        "Precyzyjna mysz gamingowa zaprojektowana z myślą o e-sporcie. Wyposażona w czuły sensor optyczny oraz programowalne przyciski. Idealna do dynamicznych gier FPS.",
      category: "mouse",
      brand: "rog",
    },
    {
      name: "Logitech MX Master Mouse",
      price: 99.99,
      stock: 20,
      description:
        "Ergonomiczna mysz biurowa klasy premium. Zapewnia komfort nawet podczas wielogodzinnej pracy. Obsługuje wiele urządzeń jednocześnie.",
      category: "mouse",
      brand: "logitech",
    },
    {
      name: "Razer DeathAdder Essential",
      price: 59.99,
      stock: 25,
      description:
        "Klasyczna mysz dla graczy o sprawdzonym kształcie. Doskonała precyzja i szybka reakcja. Idealna zarówno dla początkujących, jak i zaawansowanych graczy.",
      category: "mouse",
      brand: "razer",
    },
    {
      name: "AOC Gaming Mouse GM200",
      price: 49.99,
      stock: 18,
      description:
        "Budżetowa mysz gamingowa z regulowanym DPI. Solidna konstrukcja zapewnia trwałość. Świetny wybór do codziennego grania.",
      category: "mouse",
      brand: "aoc",
    },
    {
      name: "Rexus Daxa Air Mini",
      price: 44.99,
      stock: 22,
      description:
        "Lekka mysz o nowoczesnym designie. Zaprojektowana z myślą o szybkim ruchu i precyzji. Idealna do gier typu MOBA i FPS.",
      category: "mouse",
      brand: "rexus",
    },
    {
      name: "ROG Mechanical Keyboard RX",
      price: 149.99,
      stock: 15,
      description:
        "Mechaniczna klawiatura gamingowa z podświetleniem RGB. Oferuje szybki czas reakcji i wysoką trwałość przełączników. Idealna dla wymagających graczy.",
      category: "keyboard",
      brand: "rog",
    },
    {
      name: "Logitech MX Keys",
      price: 119.99,
      stock: 18,
      description:
        "Bezprzewodowa klawiatura biurowa o niskim profilu. Zapewnia cichą i komfortową pracę. Świetna do pracy biurowej i home office.",
      category: "keyboard",
      brand: "logitech",
    },
    {
      name: "Razer BlackWidow V3",
      price: 159.99,
      stock: 10,
      description:
        "Zaawansowana klawiatura mechaniczna dla graczy. Wyposażona w przełączniki Razer i RGB Chroma. Doskonała do intensywnego grania.",
      category: "keyboard",
      brand: "razer",
    },
    {
      name: "AOC Mechanical Keyboard GK500",
      price: 89.99,
      stock: 14,
      description:
        "Solidna klawiatura mechaniczna do gier. Oferuje dobrą responsywność i trwałość. Idealna do codziennego użytkowania.",
      category: "keyboard",
      brand: "aoc",
    },
    {
      name: "Rexus Mechanical Keyboard Legionare",
      price: 79.99,
      stock: 20,
      description:
        "Mechaniczna klawiatura w przystępnej cenie. Dobrze sprawdza się w grach i pracy. Oferuje klasyczny układ i solidne wykonanie.",
      category: "keyboard",
      brand: "rexus",
    },
    {
      name: "JBL Quantum 100",
      price: 79.99,
      stock: 25,
      description:
        "Słuchawki gamingowe z czystym i wyraźnym dźwiękiem. Zapewniają komfort podczas długich sesji grania. Wyposażone w mikrofon.",
      category: "headphone",
      brand: "jbl",
    },
    {
      name: "Logitech G Pro Headset",
      price: 129.99,
      stock: 12,
      description:
        "Profesjonalny headset dla graczy e-sportowych. Doskonała jakość dźwięku i izolacja hałasu. Idealny do rywalizacji online.",
      category: "headphone",
      brand: "logitech",
    },
    {
      name: "Razer Kraken X",
      price: 89.99,
      stock: 20,
      description:
        "Lekki headset gamingowy zapewniający komfort noszenia. Oferuje przestrzenny dźwięk. Doskonały do gier i rozmów.",
      category: "headphone",
      brand: "razer",
    },
    {
      name: "AOC Gaming Headset GH200",
      price: 69.99,
      stock: 15,
      description:
        "Budżetowy headset dla graczy. Zapewnia dobrą jakość dźwięku i solidne wykonanie. Idealny do codziennego grania.",
      category: "headphone",
      brand: "aoc",
    },
    {
      name: "Rexus Gaming Headset Vonix",
      price: 59.99,
      stock: 18,
      description:
        "Słuchawki gamingowe z efektownym designem. Zapewniają wygodę i przyzwoitą jakość dźwięku. Dobry wybór w swojej klasie cenowej.",
      category: "headphone",
      brand: "rexus",
    },
    {
      name: 'AOC Gaming Monitor 24" 144Hz',
      price: 229.99,
      stock: 10,
      description:
        "Monitor gamingowy z odświeżaniem 144Hz. Zapewnia płynny obraz i szybki czas reakcji. Idealny do gier FPS.",
      category: "monitor",
      brand: "aoc",
    },
    {
      name: 'ROG Swift Monitor 27"',
      price: 399.99,
      stock: 6,
      description:
        "Wysokiej klasy monitor gamingowy 27 cali. Oferuje doskonałe kolory i niski input lag. Przeznaczony dla wymagających graczy.",
      category: "monitor",
      brand: "rog",
    },
    {
      name: 'Logitech Office Monitor 24"',
      price: 189.99,
      stock: 14,
      description:
        "Monitor biurowy do codziennej pracy. Zapewnia komfort dla oczu i dobrą jakość obrazu. Idealny do pracy i nauki.",
      category: "monitor",
      brand: "logitech",
    },
    {
      name: 'Razer Raptor Monitor 27"',
      price: 499.99,
      stock: 5,
      description:
        "Nowoczesny monitor gamingowy o eleganckim designie. Oferuje wysoką rozdzielczość i płynność obrazu. Idealny do gier i multimediów.",
      category: "monitor",
      brand: "razer",
    },
    {
      name: 'Rexus Curved Monitor 32"',
      price: 279.99,
      stock: 8,
      description:
        "Zakrzewiony monitor zapewniający lepsze wrażenia wizualne. Doskonały do pracy i rozrywki. Duży ekran zwiększa komfort użytkowania.",
      category: "monitor",
      brand: "rexus",
    },
    {
      name: "Logitech C920 HD Pro",
      price: 99.99,
      stock: 20,
      description:
        "Kamera internetowa Full HD do wideokonferencji. Zapewnia wyraźny obraz i dobrą jakość dźwięku. Idealna do pracy zdalnej.",
      category: "webcam",
      brand: "logitech",
    },
    {
      name: "Razer Kiyo Pro",
      price: 179.99,
      stock: 10,
      description:
        "Kamera premium dla streamerów i twórców. Oferuje doskonałą jakość obrazu nawet przy słabym świetle. Idealna do streamingu.",
      category: "webcam",
      brand: "razer",
    },
    {
      name: "AOC Webcam HD 1080p",
      price: 69.99,
      stock: 15,
      description:
        "Kamera internetowa do codziennych rozmów online. Zapewnia stabilny obraz i łatwą konfigurację. Dobra do pracy i nauki.",
      category: "webcam",
      brand: "aoc",
    },
    {
      name: "Rexus Webcam Pro 720p",
      price: 49.99,
      stock: 18,
      description:
        "Podstawowa kamera internetowa do wideorozmów. Prosta w obsłudze i kompatybilna z większością aplikacji. Idealna do codziennego użytku.",
      category: "webcam",
      brand: "rexus",
    },
    {
      name: "ROG Eye Webcam",
      price: 129.99,
      stock: 12,
      description:
        "Kamera internetowa zaprojektowana dla graczy i streamerów. Oferuje wysoką jakość obrazu i stabilność. Doskonała do transmisji na żywo.",
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
