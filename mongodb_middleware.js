const { MongoClient } = require("mongodb");

module.exports = async function(req, res, next) {
  try {
    // Create a new MongoClient
    const client = new MongoClient('mongodb://localhost:27017');
    // Connect the client to the server (optional starting in v4.7)
    // await client.connect();
    client.on('connectionReady', function() {console.log('database connection ready')})
    client.on('connectionClosed', function() {console.log('database connection closed')})
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to database server");
    req.client = client
    req.db = client.db('ecom_2023')
    next()

  } catch (err) {
    console.log('--------------DATABASE CONNECTION ERROR. mongodb_middleware.js')
    console.log(err.message)
    client.close()
    res.json({error: 'db error'})
  }
}