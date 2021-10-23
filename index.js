const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express()
const ObjectId = require('mongodb').ObjectId;
const port = 5000;
app.use(cors())
app.use(express.json())
//user:mydbuser1
//password:IQWHhEdPgc3WCBmQ
app.get('/',(req, res) => {
   
    res.send("running my crud server")
})

app.listen(port , () => {
    console.log("running server on",port)
})

const uri = "mongodb+srv://mydbuser1:IQWHhEdPgc3WCBmQ@cluster0.bwbvx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Replace the uri string with your MongoDB deployment's connection string.

async function run() {
  try {
    await client.connect();
    const database = client.db("fooodCluster");
    const usersCollection = database.collection("users");
   //get API
   app.get('/users', async (req,res) => {
      const cursor = usersCollection.find()
      const users = await cursor.toArray()
      res.send(users)
   })

   //get single user Api 
   app.get('/users/:id' , async (req,res) => {
    const id = req.params.id;
    const query = {_id:ObjectId(id)}
    const user = await usersCollection.findOne(query)
    console.log("load Users with id" , id)
    res.send(user)

   })

   //Update api
   app.put('/users/:id', async (req,res) => {
     const id = req.params.id;
     const updatedUser = req.body;
     const filter = {_id : ObjectId(id)}
     const options = { upsert : true}
     const updateDoc = {
      $set: {
        name: updatedUser.name,
        email:updatedUser.email
      },
      };
      const result =await usersCollection.updateOne(filter,updateDoc,options)
     console.log(result)
     res.send(result)
   })
    //Post Api
    app.post('/users' , async (req,res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser)
      console.log(result)
      console.log("hitting the fetch",req.body)
      res.send(result)
    })

    //Delete Api
    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      console.log("deleting user with id" , result)
      res.json(result)
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);