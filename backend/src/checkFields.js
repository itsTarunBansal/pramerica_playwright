import { connectDB } from "./db.js";
import { FieldConfig } from "./models/fieldConfig.js";

async function checkDatabase() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB\n");

    const count = await FieldConfig.countDocuments();
    console.log(`📊 Total field configs: ${count}\n`);

    const fields = await FieldConfig.find().sort({ order: 1 }).lean();
    
    if (fields.length === 0) {
      console.log("❌ No fields found in database!");
      console.log("\n💡 Run: npm run seed:fields\n");
    } else {
      console.log("✅ Fields found:\n");
      fields.forEach((f, i) => {
        console.log(`${i + 1}. ${f.label} (${f.fieldName})`);
        console.log(`   Section: ${f.section}`);
        console.log(`   Action: ${f.actionType}`);
        console.log(`   Active: ${f.isActive}`);
        console.log("");
      });
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

checkDatabase();
