const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Category = require("./models/Category");
const Product = require("./models/Product");

const categories = [
  { name: "Rice", description: "All types of rice" },
  { name: "Sugar", description: "Sugar and sweeteners" },
  { name: "Flour", description: "All types of flour" },
  { name: "Cooking Oil", description: "Oils and ghee" },
  { name: "Milk", description: "Dairy products" },
  { name: "Biscuits", description: "Biscuits and cookies" },
  { name: "Soft Drinks", description: "Cold drinks and juices" },
  { name: "Tea", description: "Tea and beverages" },
  { name: "Soap", description: "Bath and hand soaps" },
  { name: "Shampoo", description: "Hair care products" },
];

const getProducts = (cats) => {
  const find = (name) => cats.find((c) => c.name === name)?._id;

  return [

    // ── RICE ──────────────────────────────────
    {
      name: "Basmati Rice",
      sku: "RICE-001",
      category: find("Rice"),
      price: 280, costPrice: 220, stock: 150, minStock: 20, unit: "kg",
      image: "https://zarafarice.com/wp-content/uploads/2025/04/zarafa1.webp",
      variants: [
        { name: "1 kg",  price: 280,  costPrice: 220, stock: 150 },
        { name: "5 kg",  price: 1300, costPrice: 1050, stock: 80 },
        { name: "10 kg", price: 2500, costPrice: 2000, stock: 40 },
        { name: "25 kg", price: 6000, costPrice: 4800, stock: 15 },
      ],
    },
    {
      name: "Super Kernel Rice",
      sku: "RICE-002",
      category: find("Rice"),
      price: 260, costPrice: 200, stock: 100, minStock: 15, unit: "kg",
      image: "https://springs.com.pk/cdn/shop/files/5733369976796.gif?v=1747850080",
      variants: [
        { name: "1 kg",  price: 260,  costPrice: 200, stock: 100 },
        { name: "5 kg",  price: 1200, costPrice: 950,  stock: 60 },
        { name: "10 kg", price: 2300, costPrice: 1850, stock: 30 },
      ],
    },

    // ── SUGAR ─────────────────────────────────
    {
      name: "White Sugar",
      sku: "SUG-001",
      category: find("Sugar"),
      price: 160, costPrice: 130, stock: 200, minStock: 30, unit: "kg",
      image: "https://restomart.pk/wp-content/uploads/2024/10/White-Sugar-%E2%80%93-1kg.jpg",
      variants: [
        { name: "500 g", price: 85,   costPrice: 68,  stock: 120 },
        { name: "1 kg",  price: 160,  costPrice: 130, stock: 200 },
        { name: "5 kg",  price: 750,  costPrice: 620, stock: 60  },
      ],
    },
    {
      name: "Brown Sugar",
      sku: "SUG-002",
      category: find("Sugar"),
      price: 120, costPrice: 90, stock: 100, minStock: 15, unit: "pcs",
      image: "https://springs.com.pk/cdn/shop/files/8966000021044.gif?v=1747844012",
      variants: [
        { name: "250 g", price: 70,  costPrice: 52, stock: 80 },
        { name: "500 g", price: 120, costPrice: 90, stock: 100 },
        { name: "1 kg",  price: 230, costPrice: 175, stock: 50 },
      ],
    },

    // ── FLOUR ─────────────────────────────────
    {
      name: "Wheat Flour (Aata)",
      sku: "FLR-001",
      category: find("Flour"),
      price: 120, costPrice: 95, stock: 300, minStock: 50, unit: "kg",
      image: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/4d3a8833450133.56ab64de2b87f.jpg",
      variants: [
        { name: "1 kg",  price: 120,  costPrice: 95,   stock: 300 },
        { name: "5 kg",  price: 560,  costPrice: 440,  stock: 120 },
        { name: "10 kg", price: 1050, costPrice: 820,  stock: 60  },
        { name: "20 kg", price: 1950, costPrice: 1550, stock: 25  },
      ],
    },
    {
      name: "Maida Flour",
      sku: "FLR-002",
      category: find("Flour"),
      price: 200, costPrice: 160, stock: 150, minStock: 25, unit: "pcs",
      image: "https://cdn.dribbble.com/userupload/15224642/file/original-c928afd96ef03c50beec53cc5ff37b07.jpg?resize=2048x1877&vertical=center",
      variants: [
        { name: "1 kg", price: 110, costPrice: 85,  stock: 150 },
        { name: "2 kg", price: 200, costPrice: 160, stock: 100 },
        { name: "5 kg", price: 480, costPrice: 380, stock: 50  },
      ],
    },

    // ── COOKING OIL ───────────────────────────
    {
      name: "Sunflower Oil",
      sku: "OIL-001",
      category: find("Cooking Oil"),
      price: 380, costPrice: 320, stock: 100, minStock: 15, unit: "ltr",
      image: "https://www.kraftchemical.com/wp-content/uploads/2023/09/benefits-of-sunflower-oil.jpg",
      variants: [
        { name: "500 ml", price: 200, costPrice: 165, stock: 120 },
        { name: "1 Ltr",  price: 380, costPrice: 320, stock: 100 },
        { name: "3 Ltr",  price: 1050, costPrice: 880, stock: 50 },
        { name: "5 Ltr",  price: 1700, costPrice: 1420, stock: 30 },
      ],
    },
    {
      name: "Desi Ghee",
      sku: "OIL-002",
      category: find("Cooking Oil"),
      price: 650, costPrice: 550, stock: 60, minStock: 10, unit: "pcs",
      image: "https://www.tabarrukfoods.com/cdn/shop/files/Desi_ghee.jpg?v=1756208167",
      variants: [
        { name: "250 g", price: 350,  costPrice: 290,  stock: 80 },
        { name: "500 g", price: 650,  costPrice: 550,  stock: 60 },
        { name: "1 kg",  price: 1250, costPrice: 1050, stock: 30 },
      ],
    },

    // ── MILK ──────────────────────────────────
    {
      name: "Olpers Milk",
      sku: "MLK-001",
      category: find("Milk"),
      price: 65, costPrice: 50, stock: 200, minStock: 30, unit: "pcs",
      image: "https://foodpanda.dhmedia.io/image/darkstores/nv-global-catalog/pk/4b949c11-b7b7-42e5-aa5f-c2530ae981d5.jpg?height=480",
      variants: [
        { name: "250 ml", price: 65,  costPrice: 50,  stock: 200 },
        { name: "500 ml", price: 120, costPrice: 95,  stock: 150 },
        { name: "1 Ltr",  price: 220, costPrice: 175, stock: 100 },
      ],
    },
    {
      name: "Nestle Milk Pack",
      sku: "MLK-002",
      category: find("Milk"),
      price: 70, costPrice: 55, stock: 180, minStock: 25, unit: "pcs",
      image: "https://static.vecteezy.com/system/resources/thumbnails/002/299/716/small/flat-style-icon-of-milk-in-big-carton-package-isolated-on-white-background-free-vector.jpg",
      variants: [
        { name: "250 ml", price: 70,  costPrice: 55,  stock: 180 },
        { name: "500 ml", price: 130, costPrice: 100, stock: 120 },
        { name: "1 Ltr",  price: 240, costPrice: 188, stock: 80  },
      ],
    },

    // ── BISCUITS ──────────────────────────────
    {
      name: "Peek Freans Sooper",
      sku: "BSC-001",
      category: find("Biscuits"),
      price: 60, costPrice: 45, stock: 250, minStock: 40, unit: "pcs",
      image: "https://springs.com.pk/cdn/shop/files/8964002758999.gif?v=1747836709",
      variants: [
        { name: "Small (62g)",   price: 30,  costPrice: 22, stock: 300 },
        { name: "Regular (120g)", price: 60, costPrice: 45, stock: 250 },
        { name: "Family (240g)", price: 110, costPrice: 82, stock: 150 },
      ],
    },
    {
      name: "LU Prince Biscuit",
      sku: "BSC-002",
      category: find("Biscuits"),
      price: 40, costPrice: 30, stock: 300, minStock: 50, unit: "pcs",
      image: "https://www.sharjahcoop.ae/medias/7622300742393-v360-016.jpg?context=bWFzdGVyfHNjc3w3MzgzNzJ8aW1hZ2UvanBlZ3xjMk56TDJoaE5DOW9Namt2T0Rnd05UTTROek0zTURVeU5pNXFjR2N8N2MwMjI3MTdjN2EyYjU2MjExNjY4NGUzNzRmMDQxMDMwMDZmYTk5NWViZmZmMTI3OTA4ZDYxY2FiOGE3ZDU0NA",
      variants: [
        { name: "Small (56g)",   price: 25, costPrice: 18, stock: 350 },
        { name: "Regular (100g)", price: 40, costPrice: 30, stock: 300 },
        { name: "Big (200g)",    price: 75, costPrice: 55, stock: 150 },
      ],
    },

    // ── SOFT DRINKS ─────
    {
      name: "Coca Cola",
      sku: "SDR-001",
      category: find("Soft Drinks"),
      price: 50, costPrice: 38, stock: 200, minStock: 30, unit: "pcs",
      image: "https://www.coca-cola.com/content/dam/onexp/pk/en/brands/coca-cola/coca-cola-sp-images/en_coca-cola_prod_coke_750x750.jpg",
      variants: [
        { name: "250 ml", price: 50,  costPrice: 38,  stock: 200 },
        { name: "500 ml", price: 80,  costPrice: 60,  stock: 150 },
        { name: "1.5 Ltr", price: 130, costPrice: 100, stock: 80 },
        { name: "2.25 Ltr", price: 180, costPrice: 140, stock: 40 },
      ],
    },
    {
      name: "Pepsi",
      sku: "SDR-002",
      category: find("Soft Drinks"),
      price: 50, costPrice: 38, stock: 200, minStock: 30, unit: "pcs",
      image: "https://www.holdsworthfoods.co.uk/app/holdsworth/assets/images/3e3ff4e945c60d2fdf2f0fa482e0f3df.jpg?v=1619677920",
      variants: [
        { name: "250 ml",  price: 50,  costPrice: 38,  stock: 200 },
        { name: "500 ml",  price: 80,  costPrice: 60,  stock: 150 },
        { name: "1.5 Ltr", price: 130, costPrice: 100, stock: 80  },
        { name: "2.25 Ltr", price: 180, costPrice: 140, stock: 40 },
      ],
    },
    {
      name: "7UP",
      sku: "SDR-003",
      category: find("Soft Drinks"),
      price: 50, costPrice: 38, stock: 180, minStock: 25, unit: "pcs",
      image: "https://static.wixstatic.com/media/75b9b9_3861b5532acd4cb694c685ae675728c7~mv2.jpg/v1/fill/w_1663,h_935,al_c,q_85/75b9b9_3861b5532acd4cb694c685ae675728c7~mv2.jpg",
      variants: [
        { name: "250 ml",  price: 50,  costPrice: 38,  stock: 180 },
        { name: "500 ml",  price: 80,  costPrice: 60,  stock: 130 },
        { name: "1.5 Ltr", price: 130, costPrice: 100, stock: 70  },
      ],
    },

    // ── TEA ───────────────────────────────────
    {
      name: "Lipton Tea",
      sku: "TEA-001",
      category: find("Tea"),
      price: 350, costPrice: 280, stock: 120, minStock: 20, unit: "pcs",
      image: "https://images.ctfassets.net/1kl8pqs7sp9x/5mT9PqdysCk0IiHc9at2WK/c44ea0a4fdc3d153e5738ea8bf2dc456/Lipton_YL_Product_2x1-H.jpg",
      variants: [
        { name: "100 g",  price: 180, costPrice: 145, stock: 150 },
        { name: "200 g",  price: 350, costPrice: 280, stock: 120 },
        { name: "400 g",  price: 680, costPrice: 540, stock: 60  },
      ],
    },
    {
      name: "Tapal Danedar",
      sku: "TEA-002",
      category: find("Tea"),
      price: 550, costPrice: 450, stock: 100, minStock: 15, unit: "pcs",
      image: "https://nayabazar.pk/images/products/C00H6TyNR82n2AQ.jpeg",
      variants: [
        { name: "95 g",  price: 110, costPrice: 85,  stock: 200 },
        { name: "190 g", price: 210, costPrice: 165, stock: 150 },
        { name: "500 g", price: 550, costPrice: 450, stock: 100 },
        { name: "1 kg",  price: 1050, costPrice: 850, stock: 40 },
      ],
    },

    // ── SOAP ──────────────────────────────────
    {
      name: "Safeguard Soap",
      sku: "SOP-001",
      category: find("Soap"),
      price: 90, costPrice: 70, stock: 180, minStock: 25, unit: "pcs",
      image: "https://khasmart.pk/wp-content/uploads/2023/09/SafeguardExtraStrongCoolingSoap125Gm_large.jpg.webp",
      variants: [
        { name: "White",     price: 90,  costPrice: 70, stock: 180 },
        { name: "Lemon",     price: 90,  costPrice: 70, stock: 150 },
        { name: "Aloe Vera", price: 95,  costPrice: 73, stock: 120 },
        { name: "Charcoal",  price: 100, costPrice: 78, stock: 80  },
      ],
    },
    {
      name: "Lifebuoy Soap",
      sku: "SOP-002",
      category: find("Soap"),
      price: 75, costPrice: 55, stock: 200, minStock: 30, unit: "pcs",
      image: "https://foodpanda.dhmedia.io/image/darkstores/nv-global-catalog/pk/7a0ed968-9de6-4e5d-8e57-12556141f797.jpg?height=480",
      variants: [
        { name: "Red (Total Protection)", price: 75, costPrice: 55, stock: 200 },
        { name: "Blue (Strong)",          price: 75, costPrice: 55, stock: 180 },
        { name: "Lemon Fresh",            price: 80, costPrice: 60, stock: 150 },
      ],
    },
    {
      name: "Dettol Soap",
      sku: "SOP-003",
      category: find("Soap"),
      price: 95, costPrice: 72, stock: 160, minStock: 20, unit: "pcs",
      image: "https://lhr.greenvalley.pk/cdn/shop/files/Dettol20Soap20Skin20Care20Pink145G_ddd11563-0e4f-4393-96d3-6e4456212220.webp?v=1754904872",
      variants: [
        { name: "Original",     price: 95,  costPrice: 72, stock: 160 },
        { name: "Cool",         price: 95,  costPrice: 72, stock: 140 },
        { name: "Skincare",     price: 100, costPrice: 76, stock: 100 },
      ],
    },

    // ── SHAMPOO ───────────────────────────────
    {
      name: "Head & Shoulders",
      sku: "SHP-001",
      category: find("Shampoo"),
      price: 320, costPrice: 260, stock: 90, minStock: 15, unit: "pcs",
      image: "https://finalchoice.com.pk/cdn/shop/files/Websiteupload_790e4752-ebe2-4e60-9915-971c2a46ec8c.jpg?v=1742287549",
      variants: [
        { name: "90 ml",  price: 170, costPrice: 135, stock: 120 },
        { name: "180 ml", price: 320, costPrice: 260, stock: 90  },
        { name: "360 ml", price: 580, costPrice: 470, stock: 50  },
      ],
    },
    {
      name: "Sunsilk Shampoo",
      sku: "SHP-002",
      category: find("Shampoo"),
      price: 280, costPrice: 220, stock: 110, minStock: 15, unit: "pcs",
      image: "https://foodpanda.dhmedia.io/image/darkstores/nv-global-catalog/pk/ce07e35d-e70b-4ed3-b621-aad242050b13.jpg?height=480",
      variants: [
        { name: "Black Shine 160ml",    price: 280, costPrice: 220, stock: 110 },
        { name: "Soft & Smooth 160ml",  price: 280, costPrice: 220, stock: 100 },
        { name: "Stunning Shine 160ml", price: 280, costPrice: 220, stock: 90  },
        { name: "Black Shine 360ml",    price: 550, costPrice: 430, stock: 50  },
      ],
    },
    {
      name: "Pantene Shampoo",
      sku: "SHP-003",
      category: find("Shampoo"),
      price: 350, costPrice: 280, stock: 80, minStock: 12, unit: "pcs",
      image: "https://foodpanda.dhmedia.io/image/darkstores/nv-global-catalog/pk/20fd7d63-74c8-48cc-8c5a-3643704e74ed.jpg?height=480",
      variants: [
        { name: "90 ml",  price: 185, costPrice: 145, stock: 100 },
        { name: "180 ml", price: 350, costPrice: 280, stock: 80  },
        { name: "360 ml", price: 630, costPrice: 500, stock: 40  },
      ],
    },

  ];
};

const seedData = async () => {
  try {
    await connectDB();

    // Categories
    console.log("🌱 Adding categories...");
    const createdCategories = [];
    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        const created = await Category.create(cat);
        createdCategories.push(created);
        console.log(`✅ Category: ${cat.name}`);
      } else {
        createdCategories.push(exists);
        console.log(`⚠️  Already exists: ${cat.name}`);
      }
    }

    // Products with variants
    console.log("\n🌱 Adding products with variants...");
    const products = getProducts(createdCategories);
    for (const product of products) {
      const exists = await Product.findOne({ sku: product.sku });
      if (!exists) {
        await Product.create(product);
        console.log(`✅ Product: ${product.name} (${product.variants?.length || 0} variants)`);
      } else {
        // Update variants on existing product
        await Product.findOneAndUpdate(
          { sku: product.sku },
          { $set: { variants: product.variants } }
        );
        console.log(`🔄 Updated variants: ${product.name}`);
      }
    }

    console.log("\n🎉 All data seeded with variants!");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedData();