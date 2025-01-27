import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';

const CreatePetition = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      setUserId(email);
    }
  }, []);

  const createPetition = async (title, content, userId) => {
    try {
      const response = await fetch('http://localhost:5001/slpp/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Petition created successfully:', data);
        setMessage(data.message);
        setTitle('');
        setContent('');
      } else {
        console.error('Error creating petition:', data.message || 'Something went wrong');
        setMessage('Failed to create petition. Please try again.');
      }
    } catch (error) {
      console.error('Error creating petition:', error);
      setMessage('Failed to create petition. Please try again.');
    }
  };

  const handleCreatePetition = async (e) => {
    e.preventDefault();
    createPetition(title, content, userId);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primaryOrange">Shangri-La Petition Platform</h1>
        {isLoggedIn && (
          <div className="flex items-center space-x-6">
            <button
              className="text-gray-800 hover:text-primaryOrange transition duration-300 ease-in-out text-md font-semibold"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
            <button
              className="hover:text-gray-800 text-primaryOrange transition duration-300 ease-in-out text-md font-semibold"
              onClick={() => navigate('/NewPetition')}
            >
              New Petition
            </button>
            <button
              className="bg-primaryOrange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300 ease-in-out"
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/');
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create a New Petition</h2>
          {message && <p className="text-center text-green-500 mb-4">{message}</p>}
          <form onSubmit={handleCreatePetition}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
                Petition Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange"
                placeholder="Enter petition title"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
                Petition Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange"
                placeholder="Describe your petition"
                rows="6"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primaryOrange text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Create Petition
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePetition;
