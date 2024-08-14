const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GET all tasks
router.get('/', (req, res) => {
    const sqlText = 'SELECT * FROM to_do;';
    pool.query(sqlText)
        .then((result) => {
            res.send(result.rows); // Correctly sending all rows from the result
        })
        .catch((err) => {
            console.log(`Error making query ${sqlText}`, err);
            res.sendStatus(500);
        });
});

// POST a new task
router.post('/', (req, res) => {
    const { task, task_due_date, task_completed } = req.body;
    if (typeof task !== 'string' || typeof task_due_date !== 'string' || typeof task_completed !== 'boolean') {
        return res.status(400).send('Invalid input');
    }
    const sqlText = `INSERT INTO to_do (task, task_due_date, task_completed)
    VALUES ($1, $2, $3) RETURNING *;`; // Using RETURNING * to get the newly created task

    pool.query(sqlText, [task, task_due_date, task_completed])
        .then((result) => {
            console.log(`Adding task`, { task, task_due_date, task_completed });
            res.status(201).json(result.rows[0]); // Returning the newly created task
        })
        .catch(error => {
            console.log(`Error making query ${sqlText}`, error);
            res.sendStatus(500);
        });
});

// DELETE a task by ID
router.delete('/:id', (req, res) => {
    let { id } = req.params;
    const sqlText = `DELETE FROM to_do WHERE id = $1;`;

    pool.query(sqlText, [id])
        .then(response => {
            console.log(`Task with id: ${id} successfully deleted`);
            res.sendStatus(204); // Successfully deleted, no content to send
        })
        .catch(error => {
            console.log(`Failed to delete task with id: ${id}, Error: ${error}`);
            res.sendStatus(500);
        });
});

// PUT (Update task completion status or details)
router.put('/toggle/:id', (req, res) => {
    let { id } = req.params;
    const { task_completed } = req.body; // Only updating the completion status
    if (typeof task_completed !== 'boolean') {
        return res.status(400).send('Invalid input');
    }
    const sqlText = `UPDATE to_do SET task_completed = $1 WHERE id = $2 RETURNING *;`;

    pool.query(sqlText, [task_completed, id])
        .then(result => {
            console.log(`Task with id: ${id} updated successfully`);
            res.json(result.rows[0]); // Returning the updated task
        })
        .catch(error => {
            console.log(`Failed to update task with id: ${taskId}, Error: ${error}`);
            res.sendStatus(500);
        });
});


module.exports = router;
