// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.use(express.urlencoded({ extended: true }));

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

app.get("/api/todos/:id", async (req, res) => { 
  try {
    const todo = await Todo.findById(req.params.id)
    if (todo) {
      res.status(200).json(todo)
    } else {
      res.status(404).json({message:`Todo with id: ${req.params.id} not found`})
    }
  } catch (err) {
    res.status(500).json({message:"Error occured in fetching todos",err})
  }
})

app.put("/api/todos/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (updatedTodo) {
      res.status(200).json(updatedTodo)
    } else {
      res.status(404).json({ message: `Todo with id: ${req.params.id} not found` })
    }
  } catch (err) {
    res.status(500).json({message:"Error occured in updating todo",err})
  }
})

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id)
    if (deletedTodo) {
      res.status(200).json({message:`Todo with id: ${req.params.id} deleted`})
    } else {
      res.status(404).json({ message: `Todo with id: ${req.params.id} not found` })
    }
  } catch (err) {
    res.status(500).json({message:"Error occured in deleting todo",err})
  }
})
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

