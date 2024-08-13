document.addEventListener('DOMContentLoaded', () => {
    // Attach handleSubmit to the form submission
    document.querySelector('#task-form').addEventListener('submit', handleSubmit);

    // Fetch and render tasks when the page loads
    getTasks();
});

function handleSubmit(event) {
    event.preventDefault();
    console.log('Submit Button Clicked');

    // Collect form data
    let taskToAdd = {
        task: document.querySelector('#task').value,
        task_due_date: document.querySelector('#task_due_date').value // Fixed the selector
    };

    // Send POST request to add a new task
    axios.post('/api/todo/tasks', taskToAdd)
        .then((response) => {
            console.log('Response from Server', response);
            getTasks(); // Refresh task list
        })
        .catch((error) => {
            console.log('Error in POST', error);
            alert('Unable to add task. Please try again.');
        });
}

function getTasks() {
    axios.get('/api/todo/tasks') // Corrected the endpoint
        .then((response) => {
            console.log('Response from GET', response);
            renderTasks(response.data);
        })
        .catch((error) => {
            console.log('Error in GET', error);
        });
}

function renderTasks(taskList) {
    const taskListElement = document.querySelector('#task-list'); // Fixed the selector
    taskListElement.innerHTML = '';

    for (let task of taskList) {
        taskListElement.innerHTML += `
            <tr>
                <td>${task.task}</td>
                <td>${task.task_due_date}</td>
                <button onclick="completeTask(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                <td><button onclick="deleteTask(${task.id})">Delete</button></td>
            </tr>
        `;
    }
}

function completeTask(taskID) {
    axios.patch(`/api/todo/tasks/${taskID}`)
        .then((response) => {
            getTasks(); // Refresh task list
        })
        .catch((error) => {
            console.log('Error in PATCH', error);
            alert('Something went wrong with completing task. Try again.');
        });
}

function deleteTask(taskID) {
    axios.delete(`/api/todo/tasks/${taskID}`) // Corrected the endpoint
        .then((response) => {
            getTasks(); // Refresh task list
        })
        .catch((error) => {
            console.log('Error in DELETE', error);
            alert('Something went wrong with delete');
        });
}
