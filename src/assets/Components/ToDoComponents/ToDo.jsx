import React, { useState, useEffect } from 'react';
import './styles.css';

function ToDo() {
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState({
        todo: [],
        inProcess: [],
        completed: []
    });
    const [taskToDelete, setTaskToDelete] = useState(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = () => {
        setTasks({
            todo: JSON.parse(localStorage.getItem('todoTasks')) || [],
            inProcess: JSON.parse(localStorage.getItem('inProcessTasks')) || [],
            completed: JSON.parse(localStorage.getItem('completedTasks')) || []
        });
    };

    const saveTasks = (updatedTasks) => {
        localStorage.setItem('todoTasks', JSON.stringify(updatedTasks.todo));
        localStorage.setItem('inProcessTasks', JSON.stringify(updatedTasks.inProcess));
        localStorage.setItem('completedTasks', JSON.stringify(updatedTasks.completed));
    };

    const addTask = () => {
        if (newTask.trim()) {
            const task = { text: newTask.trim(), createdAt: new Date().toLocaleString() };
            const updatedTasks = { ...tasks, todo: [...tasks.todo, task] };
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
            setNewTask('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };

    const moveTask = (task, from, to) => {
        const updatedFromList = tasks[from].filter(t => t.text !== task.text);
        const updatedToList = [...tasks[to], { ...task, movedAt: new Date().toLocaleString() }];

        const updatedTasks = { ...tasks, [from]: updatedFromList, [to]: updatedToList };
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };

    const clearCompletedTasks = () => {
        const updatedTasks = { ...tasks, completed: [] };
        setTasks(updatedTasks);
        localStorage.removeItem('completedTasks');
    };

    const showDeleteModal = (task, status) => {
        setTaskToDelete({ task, status });
    };

    const confirmDeleteTask = () => {
        if (taskToDelete) {
            const { task, status } = taskToDelete;
            const updatedTasks = {
                ...tasks,
                [status]: tasks[status].filter(t => t.text !== task.text)
            };
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
            setTaskToDelete(null);
        }
    };

    return (
        <div className="container">
            <h1>To-Do List</h1>
            <div className="task-input">
                <input
                    type="text"
                    placeholder="Enter a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={addTask}>Add Task</button>
            </div>

            <div className="task-box" id="to-do-box">
                <h2>To Do</h2>
                <ul>
                    {tasks.todo.map((task, index) => (
                        <li key={index}>
                            <span>{task.text} (Created: {task.createdAt})</span>
                            <button onClick={() => moveTask(task, 'todo', 'inProcess')}>Move to In Process</button>
                            <button onClick={() => moveTask(task, 'todo', 'completed')}>Move to Completed</button>
                            <button onClick={() => showDeleteModal(task, 'todo')} className="delete-btn">X</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="task-box" id="in-process-box">
                <h2>In Process</h2>
                <ul>
                    {tasks.inProcess.map((task, index) => (
                        <li key={index}>
                            <span>{task.text} (Moved to In Process: {task.movedAt})</span>
                            <button onClick={() => moveTask(task, 'inProcess', 'todo')}>Move to To Do</button>
                            <button onClick={() => moveTask(task, 'inProcess', 'completed')}>Move to Completed</button>
                            <button onClick={() => showDeleteModal(task, 'inProcess')} className="delete-btn">X</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="task-box" id="completed-box">
                <h2>Completed</h2>
                <ul>
                    {tasks.completed.map((task, index) => (
                        <li key={index}>
                            <span>{task.text} (Completed: {task.movedAt})</span>
                            <button onClick={() => moveTask(task, 'completed', 'todo')}>Move to To Do</button>
                            <button onClick={() => moveTask(task, 'completed', 'inProcess')}>Move to In Process</button>
                            <button onClick={() => showDeleteModal(task, 'completed')} className="delete-btn">X</button>
                        </li>
                    ))}
                </ul>
            </div>

            <button id="clear-completed" onClick={clearCompletedTasks}>Clear Completed Tasks</button>

            {taskToDelete && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Are you sure you want to delete this task?</h3>
                        <div className="modal-buttons">
                            <button onClick={confirmDeleteTask}>Yes</button>
                            <button onClick={() => setTaskToDelete(null)}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ToDo;
