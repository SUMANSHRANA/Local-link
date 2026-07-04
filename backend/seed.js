/**
 * VeeServe Database Seed Script
 * Run: node seed.js
 * Creates: admin user, sample categories, cities
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/VeeServe";

// Inline schemas (mirrors models)
const userSchema = new mongoose.Schema({
  role: String, fullName: String, emailAddress: String, password: String,
  isActive: { type: Boolean, default: true },
}, { collection: "user_mst" });

const categorySchema = new mongoose.Schema({
  categoryName: String, categoryDescription: String,
  citiesAvailable: [String], imagePath: String, isActive: { type: Boolean, default: true },
}, { collection: "serviceCategory_mst" });

const citySchema = new mongoose.Schema({
  cityName: String, stateName: String, countryName: String, isActive: { type: Boolean, default: true },
}, { collection: "cities_mst" });

const subCategorySchema = new mongoose.Schema({
  title: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCategory" },
}, { collection: "subCategory_mst" });

const serviceSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  type: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCategory" },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
  image: String,
}, { collection: "services_mst" });

const User = mongoose.model("User", userSchema);
const ServiceCategory = mongoose.model("ServiceCategory", categorySchema);
const City = mongoose.model("City", citySchema);
const SubCategory = mongoose.model("SubCategory", subCategorySchema);
const Service = mongoose.model("Service", serviceSchema);

// Subcategories + services keyed by category name
const SERVICE_DATA = {
  Plumbing: {
    subcategories: ["Repairs", "Installation"],
    services: [
      { name: "Tap & Faucet Repair", description: "Fix leaking or dripping taps and faucets.", price: 199, sub: "Repairs" },
      { name: "Pipe Leakage Fix", description: "Detect and repair leaking pipes under sinks or walls.", price: 349, sub: "Repairs" },
      { name: "Toilet Repair", description: "Fix flush tank issues, clogs, and toilet leaks.", price: 299, sub: "Repairs" },
      { name: "Bathroom Fitting Installation", description: "Install showers, taps, and washbasins.", price: 499, sub: "Installation" },
      { name: "Water Tank Cleaning", description: "Deep cleaning and sanitization of overhead water tanks.", price: 399, sub: "Repairs" },
      { name: "Drainage Unclogging", description: "Clear blocked drains and sewage lines.", price: 449, sub: "Repairs" },
    ],
  },
  Electrical: {
    subcategories: ["Repairs", "Installation"],
    services: [
      { name: "Switchboard Repair", description: "Fix faulty switches, sockets, and switchboards.", price: 179, sub: "Repairs" },
      { name: "Fan Installation", description: "Install and balance ceiling or wall fans.", price: 249, sub: "Installation" },
      { name: "Wiring Inspection & Repair", description: "Inspect and repair faulty home wiring.", price: 599, sub: "Repairs" },
      { name: "MCB & Fuse Replacement", description: "Replace faulty MCBs, fuses, and circuit breakers.", price: 299, sub: "Repairs" },
      { name: "Light Fixture Installation", description: "Install tube lights, LED panels, and chandeliers.", price: 199, sub: "Installation" },
      { name: "Inverter & Stabilizer Setup", description: "Installation and wiring of inverters and stabilizers.", price: 699, sub: "Installation" },
    ],
  },
  Cleaning: {
    subcategories: ["Home Cleaning", "Deep Cleaning"],
    services: [
      { name: "Full Home Cleaning", description: "Comprehensive cleaning of all rooms in your home.", price: 999, sub: "Home Cleaning" },
      { name: "Kitchen Deep Cleaning", description: "Degreasing and deep cleaning of kitchen surfaces and chimney.", price: 599, sub: "Deep Cleaning" },
      { name: "Bathroom Deep Cleaning", description: "Tile, tap, and floor sanitization for bathrooms.", price: 399, sub: "Deep Cleaning" },
      { name: "Sofa & Carpet Cleaning", description: "Shampoo and steam cleaning for sofas and carpets.", price: 499, sub: "Home Cleaning" },
      { name: "Office Cleaning", description: "Cleaning service for small to mid-size offices.", price: 1499, sub: "Home Cleaning" },
      { name: "Move-in/Move-out Cleaning", description: "Thorough cleaning before or after relocation.", price: 1299, sub: "Deep Cleaning" },
    ],
  },
  Carpentry: {
    subcategories: ["Furniture", "Repairs"],
    services: [
      { name: "Furniture Assembly", description: "Assemble flat-pack or new furniture items.", price: 299, sub: "Furniture" },
      { name: "Door & Window Repair", description: "Fix sticking doors, hinges, and window frames.", price: 349, sub: "Repairs" },
      { name: "Custom Cabinet Installation", description: "Build and install custom wooden cabinets.", price: 1499, sub: "Furniture" },
      { name: "Lock & Handle Replacement", description: "Replace broken door locks and handles.", price: 199, sub: "Repairs" },
      { name: "Wardrobe Repair", description: "Fix wardrobe shutters, sliders, and shelves.", price: 449, sub: "Repairs" },
      { name: "Wooden Furniture Polishing", description: "Polish and restore wooden furniture finish.", price: 599, sub: "Furniture" },
    ],
  },
  Painting: {
    subcategories: ["Interior", "Exterior"],
    services: [
      { name: "Single Room Painting", description: "Full paint job for one room including primer.", price: 2499, sub: "Interior" },
      { name: "Full Home Interior Painting", description: "Complete interior painting for the whole house.", price: 12999, sub: "Interior" },
      { name: "Exterior Wall Painting", description: "Weatherproof paint for exterior walls.", price: 8999, sub: "Exterior" },
      { name: "Texture Wall Painting", description: "Decorative texture paint finish for accent walls.", price: 3499, sub: "Interior" },
      { name: "Wood & Metal Painting", description: "Enamel paint for doors, grills, and railings.", price: 999, sub: "Exterior" },
      { name: "Waterproofing & Painting", description: "Waterproof coating combined with exterior painting.", price: 5999, sub: "Exterior" },
    ],
  },
  "AC & Appliances": {
    subcategories: ["AC Service", "Appliance Repair"],
    services: [
      { name: "AC General Service", description: "Cleaning and servicing of split or window AC.", price: 499, sub: "AC Service" },
      { name: "AC Gas Refilling", description: "Refill refrigerant gas for cooling issues.", price: 1999, sub: "AC Service" },
      { name: "AC Installation", description: "Installation of new split or window AC unit.", price: 1499, sub: "AC Service" },
      { name: "Refrigerator Repair", description: "Diagnose and fix refrigerator cooling or noise issues.", price: 599, sub: "Appliance Repair" },
      { name: "Washing Machine Repair", description: "Fix drainage, spin, or motor issues in washing machines.", price: 549, sub: "Appliance Repair" },
      { name: "Microwave Repair", description: "Repair heating and control issues in microwave ovens.", price: 399, sub: "Appliance Repair" },
    ],
  },
};

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Admin user
  const existingAdmin = await User.findOne({ role: "admin" });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({
      role: "admin",
      fullName: "VeeServe Admin",
      emailAddress: "admin@veeserve.com",
      password: hashed,
    });
    console.log("✅ Admin created — email: admin@veeserve.com | password: admin123");
  } else {
    console.log("ℹ️  Admin already exists");
  }

  // Categories
  let categories = await ServiceCategory.find();
  if (categories.length === 0) {
    categories = await ServiceCategory.insertMany([
      { categoryName: "Plumbing", categoryDescription: "All plumbing services", isActive: true },
      { categoryName: "Electrical", categoryDescription: "Electrical repairs and installations", isActive: true },
      { categoryName: "Cleaning", categoryDescription: "Home and office cleaning", isActive: true },
      { categoryName: "Carpentry", categoryDescription: "Furniture and woodwork", isActive: true },
      { categoryName: "Painting", categoryDescription: "Interior and exterior painting", isActive: true },
      { categoryName: "AC & Appliances", categoryDescription: "AC servicing and repairs", isActive: true },
    ]);
    console.log("✅ Sample service categories created");
  } else {
    console.log("ℹ️  Categories already exist");
  }

  // Cities
  const cityCount = await City.countDocuments();
  if (cityCount === 0) {
    await City.insertMany([
      { cityName: "Mumbai", stateName: "Maharashtra", countryName: "India", isActive: true },
      { cityName: "Delhi", stateName: "Delhi", countryName: "India", isActive: true },
      { cityName: "Bangalore", stateName: "Karnataka", countryName: "India", isActive: true },
      { cityName: "Hyderabad", stateName: "Telangana", countryName: "India", isActive: true },
      { cityName: "Chennai", stateName: "Tamil Nadu", countryName: "India", isActive: true },
      { cityName: "Pune", stateName: "Maharashtra", countryName: "India", isActive: true },
    ]);
    console.log("✅ Sample cities created");
  } else {
    console.log("ℹ️  Cities already exist");
  }

  // Subcategories + Services for each category
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    for (const cat of categories) {
      const data = SERVICE_DATA[cat.categoryName];
      if (!data) continue;

      // Create subcategories for this category
      const subMap = {};
      for (const subTitle of data.subcategories) {
        let sub = await SubCategory.findOne({ title: subTitle, categoryId: cat._id });
        if (!sub) {
          sub = await SubCategory.create({ title: subTitle, categoryId: cat._id });
        }
        subMap[subTitle] = sub._id;
      }

      // Create services for this category
      const servicesToInsert = data.services.map((s) => ({
        name: s.name,
        description: s.description,
        price: s.price,
        type: cat._id,
        subCategory: subMap[s.sub],
      }));
      await Service.insertMany(servicesToInsert);
      console.log(`✅ Added ${servicesToInsert.length} services for ${cat.categoryName}`);
    }
  } else {
    console.log("ℹ️  Services already exist");
  }

  console.log("\n🎉 Seed complete!");
  console.log("─────────────────────────────");
  console.log("Admin login:  admin@veeserve.com / admin123");
  console.log("─────────────────────────────");
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
