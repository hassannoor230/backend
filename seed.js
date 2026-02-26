const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const User = require("./models/User");
const connectDB = require("./config/db");

const seedUsers = async () => {
  try {
    await connectDB();

    const users = [
      {
        name: "Super Admin",
        email: "admin@pos.com",
        password: "admin123",
        role: "admin",
        phone: "03001234567",
      },
      {
        name: "Cashier User",
        email: "cashier@pos.com",
        password: "cashier123",
        role: "cashier",
        phone: "03001234568",
      },
      {
        name: "Inventory Manager",
        email: "inventory@pos.com",
        password: "inventory123",
        role: "inventory",
        phone: "03001234569",
      },
    ];

    for (const userData of users) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`✅ Created: ${userData.name} (${userData.role})`);
      } else {
        console.log(`⚠️ Already exists: ${userData.email}`);
      }
    }

    console.log("🎉 All users ready!");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedUsers();