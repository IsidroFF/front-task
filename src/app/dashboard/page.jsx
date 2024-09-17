"use client"
import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import TaskList from './components/tasklist';

const Dashboard = () => {
    const [user] = useState({
        name: 'hola123',
        email: 'hi@hi.local'
    });

    // Function to create a new task
    const handleCreateTask = async (newTask) => {
        try {
            const res = await fetch(`${process.env.API_URI}/api/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTask),
                credentials: 'include'
            });

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

            const createdTask = await res.json();
            return createdTask;
        } catch (error) {
            alert(`Error creating task: ${error.message}`);
            throw error;
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar user={user} />
            <div className="flex-1 ml-64 p-6">
                <TaskList onCreateTask={handleCreateTask} />
            </div>
        </div>
    );
};

export default Dashboard;
