import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';


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
      task_due_date: choreDueDate,
      task_completed: false
    }

    axios.post('/api/todo', newTask)
      .then((response) => {
        console.log(response);

        // clear inputs from server
        setChoreTask('');
        setChoreDueDate('');
        
        // fetch updated list from server
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
    const taskCompleted = !choreList.find(chore => chore.id === choreId).task_completed; // Toggle completion status
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

       <table id="taskTable">
        <thead>
          <tr>
            <th>Task</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {choreList.map((chore) => (
            <tr key={chore.id} className={chore.task_completed ? 'completed' : ''}>
              <td>{chore.task}</td>
              <td>{chore.task_due_date || 'N/A'}</td>
              <td>{chore.task_completed ? 'Completed' : 'Incomplete'}</td>
              <td>
                <button onClick={() => toggleChore(chore.id)}>
                  {chore.task_completed ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => deleteChore(chore.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <ul>
        {choreList.map(
          function (chore) {
            return (
              <li key={chore.id} className={chore.task_completed ? 'completed' : ''}>
                {chore.task} {chore.task_due_date && `is due ${chore.task_due_date}`}
                <button onClick={() => toggleChore(chore.id)}>
                  {chore.task_completed ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => deleteChore(chore.id)}>Delete</button>
              </li>
            )
          }
        )}
      </ul> */}
    </div>


  );

}

export default App;

