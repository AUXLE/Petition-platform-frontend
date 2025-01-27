import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';

const AllSignPetitions = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const email = localStorage.getItem('email');
    setUserEmail(email);

    if (!email) {
      console.error('User email not found in local storage');
      setLoading(false);
      return;
    }

    fetch('http://localhost:5001/slpp/petitions')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const allPetitions = data.petitions;
        const otherPetitions = allPetitions.filter(
          (petition) => petition.petitioner !== email
        );
        setPetitions(otherPetitions);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching petitions:', error);
        setLoading(false);
      });
  }, []);

  const handleSignPetition = (petitionId) => {
    fetch('http://localhost:5001/slpp/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        petitionId: petitionId,
        userId: userEmail,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to sign the petition');
        }
        return response.json();
      })
      .then(() => {
        alert('Successfully signed the petition!');
        setPetitions((prevPetitions) =>
          prevPetitions.map((petition) =>
            petition.petition_id === petitionId
              ? { ...petition, signatures: petition.signatures + 1 }
              : petition
          )
        );
      })
      .catch((error) => {
        console.error('Error signing petition:', error);
        alert('Failed to sign the petition. Please try again.');
      });
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Loading petitions...</div>;
  }

  if (petitions.length === 0) {
    return <div className="text-center text-lg text-gray-500">There are no petitions to sign.</div>;
  }

  return (
    <div>
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primaryOrange">Shangri-La Petition Platform</h1>
        {isLoggedIn && (
          <div className="flex items-center space-x-6">
            <button
              className="hover:text-gray-800 text-primaryOrange transition duration-300 ease-in-out text-md font-semibold"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
            <button
              className="text-gray-800 hover:text-primaryOrange transition duration-300 ease-in-out text-md font-semibold"
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
      <div className="p-6">
        <div className="flex items-center justify-between my-4">
          <p className="text-3xl font-semibold text-gray-800 mr-11">Petitions to Sign</p>
          <button
            className="w-[100] bg-primaryOrange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
            onClick={() => navigate('/NewPetition')}
          >
            + New Petition
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {petitions.map((petition) => (
            <div
              key={petition.petition_id}
              className="relative bg-white shadow-md rounded-lg p-6 border-l-4 hover:shadow-xl hover:border-blue-600 transition duration-300 ease-in-out"
              style={{ borderColor: petition.status === 'open' ? '#36A2EB' : '#FF6384' }}
            >
              <div
                className="absolute top-0 left-0 w-full h-2 rounded-t-lg"
                style={{ backgroundColor: petition.status === 'open' ? '#36A2EB' : '#FF6384' }}
              ></div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">{petition.petition_title}</h2>
              <p className="text-gray-600 line-clamp-3 mb-3">{petition.petition_text}</p>
              <div className="flex justify-between items-center mt-4">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    petition.status === 'open' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {petition.status.charAt(0).toUpperCase() + petition.status.slice(1)}
                </div>
                <div className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  {petition.signatures || 0} Signatures
                </div>
              </div>
              <div className="mt-6 border-t pt-3 text-sm italic text-gray-500">
                Response: {petition.response || 'No response yet'}
              </div>
              {petition.status === 'open' && (
                <button
                  onClick={() => handleSignPetition(petition.petition_id)}
                  className="mt-4 bg-primaryOrange text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-300 ease-in-out"
                >
                  Sign Petition
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default AllSignPetitions;
