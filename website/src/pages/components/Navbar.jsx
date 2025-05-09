import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('userID') != null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthChange = () => {
            setIsLoggedIn(localStorage.getItem('userID') != null);
        };

        // Listen for changes to localStorage and custom login-success event
        window.addEventListener('storage', handleAuthChange);

        // Cleanup listeners on component unmount
        return () => {
            window.removeEventListener('storage', handleAuthChange);
        };
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('userID');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 text-white p-4 h-20 flex items-center shadow-md font-thin">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold">
                    <Link to="/">StudyZone</Link>
                </div>
                <ul className="flex space-x-4">
                    <li className="hover:text-gray-300">
                        <Link to="/about">About</Link>
                    </li>
                    {isLoggedIn ? (
                        <li
                            className="hover:text-gray-300 cursor-pointer"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </li>
                    ) : (
                        <li className="hover:text-gray-300">
                            <Link to="/login">Login</Link>
                        </li>
                    )}
                    <li className="hover:text-gray-300">
                        <Link to="/courses">Courses</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;