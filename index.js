const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const added=client.db('productcollection').collection('added')
    // await client.connect();

    app.get('/products',async(req,res)=>{
        const result=await allproducts.find().toArray()
        res.send(result)
    })

  app.post('/products',async(req,res)=>{
    const newproduct=req.body
    console.log(newproduct);
    const result=await added.insertOne(newproduct)
    res.send(result)

  })

    
    app.post('/cart', async (req, res) => {
        const body=req.body
      const value = await cart.insertOne(body)
      res.send(value)})

      app.get('/cart',async(req,res)=>{
        const result=await cart.find().toArray()
        res.send(result)})


        app.delete('/cart/:id',async(req,res)=>{
            const id =req.params.id
            const query={
                _id:new ObjectId(id)
            }
            const result=await cart.deleteOne(query)
            res.send(result)

        })
        app.get('/products/:id',async(req,res)=>{
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            const result=await allproducts.findOne(filter)
            res.send(result)})

       app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            const updateddata = req.body;
            const data = {
              $set: {
                brandName: updateddata.brandName,
                name: updateddata.name,
                image: updateddata.image,
                type: updateddata.type,
                price: updateddata.price,
                rating: updateddata.rating,
                details: updateddata.details,
              },
            };
          
            const result = await allproducts
            .updateOne(filter, data);
            res.send(result);
          });
          
   
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('crud is fuctioning')
})

app.listen(port,()=>{
    console.log(`port is running on port ${port}`);
})



