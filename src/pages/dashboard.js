import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PetitionStatusPieChart from '../components/piechart';
import PetitionersDashboard from '../components/petitionersDashboard';
import YourPetitions from '../components/yourPetitions';
import OtherPetitions from '../components/otherPetitions';
import Footer from '../components/footer';

const Dashboard = () => {
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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-primaryOrange hidden md:block">
  Shangri-La Petition Platform
</h1>

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

      <div className="flex p-4 flex-col">
        {isLoggedIn ? (
          <div className="flex flex-row-reverse w-full mb-4">
            <div className="flex flex-col sm:flex-row-reverse gap-6">
              <div className="flex-[0.40] sm:flex-[0.40] w-full">
                <PetitionStatusPieChart />
                <div className="bg-white shadow-lg rounded-lg mt-4 p-4 flex justify-between sm:justify-around flex-col sm:flex-row">
                  <div className="sm:w-1/2 w-full mb-4 sm:mb-0">
                    <p className="text-primaryOrange text-3xl">Be a Citizen of Change!</p>
                    <p className="text-gray-600">Change doesn't happen in silence.</p>
                    <button
                      onClick={() => navigate('/sign-petitions')}
                      className="w-full sm:w-[150px] bg-primaryOrange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition mt-4 mb-3"
                    >
                      Sign a Petition
                    </button>
                  </div>
                  <div className="sm:w-1/2 w-full flex justify-center sm:justify-start">
                    <img
                      src="/signinImage.png"
                      alt="Shangri-La Petition Platform"
                      className="object-cover w-[125px] h-[125px] mx-auto sm:mx-0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-[0.60] sm:flex-[0.60] w-full">
                <PetitionersDashboard />
              </div>
            </div>
          </div>
        ) : (
          <p>Redirecting to login...</p>
        )}
        {isLoggedIn && <YourPetitions />}
        {isLoggedIn && <OtherPetitions />}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
