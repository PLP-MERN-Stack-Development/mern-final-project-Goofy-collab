import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-12">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">About RecipeShare</h1>
        <p className="text-gray-700 mb-4">
          RecipeShare is a MERN full-stack sample application for sharing and discovering recipes.
          It showcases React + Vite on the frontend, an Express + MongoDB backend, JWT authentication,
          and features like recipe creation, comments, rating and search.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6">What you'll find here</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
          <li>User authentication and profiles</li>
          <li>Create, update and delete recipes (authenticated users)</li>
          <li>Search, filter and pagination for recipe discovery</li>
          <li>Comments, ratings and saved recipes</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6">Credits</h2>
        <p className="text-gray-700">This project was created for the PLP MERN Stack final assignment.</p>
      </div>
    </div>
  );
};

export default AboutPage;
