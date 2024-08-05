const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GET all tasks
router.get('/tasks', (req, res) => {
    const queryText = 'SELECT * FROM to_do;';
    pool.query(queryText)
    .then((result) => {
        res.send(result.rows); // Correctly sending all rows from the result
    })
    .catch((err) => {
        console.log(`Error making query ${queryText}`, err);
        res.sendStatus(500);
    });
});

// POST a new task
router.post('/tasks', (req, res) => {
    const newTask = req.body; // Using 'newTask' for consistency
    const queryText = `INSERT INTO to_do (task, task_due_date, task_completed)
    VALUES ($1, $2, $3) RETURNING *;`; // Using RETURNING * to get the newly created task

    pool.query(queryText, [newTask.task, newTask.task_due_date, newTask.task_completed])
    .then((result) => {
        console.log(`Adding task`, newTask);
        res.status(201).json(result.rows[0]); // Returning the newly created task
    })
    .catch(error => {
        console.log(`Error making query ${queryText}`, error);
        res.sendStatus(500);
    });
});

// PUT (Update task completion status or details)
router.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { task_completed } = req.body; // Only updating the completion status
    const queryText = `UPDATE to_do SET task_completed = $1 WHERE id = $2 RETURNING *;`;

    pool.query(queryText, [task_completed, taskId])
    .then(result => {
        console.log(`Task with id: ${taskId} updated successfully`);
        res.json(result.rows[0]); // Returning the updated task
    })
    .catch(error => {
        console.log(`Failed to update task with id: ${taskId}, Error: ${error}`);
        res.sendStatus(500);
    });
});

// DELETE a task by ID
router.delete('/tasks/:id', (req, res) => {
    const idToDelete = req.params.id;
    const queryText = `DELETE FROM to_do WHERE id = $1;`;

    pool.query(queryText, [idToDelete])
    .then(response => {
        console.log(`Task with id: ${idToDelete} successfully deleted`);
        res.sendStatus(204); // Successfully deleted, no content to send
    })
    .catch(error => {
        console.log(`Failed to delete task with id: ${idToDelete}, Error: ${error}`);
        res.sendStatus(500);
    });
});

module.exports = router;
