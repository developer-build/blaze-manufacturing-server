const express= require('express');
const app = express();
const cors= require('cors');
const jwt= require('jsonwebtoken');
const port= process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wkkm4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    await client.connect();
    const toolCollection = client.db("blaze_manufacturing").collection("tools");
    const reviewCollection = client.db("blaze_manufacturing").collection("reviews");

    try{

        // review apis
        app.get('/reviews', async (req, res)=>{
            const query = {};
            const reviews = await reviewCollection.find(query).toArray();
            res.send(reviews);
        })

        app.post('/reviews', async (req, res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        // tool apis
        app.get('/tools', async (req, res)=>{
            const query = {};
            const tools = await toolCollection.find(query).toArray();
            res.send(tools);
        })

        app.get('/tools/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await toolCollection.findOne(query);
            res.send(result);
        })
    }
    finally{

    }
    console.log('connected with mongodb');
}
run().catch(console.dir)


app.get('/', (req, res)=>{
    res.send('Hello from blaze manufacturing server!');
})

app.listen(port, ()=>{
    console.log('listening to port no:-', port);
})