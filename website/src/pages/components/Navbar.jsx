import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const userID = localStorage.getItem("userID"); // Retrieve userID from local storage

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
                    <li className="hover:text-gray-300">
                        <Link to="/login">Login</Link>
                    </li>
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