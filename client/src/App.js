import io from 'socket.io-client';
import {useState, useEffect} from 'react';

const App = () => {
  
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    setSocket(io.connect('http://localhost:8000'));
  }, []);

  const updateData = tasks => {
    setTasks(tasks)
  };
  const removeTask = id => {
    socket.emit('remove', id)
  };
  const addTask = e => {
    e.preventDefault();
    socket.emit('addTask', taskName);
    setTaskName('');
  }

  if(socket !== null){
    socket.on('updateData', (tasks) => updateData(tasks));
  }

  return (
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
        {tasks.map(task => 
          <li className="task" key={task.id}>{task.name}<button className="btn btn--red" onClick={() => removeTask(task.id)}>Remove</button></li>)
        }
        </ul>
  
        <form id="add-task-form" onSubmit={addTask}>
          <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={e => setTaskName(e.target.value)}/>
          <button className="btn" type="submit">Add</button>
        </form>
  
      </section>
    </div>
  );
}

export default App;
