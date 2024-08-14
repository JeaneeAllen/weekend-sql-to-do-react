import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const [choreList, setChoreList] = useState([]);
  const [choreTask, setChoreTask] = useState('');
  const [choreDueDate, setChoreDueDate] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [])

  const fetchTasks = () => {
    axios.get('/api/todo')
      .then((response) => {
        console.log(response.data);
        setChoreList((response.data));
      })
      .catch((error) => {
        console.log("Error fetching tasks", error)
      })
  }

  const addTask = (event) => {
    event.preventDefault();

    const newTask = {
      task: choreTask,
      task_due_date: choreDueDate
    }

    axios.post('/api/todo', newTask)
      .then((response) => {
        console.log(response);

        setChoreTask('');
        setChoreDueDate('');

        fetchTasks();
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const deleteChore = (choreId) => {

    axios.delete(`/api/todo/${choreId}`)
      .then((response) => {
        console.log(response);
        fetchTasks();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const toggleChore = (choreId) => {
    const taskCompleted = !choreList.find(chore => chore.id === choreId).completed; // Toggle completion status
    axios.put(`/api/todo/toggle/${choreId}`, { task_completed: taskCompleted })
      .then((response) => {
        console.log(response);
        fetchTasks();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <div>
      <h1>TO DO APP</h1>
      <form onSubmit={addTask}>
        <label htmlFor="task">Task</label>
        <input id="task" onChange={(event) => setChoreTask(event.target.value)} value={choreTask} />

        <label htmlFor='task_due_date'>Due Date</label>
        <input id="task_due_date" onChange={(event) => setChoreDueDate(event.target.value)} value={choreDueDate} />

        <button type="submit">Add Task</button>
      </form>

      <ul>
        {choreList.map(
          function (chore) {
            return (
              <li key={chore.id} className={chore.completed ? 'completed' : ''}>
                {chore.task} {chore.task_due_date && `is due ${chore.task_due_date}`}
                <button onClick={() => toggleChore(chore.id)}>
                  {chore.completed ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => deleteChore(chore.id)}>Delete</button>
              </li>
            )
          }
        )}
      </ul>
    </div>


  );

}

export default App

