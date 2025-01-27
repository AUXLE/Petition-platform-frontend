import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { FaPen, FaCheckCircle, FaFileAlt } from 'react-icons/fa';

const PetitionersDashboard = () => {
  const navigate = useNavigate();
  const [petitions, setPetitions] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [filedCount, setFiledCount] = useState(0);
  const [signedCount, setSignedCount] = useState(0);

  const [chartData, setChartData] = useState({
    labels: ['Filed', 'Signed'],
    datasets: [
      {
        label: 'Petition Status',
        data: [0, 0],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  });

  useEffect(() => {
    const email = localStorage.getItem('email');
    setUserEmail(email);

    if (!email) {
      console.error('User email not found in localStorage');
      return;
    }

    const fetchPetitions = async () => {
      try {
        const response = await fetch('http://localhost:5001/slpp/petitions');
        const data = await response.json();
        if (response.ok) {
          setPetitions(data.petitions);
        } else {
          console.error('Error fetching petitions:', data.message);
        }
      } catch (error) {
        console.error('Error fetching petitions:', error);
      }
    };

    fetchPetitions();
  }, []);

  useEffect(() => {
    if (petitions && petitions.length > 0) {
      const filed = petitions.filter(petition => petition.petitioner === userEmail).length;
      const signed = petitions.filter(petition => petition.signaturesArray && petition.signaturesArray.includes(userEmail)).length;

      setFiledCount(filed);
      setSignedCount(signed);

      setChartData({
        labels: ['Filed', 'Signed'],
        datasets: [
          {
            label: 'Petition Status',
            data: [filed, signed],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384'],
          },
        ],
      });
    }
  }, [petitions, userEmail]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        enabled: true,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="bg-white shadow-lg rounded-lg px-4 pt-4 pb-1 mr-4 flex-col items-start justify-between hover:shadow-xl transition duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-800 mr-11">Welcome to the Dashboard!</h1>
        <button
          className="w-[100] bg-primaryOrange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
          onClick={() => navigate('/NewPetition')}
        >
          + New Petition
        </button>
      </div>
      <p className="text-primaryOrange text-lg">Your Voice Matters...</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="flex flex-col items-center justify-center p-6 bg-blue-100 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
          <FaPen className="text-4xl text-primaryOrange mb-4" />
          <p className="text-xl font-semibold text-gray-800 mb-2">Petitions You Filed</p>
          <p className="text-2xl font-bold text-primaryOrange">{filedCount}</p>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-green-100 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
          <FaCheckCircle className="text-4xl text-primaryGreen mb-4" />
          <p className="text-xl font-semibold text-gray-800 mb-2">Petitions You Signed</p>
          <p className="text-2xl font-bold text-primaryGreen">{signedCount}</p>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-yellow-100 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
          <FaFileAlt className="text-4xl text-primaryYellow mb-4" />
          <p className="text-xl font-semibold text-gray-800 mb-2">Total Petitions</p>
          <p className="text-2xl font-bold text-primaryYellow">{filedCount + signedCount}</p>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center mt-2">
        <div className="max-h-[250px]">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default PetitionersDashboard;
