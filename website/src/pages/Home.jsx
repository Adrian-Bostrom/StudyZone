import React from 'react';

const Home = () => {
    return (
        <>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] bg-gray-100 p-6">
          <h1 className="text-3xl font-bold mb-4">Home</h1>
          <p className="text-gray-600 text-center max-w-2xl">
            This is the about page. Here you can learn more about StudyZone and its mission to provide quality education resources.
          </p>
        </div>
      </>
    );
};

export default Home;