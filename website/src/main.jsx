import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import About from './pages/About.jsx';
import Courses from './pages/Courses.jsx';
import Signup from './pages/Signup.jsx';
import Navbar from './pages/components/Navbar.jsx';
import Footer from './pages/components/Footer.jsx';
import Overview from './pages/Overview.jsx';
import Module from './pages/Module.jsx';
import courses from './data/courses.json';
import AssignmentWrapper from './pages/AssignmentWrapper.jsx'; // Import the AssignmentWrapper component
import Schedule from './pages/Schedule.jsx';

import { createBrowserRouter, RouterProvider, Outlet, Link, useParams } from 'react-router-dom';
import { useMemo } from "react";
import UseFetchJson from "./pages/components/UseFetchJson";

// Layout component to include Navbar
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

// Error page component
const ErrorPage = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
    <p className="text-gray-600 text-center">The page you are looking for does not exist.</p>
    <Link to="/" className="mt-4 text-blue-600 hover:underline">Go back to Home</Link>
  </div>
);

const CourseWrapper = () => {
  const { courseCode } = useParams();
  const userSessionID = localStorage.getItem('userID');
  const bodyData = useMemo(() => ({ userSessionID }), [userSessionID]);
  const { data: assignments, error } = UseFetchJson(`http://localhost:5000/assignment/${courseCode}`, bodyData);
  console.log('Assignments:', assignments);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Course: {courseCode}</h1>
      {error && <p>Error loading assignments</p>}
      {assignments && assignments.map(ass => (
        <div key={ass.id} className="p-2 bg-gray-200 my-2 rounded">
          {ass.title}
        </div>
      ))}
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />, // Wrap all routes with Layout
    errorElement: <ErrorPage />, // Add errorElement here
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/Login',
        element: <Login />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/courses/:courseCode',
        element: <CourseWrapper />,
      },
      {
        path: '/assignments/:id', // Dynamic route for assignments
        element: <AssignmentWrapper />, // Use the wrapper component
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/overview',
        element: <Overview />,
      },
      {
        path: '/Schedule',
        element: <Schedule />,
      },
      {
        path: '/module',
        element: <Module />,
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="bg-white min-h-screen">
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);