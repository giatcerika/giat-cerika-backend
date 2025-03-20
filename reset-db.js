// reset-db.js
const mongoose = require('mongoose');

async function resetDatabase() {
    try {
        await mongoose.connect('mongodb://codingin_thumbgiant:fce27388019c689a128e993ff37d8ff3048e5af7@z5vtt.h.filess.io:27018/codingin_thumbgiant');
        console.log('Connected to MongoDB');

        // Dapatkan nama database
        const dbName = mongoose.connection.db.databaseName;
        console.log(`Working on database: ${dbName}`);

        // Dapatkan semua koleksi
        const collections = await mongoose.connection.db.collections();

        // Drop setiap koleksi
        for (const collection of collections) {
            try {
                await collection.drop();
                console.log(`Dropped collection: ${collection.collectionName}`);
            } catch (err) {
                console.log(`Error dropping collection: ${collection.collectionName}`, err.message);
            }
        }

        console.log('All collections dropped successfully');
        await mongoose.connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Error:', error);
    }
}

resetDatabase();