import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UseFetchJson from './UseFetchJson.jsx';
import sha256 from 'crypto-js/sha256';

const LoginCard = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [triggerFetch, setTriggerFetch] = useState(false); // State to trigger the fetch
    const navigate = useNavigate(); // Use useNavigate for programmatic navigation

    // Memoize the hashed form data to avoid unnecessary recalculations
    const hashedFormData = useMemo(() => {
        if (!triggerFetch) return null; // Only hash the data when fetch is triggered
        return {
            ...formData,
            password: sha256(formData.password).toString(), // Hash the password
        };
    }, [triggerFetch, formData]);

    // UseFetchJson hook to send the login request
    const { data: response, error } = UseFetchJson(triggerFetch ? '/login' : null, hashedFormData);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setTriggerFetch(true); // Trigger the fetch
    };

    // Handle the response from UseFetchJson
    if (response) {
        console.log('Login request was successful:', response);
        if (response.userID) {
            localStorage.setItem('userID', response.userID);
            console.log('User ID stored in local storage:', response.userID);
            navigate('/overview'); // Navigate to the overview page
        } else {
            console.error('Invalid login credentials.');
        }
    }

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="email" style={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password" style={styles.label}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>
                <button type="submit" style={styles.button}>Login</button>
            </form>
            <p style={styles.signupText}>
                Don't have an account? <Link to="/signup" style={styles.signupLink}>Signup</Link>
            </p>
        </div>
    );
};

const styles = {
    card: {
        width: '300px',
        margin: '50px auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    title: {
        marginBottom: '20px',
        fontSize: '24px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '15px',
        textAlign: 'left',
    },
    label: {
        marginBottom: '5px',
        fontSize: '14px',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    signupText: {
        marginTop: '15px',
        fontSize: '14px',
        color: '#555',
    },
    signupLink: {
        color: '#007BFF',
        textDecoration: 'none',
    },
};

export default LoginCard;