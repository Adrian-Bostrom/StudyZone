import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/StudyZone-logo.png'; // Adjust the path to your PNG file

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
        <nav className="bg-gray-800 text-white h-20 flex items-center shadow-md font-thin">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                {/* Logo Section */}
                <div className="flex items-center space-x-2">
                    <Link to={userID ? "/" : "/overview"}>
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-16 h-auto object-contain" // Ensures the image keeps its aspect ratio
                        />
                    </Link>
                    <div className="text-xl font-bold hidden sm:block">
                        {/* Hide text on smaller screens */}
                        <Link to={userID ? "/" : "/overview"}>StudyZone</Link>
                    </div>
                </div>

                {/* Navigation Links */}
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