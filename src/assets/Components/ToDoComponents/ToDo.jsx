import React, { useState, useEffect } from 'react';
import './styles.css';

function ToDo() {
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState({
        todo: [],
        inProcess: [],
        completed: []
    });

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = () => {
        const todoTasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
        const inProcessTasks = JSON.parse(localStorage.getItem('inProcessTasks')) || [];
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

        setTasks({
            todo: todoTasks,
            inProcess: inProcessTasks,
            completed: completedTasks
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

    return (
        <div className="container">
            <h1>To-Do List</h1>
            <div className="task-input">
                <input
                    type="text"
                    placeholder="Enter a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
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
                        </li>
                    ))}
                </ul>
            </div>

            <button id="clear-completed" onClick={clearCompletedTasks}>Clear Completed Tasks</button>
        </div>
    );
}

export default ToDo;
