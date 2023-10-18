const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.AUTOMOTIVE_DB}:${process.env.AUTOMOTIVE_PASS}@cluster0.hgznyse.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const carCollection = client.db("carDB").collection('cars')

        // post method

        app.post('/cars', async (req, res) => {
            const carInfo = req.body;
            const result = await carCollection.insertOne(carInfo);
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Your server is ready !')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})