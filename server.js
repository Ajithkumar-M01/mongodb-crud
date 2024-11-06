// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://mongodb-crud-six.vercel.app', // Replace with her actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// MongoDB connection
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define a Post schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  timeline: {type: String, required: true}
})

const Todo = mongoose.model("Todo", todoSchema)

app.post("/api/todos/", async (req, res) => {
  const newTodo = new Todo({
    title: req.body.title,
    description: req.body.description,
    timeline: `${req.body.timeline} days`
  })

  try {
    const savedTodo = await newTodo.save()
    res.status(200).json(savedTodo)
  } catch (err) {
    res.json({message:"Error occured in creating the new todo",err})
  }
})

app.get("/api/todos/", async (req, res) => { 
  try {
    const limit = Number(req.query.limit)
    const todos = limit ? await Todo.find().limit(limit) : await Todo.find()
    res.status(200).json(todos)
  } catch (err) {
    res.status(500).json({message:"Error occured in fetching todos",err})
  }
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

