const { MongoClient, ServerApiVersion } = require('mongodb');
const express=require('express')
const cors=require('cors')
require('dotenv').config()
const app=express()
app.use(cors())
app.use(express.json())

const port=process.env.port||5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2oy7quf.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const allproducts=client.db('productcollection').collection('products')
    const cart = client.db('productcollection').collection('cart');
    await client.connect();

    app.get('/products',async(req,res)=>{
        const result=await allproducts.find().toArray()
        res.send(result)
    })
    
    app.post('/cart', async (req, res) => {
        const body=req.body
        
      const value = await cart.insertOne(body)
      res.send(value)})
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('crud is runnin....')
})

app.listen(port,()=>{
    console.log(`port is running on port ${port}`);
})



