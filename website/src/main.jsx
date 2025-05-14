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
import Contact from './pages/Contact.jsx';
import courses from './data/courses.json';
import CourseWrapper from './pages/CourseWrapper.jsx';
import AssignmentWrapper from './pages/AssignmentWrapper.jsx'; // Import the AssignmentWrapper component
import Schedule from './pages/Schedule.jsx';
import Faq from './pages/Faq.jsx';
import ProtectedRoute from './pages/components/ProtectedRoute.jsx';

import { createBrowserRouter, RouterProvider, Outlet, Link, } from 'react-router-dom';

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
        element: (
          <ProtectedRoute>
            <CourseWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: '/courses/:courseCode/:assignmentId',
        element: (
          <ProtectedRoute>
            <AssignmentWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/overview',
        element: (
          <ProtectedRoute>
            <Overview />
          </ProtectedRoute>
        ),
      },
      {
        path: '/Schedule',
        element: (
          <ProtectedRoute>
            <Schedule />
          </ProtectedRoute>
        ),
      },
      {
        path: '/module',
        element: (
          <ProtectedRoute>
            <Module />
          </ProtectedRoute>
        ),
      },
      {
        path: '/faq',
        element: <Faq />,
      },
      {
        path: '/contact',
        element: <Contact />,
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