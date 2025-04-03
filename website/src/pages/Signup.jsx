import React, { useState } from 'react';
import axios from 'axios';
import sha256 from 'crypto-js/sha256';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const hashedFormData = {
            ...formData,
            password: sha256(formData.password).toString(), // Hash the password
        };
        console.log('Form submitted:', hashedFormData);
        handleSignup(hashedFormData);
        // You can also reset the form after submission if needed
    };

    const handleSignup = async (hashedFormData) => {
        try {
            const response = await axios.post('http://localhost:5000/signup', hashedFormData);
            console.log('Signup successful:', response.data);
            // Handle successful signup (e.g., redirect to login page)
        } catch (error) {
            console.error('Error during signup:', error);
            // Handle error (e.g., show error message)
        }
    }

    return (
        <>
            <div className="flex items-center justify-center h-[calc(100vh-80px)] bg-gray-100">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Sign Up
                        </button>
                    </form>
                    <p className="mt-4 text-sm text-center text-gray-600">
                        Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Signup;