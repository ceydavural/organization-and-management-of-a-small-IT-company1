const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const ToDoList = require('./models/toDoList');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MongoDB connection
const uri = "mongodb+srv://user:1234@cluster0.9pgef.mongodb.net/toDoList?retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(async () => {
        console.log("Successfully connected to MongoDB.");

        // Find collections in the database
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map(col => col.name));

        // Add sample data if the collection is empty
        if (!collections.some(col => col.name === 'toDoList')) {
            await ToDoList.create({ title: "Sample Task", short: "Short Description", long: "Long Description" });
            console.log("Sample data added.");
        }
    })
    .catch(error => console.error("Error connecting to MongoDB:", error));

// CRUD operations
app.get('/todos', async (req, res) => {
    try {
        const todos = await ToDoList.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/todos', async (req, res) => {
    const { title, short, long } = req.body;

    const newToDo = new ToDoList({
        title,
        short,
        long
    });

    try {
        const savedToDo = await newToDo.save();
        res.status(201).json(savedToDo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/todos/:id', async (req, res) => {
    try {
        const todo = await ToDoList.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: "Task not found" });
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/todos/:id', async (req, res) => {
    const { title, short, long } = req.body;

    try {
        const updatedToDo = await ToDoList.findByIdAndUpdate(
            req.params.id,
            { title, short, long },
            { new: true }
        );
        if (!updatedToDo) return res.status(404).json({ message: "Task not found" });
        res.json(updatedToDo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const deletedToDo = await ToDoList.findByIdAndDelete(req.params.id);
        if (!deletedToDo) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});