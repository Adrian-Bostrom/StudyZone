import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
                    <li className="hover:text-gray-300">
                        <Link to="/login">Login</Link>
                    </li>
                    <li className="hover:text-gray-300">Contact</li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;