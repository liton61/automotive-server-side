const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.AUTOMOTIVE_DB}:${process.env.AUTOMOTIVE_PASS}@cluster0.hgznyse.mongodb.net/?retryWrites=true&w=majority`;


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
        const cartCollection = client.db("cartDB").collection('cart')

        // post method
        app.post('/cars', async (req, res) => {
            const carInfo = req.body;
            const result = await carCollection.insertOne(carInfo);
            res.send(result);
        });

        // post method for add to cart
        app.post('/cart', async (req, res) => {
            const details = req.body;
            const result = await cartCollection.insertOne(details);
            res.send(result);
        });

        // get method
        app.get("/cars", async (req, res) => {
            const result = await carCollection.find().toArray();
            res.send(result);
        });

        // get method for my cart
        app.get("/cart", async (req, res) => {
            const result = await cartCollection.find().toArray();
            res.send(result);
        });

        // delete method
        app.delete("/cars/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await carCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

        // update method
        app.get("/cars/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await carCollection.findOne(query);
            console.log(result);
            res.send(result);
        });

        app.put("/cars/:id", async (req, res) => {
            const id = req.params.id;
            const updateCar = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const car = {
                $set: {
                    image: updateCar.image,
                    model: updateCar.model,
                    brand: updateCar.brand,
                    price: updateCar.price,
                    type: updateCar.type,
                    rating: updateCar.rating,
                    description: updateCar.description
                },
            };
            const result = await carCollection.updateOne(
                filter,
                car,
                options
            );
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