const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
var cors = require('cors')
const port = process.env.PORT || 5000;
const { send } = require('express/lib/response');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World! kire konde tui')
})

const uri = "mongodb+srv://Product:bglwWMBRIaDGGCjm@cluster0.dvhpno8.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('Data').collection('user');
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const product = await cursor.toArray();
            res.send(product);
        });
        app.post('/products', async(req, res) =>{
            console.log("Request", req.body);
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
          });
          app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
          });
          //deleting items
          app.delete('/products/:id', async(req, res) =>{
            const id = (req.params.id);
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
          });
          app.get('/products/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.findOne(query);
            res.send(result);
          });
          app.put('/products/:id', async(req, res) =>{
            const id = req.params.id;
            const updateProduct = req.body;
            const query = {_id: ObjectId(id)};
            const options= { upsert: true};
            const updatedDoc ={
              $set: {
                price: updateProduct.price,
                inStock: updateProduct.available
              }

            };
            const result = await productCollection.updateOne(query, updatedDoc, options);
            res.send(result);
            
          })


    }
    finally {

    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    console.log('CRUD Runnig ');
  });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//name: Product
//pass: bglwWMBRIaDGGCjm