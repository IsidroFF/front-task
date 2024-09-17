"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

const Sidebar = ({ user }) => {
    const router = useRouter();
    const URI = process.env.API_URI;

    const handleLogout = async () => {
        try {
            const res = await fetch(`${URI}/api/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Ensure cookies are sent
            });

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

            // Redirect to login page or home page
            router.push('/login');
        } catch (error) {
            alert(`Error logging out: ${error.message}`);
        }
    };

    return (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6">
            <h2 className="text-xl font-bold mb-4">User Information</h2>
            <div className="mt-4 mb-6">
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                {/* Add more user details as needed */}
            </div>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white p-3 rounded-lg w-full mt-auto"
            >
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
