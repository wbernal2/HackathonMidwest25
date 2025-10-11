require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
  });

  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. Connection OK');
  } catch (err) {
    console.error('Connection test failed:', err);
  } finally {
    await client.close();
  }
})();
