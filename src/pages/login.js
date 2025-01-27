import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);

        if (data.role === 'Committee') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="flex items-center justify-center w-full md:w-1/2 bg-gray-50 overflow-hidden">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-semibold text-gray-800">Welcome back!</h1>
          </div>

          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-600 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-600 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                  placeholder="Enter your password"
                />
              </div>

              <div className='flex justify-center'>
                <button
                  type="submit"
                  className="w-[100] bg-primaryOrange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
                >
                  Login
                </button>
              </div>
            </form>

            {errorMessage && (
              <div className="text-red-500 text-center mt-4">
                {errorMessage}
              </div>
            )}

            <div className="mt-4 text-center">
              <p className='text-sm'>Type your Admin credentials, if you are an Admin</p>
              <p className="mt-2 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primaryOrange hover:underline">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/2 overflow-hidden hidden md:block">
        <div className="flex flex-col justify-center items-center h-screen">
          <p className="text-primaryOrange text-4xl font-bold">
            Be a Citizen of Change
          </p>
          <p className="text-gray-800 text-4xl font-bold top-10">
            Shangri-La Petition Platform
          </p>
          <img
            src="/signinImage.png"
            alt="Shangri-La Petition Platform"
            className="object-cover w-[420px] h-[500px]"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
