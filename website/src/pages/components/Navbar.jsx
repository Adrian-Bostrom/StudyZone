import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    
    const navigate = useNavigate();
    const userID = localStorage.getItem("userID"); // Retrieve userID from local storage
    const [isLoggedIn, setIsLoggedIn] = useState(userID != null);

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(userID != null);
        };

        // Listen for changes to localStorage and custom login-success event
        window.addEventListener('storage', handleStorageChange);

        // Cleanup listeners on component unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
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
                    <Link to={userID ? "/" : "/overview"}>StudyZone</Link>
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
                        <Link to="/overview">Overview</Link>
                    </li>
                    <li className="hover:text-gray-300">
                        <Link to="/Schedule">Schedule</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;