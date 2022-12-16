import express from "express"
import {MongoClient, ObjectId, Timestamp} from 'mongodb'

const app = express()

app.use(express.json())

const client = await MongoClient.connect("mongodb://127.0.0.1:27017")
const db = client.db("mydatabase")
const collection = db.collection("tasks")

app.get("/healthcheck", async function (req, res) {
    res.status(200).send("Server running");
});

app.get("/tasks", async (req, res) => {
    try {
        const data = await collection.find({}).toArray()

        res.json({status: 200, data: data})
    } catch (e) {
        console.log(e)
        res.json({error: "some error occured"})
    }
})

app.get("/todo/1", async (req, res) => {
    try {
        const data = await collection.findOne({})

        res.json({status: 200, data: data})
    } catch (e) {
        console.log(e)
        res.json({error: "some error occured"})
    }
})

app.patch("/todo/:id", async(req,res) => {
    const data= req.body
    try {
         await collection.updateOne(
            {
                _id: new ObjectId(req.params.id),
            },
            {
                $set: {},
            }
        )
    } catch (e) {
        console.log(e)
        res.json({error: "some error occured"})
    }
})

app.post("/todo/new", async (req, res) => {
    const data = req.body;
     try {
           await collection.insertOne({
           task: data.task,
           email: data.email,
           timestamp: new Timestamp(),
        })
        res.json({"message": "added"})
    } catch (e) {
        console.log(e)
        res.json({error: "some error occured"})
    }
})

app.delete("/todo/:id", async (req,res) => {
    try {
        const data = await collection.deleteOne({
            _id: new ObjectId(req.params.id),
        })
        res.json({status: 200, data: data})
    } catch (e) {
        console.log(e)
        res.json({error: "some error occured"})
    }
})

app.listen(3000, () => {
    console.log('server listening on port 3000')
    console.log("http://localhost:3000/healthcheck");
})