import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PetitionStatusPieChart = () => {
  const [petitions, setPetitions] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ['Open', 'Closed'],
    datasets: [
      {
        label: 'Petition Status',
        data: [0, 0],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  });

  const [openCount, setOpenCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);

  useEffect(() => {
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
      const open = petitions.filter(petition => petition.status === 'open').length;
      const closed = petitions.filter(petition => petition.status === 'closed').length;

      setOpenCount(open);
      setClosedCount(closed);

      setChartData({
        labels: ['Open', 'Closed'],
        datasets: [
          {
            label: 'Petition Status',
            data: [open, closed],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384'],
          },
        ],
      });
    }
  }, [petitions]);

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
    <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300 ease-in-out">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">Petition Status Overview</h1>
      
      <div className="flex flex-col md:flex-row items-center justify-center p-4 max-w-[1500px] mx-auto gap-10">
        <div className="w-full flex flex-col justify-center items-start bg-gray-100 rounded-lg shadow-lg p-6 mb-6 md:mb-0 hover:shadow-2xl transition duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Petition Status</h2>
          <div className="flex justify-between mb-4">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold text-blue-600">{openCount}</span>
              <span className="text-lg text-gray-600">Open Petitions</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold text-red-600">{closedCount}</span>
              <span className="text-lg text-gray-600">Closed Petitions</span>
            </div>
          </div>
        </div>
        
        <div className="max-h-[250px] w-[300px] md:w-[350px] p-4 bg-white rounded-lg shadow-md hover:shadow-2xl transition duration-300">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default PetitionStatusPieChart;
