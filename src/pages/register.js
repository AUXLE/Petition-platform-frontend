import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    dob: '',
    password: '',
    biometricId: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle Input Change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! You can now login.');
        setFormData({
          email: '',
          fullName: '',
          dob: '',
          password: '',
          biometricId: '',
        });
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Left Side: Register Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-gray-50 overflow-hidden ">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Register</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Fullname Input */}
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-gray-600 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your fullname"
                required
              />
            </div>

            {/* Date of Birth Input */}
            <div className="mb-4">
              <label htmlFor="dob" className="block text-gray-600 font-medium mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Biometric Input */}
            <div className="mb-4">
              <label htmlFor="biometricId" className="block text-gray-600 font-medium mb-2">
                Biometric ID
              </label>
              <input
                type="text"
                id="biometricId"
                value={formData.biometricId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your Biometric Id"
                required
              />
            </div>

            {/* Submit Button */}
            <div className='flex justify-center'>
            <button
              type="submit"
              className="w-[100] bg-primaryOrange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
            >
              Register
            </button>
            </div>
            
          </form>

          {/* Additional Links */}
          <div className="mt-4 text-center">
            <p className="mt-2 text-sm">
              Already have an account?{' '}
              <Link to="/" className="text-customBlue hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Image */}
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

export default RegisterForm;
