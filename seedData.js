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
    // Rice
    {
      name: "Basmati Rice 1kg",
      sku: "RICE-001",
      category: find("Rice"),
      price: 280, costPrice: 220, stock: 150, minStock: 20, unit: "kg",
      image: "https://zarafarice.com/wp-content/uploads/2025/04/zarafa1.webp",
    },
    {
      name: "Super Kernel Rice 5kg",
      sku: "RICE-002",
      category: find("Rice"),
      price: 1200, costPrice: 950, stock: 80, minStock: 10, unit: "bag",
      image: "https://springs.com.pk/cdn/shop/files/5733369976796.gif?v=1747850080",
    },

    // Sugar
    {
      name: "White Sugar 1kg",
      sku: "SUG-001",
      category: find("Sugar"),
      price: 160, costPrice: 130, stock: 200, minStock: 30, unit: "kg",
      image: "https://restomart.pk/wp-content/uploads/2024/10/White-Sugar-%E2%80%93-1kg.jpg",
    },
    {
      name: "Brown Sugar 500g",
      sku: "SUG-002",
      category: find("Sugar"),
      price: 120, costPrice: 90, stock: 100, minStock: 15, unit: "pcs",
      image: "https://springs.com.pk/cdn/shop/files/8966000021044.gif?v=1747844012",
    },

    // Flour
    {
      name: "Wheat Flour 1kg",
      sku: "FLR-001",
      category: find("Flour"),
      price: 120, costPrice: 95, stock: 300, minStock: 50, unit: "kg",
      image: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/4d3a8833450133.56ab64de2b87f.jpg",
    },
    {
      name: "Maida Flour 2kg",
      sku: "FLR-002",
      category: find("Flour"),
      price: 200, costPrice: 160, stock: 150, minStock: 25, unit: "pcs",
      image: "https://doublehiranproducts.com/wp-content/uploads/2025/03/Double-Hiran-Products-Maida.jpg",
    },

    // Cooking Oil
    {
      name: "Sunflower Oil 1 Ltr",
      sku: "OIL-001",
      category: find("Cooking Oil"),
      price: 380, costPrice: 320, stock: 100, minStock: 15, unit: "ltr",
      image: "https://www.kraftchemical.com/wp-content/uploads/2023/09/benefits-of-sunflower-oil.jpg",
    },
    {
      name: "Desi Ghee 500g",
      sku: "OIL-002",
      category: find("Cooking Oil"),
      price: 650, costPrice: 550, stock: 60, minStock: 10, unit: "pcs",
      image: "https://www.tabarrukfoods.com/cdn/shop/files/Desi_ghee.jpg?v=1756208167",
    },

    // Milk
    {
      name: "Fresh Milk 1 Ltr",
      sku: "MLK-001",
      category: find("Milk"),
      price: 180, costPrice: 150, stock: 80, minStock: 20, unit: "ltr",
      image: "https://static.vecteezy.com/system/resources/thumbnails/002/299/716/small/flat-style-icon-of-milk-in-big-carton-package-isolated-on-white-background-free-vector.jpg",
    },
    {
      name: "Olpers Milk 250ml",
      sku: "MLK-002",
      category: find("Milk"),
      price: 65, costPrice: 50, stock: 200, minStock: 30, unit: "pcs",
      image: "https://foodpanda.dhmedia.io/image/darkstores/nv-global-catalog/pk/4b949c11-b7b7-42e5-aa5f-c2530ae981d5.jpg?height=480",
    },

    // Biscuits
    {
      name: "Peek Freans Sooper",
      sku: "BSC-001",
      category: find("Biscuits"),
      price: 60, costPrice: 45, stock: 250, minStock: 40, unit: "pcs",
      image: "https://springs.com.pk/cdn/shop/files/8964002758999.gif?v=1747836709",
    },
    {
      name: "LU Prince Biscuit",
      sku: "BSC-002",
      category: find("Biscuits"),
      price: 40, costPrice: 30, stock: 300, minStock: 50, unit: "pcs",
      image: "https://www.sharjahcoop.ae/medias/7622300742393-v360-016.jpg?context=bWFzdGVyfHNjc3w3MzgzNzJ8aW1hZ2UvanBlZ3xjMk56TDJoaE5DOW9Namt2T0Rnd05UTTROek0zTURVeU5pNXFjR2N8N2MwMjI3MTdjN2EyYjU2MjExNjY4NGUzNzRmMDQxMDMwMDZmYTk5NWViZmZmMTI3OTA4ZDYxY2FiOGE3ZDU0NA",
    },

    // Soft Drinks
    {
      name: "Coca Cola 500ml",
      sku: "SDR-001",
      category: find("Soft Drinks"),
      price: 80, costPrice: 60, stock: 4, minStock: 10, unit: "pcs",
      image: "https://www.coca-cola.com/content/dam/onexp/pk/en/brands/coca-cola/coca-cola-sp-images/en_coca-cola_prod_coke_750x750.jpg",
    },
    {
      name: "Pepsi 1.5 Ltr",
      sku: "SDR-002",
      category: find("Soft Drinks"),
      price: 130, costPrice: 100, stock: 80, minStock: 15, unit: "pcs",
      image: "https://www.holdsworthfoods.co.uk/app/holdsworth/assets/images/3e3ff4e945c60d2fdf2f0fa482e0f3df.jpg?v=1619677920",
    },

    // Tea
    {
      name: "Lipton Tea 200g",
      sku: "TEA-001",
      category: find("Tea"),
      price: 350, costPrice: 280, stock: 120, minStock: 20, unit: "pcs",
      image: "https://images.ctfassets.net/1kl8pqs7sp9x/5mT9PqdysCk0IiHc9at2WK/c44ea0a4fdc3d153e5738ea8bf2dc456/Lipton_YL_Product_2x1-H.jpg",
    },
    {
      name: "Tapal Danedar 500g",
      sku: "TEA-002",
      category: find("Tea"),
      price: 550, costPrice: 450, stock: 0, minStock: 15, unit: "pcs",
      image: "https://nayabazar.pk/images/products/C00H6TyNR82n2AQ.jpeg",
    },

    // Soap
    {
      name: "Safeguard Soap 130g",
      sku: "SOP-001",
      category: find("Soap"),
      price: 90, costPrice: 70, stock: 180, minStock: 25, unit: "pcs",
      image: "https://khasmart.pk/wp-content/uploads/2023/09/SafeguardExtraStrongCoolingSoap125Gm_large.jpg.webp",
    },
    {
      name: "Lifebuoy Soap 120g",
      sku: "SOP-002",
      category: find("Soap"),
      price: 75, costPrice: 55, stock: 200, minStock: 30, unit: "pcs",
      image: "https://foodpanda.dhmedia.io/image/darkstores/nv-global-catalog/pk/7a0ed968-9de6-4e5d-8e57-12556141f797.jpg?height=480",
    },

    // Shampoo
    {
      name: "Head & Shoulders 180ml",
      sku: "SHP-001",
      category: find("Shampoo"),
      price: 320, costPrice: 260, stock: 90, minStock: 15, unit: "pcs",
      image: "https://finalchoice.com.pk/cdn/shop/files/Websiteupload_790e4752-ebe2-4e60-9915-971c2a46ec8c.jpg?v=1742287549",
    },
    {
      name: "Sunsilk Shampoo 160ml",
      sku: "SHP-002",
      category: find("Shampoo"),
      price: 280, costPrice: 220, stock: 110, minStock: 15, unit: "pcs",
      image: "https://foodpanda.dhmedia.io/image/darkstores/nv-global-catalog/pk/ce07e35d-e70b-4ed3-b621-aad242050b13.jpg?height=480",
    },
  ];
};

const seedData = async () => {
  try {
    await connectDB();

    // Categories add karo
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
        console.log(`⚠️ Already exists: ${cat.name}`);
      }
    }

    // Products add karo
    console.log("\n🌱 Adding products...");
    const products = getProducts(createdCategories);
    for (const product of products) {
      const exists = await Product.findOne({ sku: product.sku });
      if (!exists) {
        await Product.create(product);
        console.log(`✅ Product: ${product.name}`);
      } else {
        console.log(`⚠️ Already exists: ${product.name}`);
      }
    }

    console.log("\n🎉 All data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedData();