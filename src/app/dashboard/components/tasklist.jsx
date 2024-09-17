"use client";
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const URI = process.env.API_URI;

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTask, setNewTask] = useState({
        name: '',
        content: '',
        deadline: '',
        UserId: ''
    });
    const [editingTask, setEditingTask] = useState(null);
    const [showEditTask, setShowEditTask] = useState(false);

    const tasksPerPage = 10;
    
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };
    
    let UserId;
    
    useEffect(() => {
        const fetchTasks = async () => {
            try {

                const token = getCookie('jwt_ttimer');
                if (!token) throw new Error('Token not found in cookies');
                
                const userData = jwtDecode(token);
                UserId = userData.id;

                const res = await fetch(`${URI}/api/tasks/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: 'include'
                });
    
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    
                const data = await res.json();
    
                if (Array.isArray(data) && data.length === 0) {
                    throw new Error("No tasks found");
                }
    
                setTasks(data);
            } catch (error) {
                setError(error);
                setTasks([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchTasks();
    }, []);
    

    const completeTask = async (id) => {
        try {
            const res = await fetch(`${URI}/api/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ done: true }),
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const updatedTask = await res.json();
            setTasks(tasks.map(task => task.id === id ? updatedTask : task));
        } catch (error) {
            setError(error);
        }
    };

    const deleteTask = async (id) => {
        try {
            const res = await fetch(`${URI}/api/tasks/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            // Remove the deleted task from the state
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            setError(error);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingTask) {
            setEditingTask({
                ...editingTask,
                [name]: value
            });
        } else {
            setNewTask({
                ...newTask,
                [name]: value
            });
        }
    };

    const handleAddTask = async () => {
        console.log("Adding task:", newTask); // Verifica los datos antes de enviar

        try {
            const token = getCookie('jwt_ttimer');
            if (!token) throw new Error('Token not found in cookies');

            const res = await fetch(`${URI}/api/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({...newTask, UserId: UserId}),
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const createdTask = await res.json();
            console.log("Created task:", createdTask); // Verifica la respuesta del servidor
            setTasks([createdTask, ...tasks]);
            setNewTask({ name: '', content: '', deadline: '', UserId: UserId });
            setShowAddTask(false);
        } catch (error) {
            setError(error);
        }
    };

    const handleEditTask = async () => {
        try {
            const res = await fetch(`${URI}/api/tasks/${editingTask.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editingTask),
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const updatedTask = await res.json();
            setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
            setEditingTask(null);
            setShowEditTask(false);
        } catch (error) {
            setError(error);
        }
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setShowEditTask(true);
    };

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks ? tasks.slice(indexOfFirstTask, indexOfLastTask) : [];

    if (loading) {
        return <p>Loading tasks...</p>;
    }

    if (error) {
        return <p>{error.message.includes("No tasks found") ? "No tasks available" : `Error loading tasks: ${error.message}`}</p>;
    }

    return (
        <div className="flex flex-col items-center text-center w-full p-4">
            <h1 className="text-2xl font-bold mb-4">Task List</h1>
            <button
                onClick={() => setShowAddTask(!showAddTask)}
                className='bg-green-500 text-white p-3 rounded-lg mb-4'>
                {showAddTask ? 'Close' : 'Add Task'}
            </button>
            {showAddTask && (
                <div className='w-full max-w-md'>
                    <input
                        type="text"
                        name="name"
                        placeholder="Task Name"
                        value={newTask.name}
                        onChange={handleInputChange}
                        className='border p-2 mb-2 w-full rounded-md text-black'
                    />
                    <input
                        type="text"
                        name="content"
                        placeholder="Task Content"
                        value={newTask.content}
                        onChange={handleInputChange}
                        className='border p-2 mb-2 w-full rounded-md text-black'
                    />
                    <input
                        type="date"
                        name="deadline"
                        value={newTask.deadline}
                        onChange={handleInputChange}
                        className='border p-2 mb-2 w-full rounded-md text-black'
                    />
                    <button
                        onClick={handleAddTask}
                        className='bg-blue-500 text-white p-3 rounded-lg mt-2 w-full'>
                        Add Task
                    </button>
                </div>
            )}
            {showEditTask && editingTask && (
                <div className='w-full max-w-md'>
                    <input
                        type="text"
                        name="name"
                        placeholder="Task Name"
                        value={editingTask.name}
                        onChange={handleInputChange}
                        className='border p-2 mb-2 w-full rounded-md text-black'
                    />
                    <input
                        type="text"
                        name="content"
                        placeholder="Task Content"
                        value={editingTask.content}
                        onChange={handleInputChange}
                        className='border p-2 mb-2 w-full rounded-md text-black'
                    />
                    <input
                        type="date"
                        name="deadline"
                        value={editingTask.deadline}
                        onChange={handleInputChange}
                        className='border p-2 mb-2 w-full rounded-md text-black'
                    />
                    <button
                        onClick={handleEditTask}
                        className='bg-blue-500 text-white p-3 rounded-lg mt-2 w-full'>
                        Save Changes
                    </button>
                </div>
            )}
            <ul className="w-full max-w-4xl list-none p-0">
                {currentTasks.map(task => (
                    <li key={task.id} className="mb-4 w-full">
                        <div className="border p-4 rounded-lg shadow-lg w-full">
                            <h2 className="text-xl font-semibold">{task.name}</h2>
                            <p>{task.content}</p>
                            <p>Status: {task.done ? 'Completed' : 'Pending'}</p>
                            <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</p>
                            {!task.done && (
                                <button
                                    className='bg-blue-500 text-white p-3 rounded-lg mt-2'
                                    onClick={() => completeTask(task.id)}>
                                    Complete Task
                                </button>
                            )}
                            <button
                                className='bg-yellow-500 text-white p-3 rounded-lg mt-2'
                                onClick={() => handleEditClick(task)}>
                                Edit Task
                            </button>
                            <button
                                className='bg-red-500 text-white p-3 rounded-lg mt-2'
                                onClick={() => deleteTask(task.id)}>
                                Delete Task
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {/* <div className="flex justify-between w-full max-w-4xl">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="bg-gray-500 text-white p-3 rounded-lg">
                    Previous
                </button>
                <button onClick={handleNextPage} disabled={indexOfLastTask >= tasks.length} className="bg-gray-500 text-white p-3 rounded-lg">
                    Next
                </button>
            </div> */}
        </div>
    );
};

export default TaskList;
