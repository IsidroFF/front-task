"use client"
import React, { useState, useEffect } from 'react';

const URI = process.env.API_URI;

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10;

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch(`${URI}/api/v1/tasks`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();
                setTasks(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const completeTask = async (id) => {
        try {
            const res = await fetch(`${URI}/api/v1/tasks/${id}`, {
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

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    if (loading) {
        return <p>Loading tasks...</p>;
    }

    if (error) {
        return <p>Error loading tasks: {error.message}</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h1>Task List</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {currentTasks.map(task => (
                    <li key={task.id} style={{ margin: '10px 0' }}>
                        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '300px' }}>
                            <h2>{task.name}</h2>
                            <p>{task.content}</p>
                            <p>Status: {task.done ? 'Completed' : 'Pending'}</p>
                            <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</p>
                            {!task.done && (
                                <button 
                                className='bg-blue-500 text-white p-3 rounded-lg mt-2'
                                onClick={() => completeTask(task.id)}>Complete Task</button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <div>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                <button onClick={handleNextPage} disabled={indexOfLastTask >= tasks.length}>Next</button>
            </div>
        </div>
    );
};

export default TaskList;