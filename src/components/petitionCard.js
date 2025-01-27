import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PetitionCards = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('email');
    
    if (!userEmail) {
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
        const userPetitions = allPetitions.filter(petition => petition.petitioner === userEmail);
        setPetitions(userPetitions);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching petitions:', error);
        setLoading(false);
      });
  }, []);

  const viewAllPetitions = () => {
    navigate('/my-petitions');
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Loading petitions...</div>;
  }

  if (petitions.length === 0) {
    return <div className="text-center text-lg text-gray-500">No petitions found for this user.</div>;
  }

  const displayedPetitions = petitions.slice(0, 3);

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-6 justify-center">
        {displayedPetitions.map((petition) => (
          <div 
            key={petition.petition_id} 
            className="relative bg-white shadow-md rounded-lg w-80 p-6 border-l-4 hover:shadow-xl hover:border-blue-600 transition duration-300 ease-in-out"
            style={{ borderColor: petition.status === 'open' ? '#36A2EB' : '#FF6384' }}
          >
            <div 
              className="absolute top-0 left-0 w-full h-2 rounded-t-lg" 
              style={{ backgroundColor: petition.status === 'open' ? '#36A2EB' : '#FF6384' }}
            ></div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-3">{petition.petition_title}</h2>
            
            <p className="text-gray-600 line-clamp-3 mb-3">{petition.petition_text}</p>
            
            <div className="flex justify-between items-center mt-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${petition.status === 'open' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                {petition.status.charAt(0).toUpperCase() + petition.status.slice(1)}
              </div>
              <div className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                {petition.signatures || 0} Signatures
              </div>
            </div>

            <div className="mt-6 border-t pt-3 text-sm italic text-gray-500">
              Response: {petition.response || 'No response yet'}
            </div>
          </div>
        ))}
      </div>

      {petitions.length > 3 && (
        <div className="mt-6 flex justify-center">
          <button 
            onClick={viewAllPetitions} 
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            View All Petitions
          </button>
        </div>
      )}
    </div>
  );
};

export default PetitionCards;
