require('dotenv').config();
const cors = require('cors');
const express = require('express');
const Database = require('better-sqlite3');

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: '*', // Allow all origins for simplicity; adjust as needed for security
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};

//Decide which frontend URL to allow based on environment
app.use(cors(corsOptions));
app.use(express.json());


//Establish the file path for the SQLite database
const databasePath = process.env.DATABASE_PATH || './planner.db';
console.log(`Using database path: ${databasePath}`);

//Connect to the SQLite database
const db = new Database(databasePath);

//Fetch all tasks from the database
function getAllTasks() {
    const statement=db.prepare(`SELECT * FROM tasks`);
    const tasks=statement.all();
    console.log(tasks);
    return tasks;
};

function addTask(title, description) {
    const statement=db.prepare(`INSERT INTO tasks (title, description) VALUES (?, ?)`);
    const info=statement.run(title, description);
    return info;
}

function updateTask(id, title, description) {
    const statement=db.prepare(`UPDATE tasks SET title = ?, description = ? WHERE id = ?`);
    const info=statement.run(title, description, id);
    return info;
}

function deleteTask(id) {
    const statement=db.prepare(`DELETE FROM tasks WHERE id = ?`);
    const info=statement.run(id);
    return info;
}

//Handle JSON requests for task data
app.get('/tasks', (req, res) => {
    res.send(getAllTasks());
});
app.post('/tasks', express.json(), (req, res) => {
    const { title, description } = req.body;
    const info = addTask(title, description);
    res.send({ success: true, id: info.lastInsertRowid });
});

app.put('/tasks/:id', express.json(), (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const info = updateTask(id, title, description);
    res.send({ success: true, changes: info.changes });
});

app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const statement = db.prepare(`SELECT * FROM tasks WHERE id = ?`);
    const task = statement.get(id);
    res.send(task);
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const info = deleteTask(id);
    res.send({ success: true, changes: info.changes });
});
//default welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the Planner API');
});

//Start the server and listen for requests on a specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});