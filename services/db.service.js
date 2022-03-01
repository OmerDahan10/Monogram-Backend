const MongoClient = require('mongodb').MongoClient
// const uri = 'mongodb+srv://omerdahan:omer1234@cluster0.ykblk.mongodb.net/TOY_DB?retryWrites=true&w=majority'
// const client = new MongoClient(uri,{useNewUrlParser:true});
// client.connect(err=>{
//     const collection = client.db('TOY_DB').collection('toy')
//     collection.find().toArray()
//     .then(res=>console.log(res))
//     client.close()
// });
// const config = require('../config')

module.exports = {
    getCollection
}

// Database Name
const dbName = 'PHOTOGRAM_DB'

var dbConn = null

async function getCollection(collectionName) {
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {
    if (dbConn) return dbConn
    try {
        const uri = 'mongodb+srv://omerdahan:omer1234@cluster0.ykblk.mongodb.net/PHOTOGRAM_DB?retryWrites=true&w=majority'
        const client = await MongoClient.connect(uri, { useNewUrlParser: true })
        const db = client.db(dbName)
        dbConn = db
        return db
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}



// async function connect() {
//     if (dbConn) return dbConn
//     try {
//         const client = await MongoClient.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
//         const db = client.db(dbName)
//         dbConn = db
//         return db
//     } catch (err) {
//         logger.error('Cannot Connect to DB', err)
//         throw err
//     }
// }




