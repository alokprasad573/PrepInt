require("dotenv").config();
const { MongoClient } = require("mongodb");

const LOCAL_DB_NAME = "PrepInt";

async function migrateLocalToAtlas() {
  const localUri = process.env.MONGO_URI;
  const atlasUri = process.env.ATLAS_URI;

  if (!localUri || !atlasUri) {
    throw new Error("MONGO_URI and ATLAS_URI must be set in server/.env");
  }

  const localClient = new MongoClient(localUri);
  const atlasClient = new MongoClient(atlasUri);

  try {
    await Promise.all([localClient.connect(), atlasClient.connect()]);
    console.log("✅ Connected to Local MongoDB and MongoDB Atlas");

    const localDb = localClient.db(LOCAL_DB_NAME);
    const atlasDb = atlasClient.db();

    const collections = await localDb.listCollections().toArray();

    for (const { name } of collections) {
      const localCol = localDb.collection(name);
      const atlasCol = atlasDb.collection(name);

      // 1. Copy documents (idempotent upsert by _id)
      const docs = await localCol.find({}).toArray();
      if (docs.length > 0) {
        const ops = docs.map((doc) => ({
          replaceOne: {
            filter: { _id: doc._id },
            replacement: doc,
            upsert: true,
          },
        }));

        const result = await atlasCol.bulkWrite(ops);
        console.log(
          `📦 ${name}: upserted=${result.upsertedCount}, modified=${result.modifiedCount}, matched=${result.matchedCount}`,
        );
      } else {
        console.log(`📦 ${name}: 0 documents (skipped)`);
      }

      // 2. Recreate indexes (except default _id_)
      const indexes = await localCol.indexes();
      for (const idx of indexes) {
        if (idx.name === "_id_") continue;

        const options = { name: idx.name };
        if (idx.unique) options.unique = true;
        if (idx.sparse) options.sparse = true;

        await atlasCol.createIndex(idx.key, options);
        console.log(`🔑 ${name}: index "${idx.name}" ensured`);
      }

      const finalCount = await atlasCol.countDocuments();
      console.log(`✅ ${name}: total in Atlas = ${finalCount}\n`);
    }

    console.log("🎉 Migration completed successfully!");
  } finally {
    await Promise.all([localClient.close(), atlasClient.close()]);
  }
}

migrateLocalToAtlas().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});