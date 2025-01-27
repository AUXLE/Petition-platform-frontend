import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [petitions, setPetitions] = useState([]);
  const [threshold, setThreshold] = useState(100);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [selectedPetitionId, setSelectedPetitionId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5001/slpp/petitions')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch petitions');
        }
        return response.json();
      })
      .then((data) => {
        setPetitions(data.petitions || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching petitions:', error);
        setLoading(false);
      });
  }, []);

  const updateThreshold = () => {
    fetch('http://localhost:5001/slpp/threshold', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ threshold }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update threshold');
        }
        return response.json();
      })
      .then(() => {
        alert(`Threshold updated to ${threshold}`);
      })
      .catch((error) => console.error('Error updating threshold:', error));
  };

  const closePetition = (petitionId) => {
    fetch(`http://localhost:5001/slpp/close/${petitionId}`, {
      method: 'PATCH',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to close petition');
        }
        return response.json();
      })
      .then(() => {
        setPetitions((prevPetitions) =>
          prevPetitions.map((petition) =>
            petition.petition_id === petitionId
              ? { ...petition, status: 'closed' }
              : petition
          )
        );
        alert('Petition closed successfully');
      })
      .catch((error) => console.error('Error closing petition:', error));
  };

  const respondToPetition = () => {
    if (!selectedPetitionId || !response.trim()) {
      alert('Please select a petition and provide a response');
      return;
    }

    const token = localStorage.getItem('token');

    fetch('http://localhost:5001/slpp/respond', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ petitionId: selectedPetitionId, response }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to respond to petition');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Response added successfully', data);

        setPetitions((prevPetitions) =>
          prevPetitions.map((petition) =>
            petition.petition_id === selectedPetitionId
              ? { ...petition, response, status: 'closed' }
              : petition
          )
        );

        alert('Response added successfully');
        setResponse('');
        setSelectedPetitionId(null);
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error responding to petition:', error);
        alert('Error responding to petition');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Loading petitions...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Control Panel</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition duration-300 ease-in-out mb-6"
      >
        Log Out
      </button>

      <div className="mb-8">
        <label className="text-lg font-semibold mb-2 block">Set Signature Threshold</label>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="border border-gray-300 rounded p-2 mr-4"
        />
        <button
          onClick={updateThreshold}
          className="bg-primaryOrange text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-300 ease-in-out"
        >
          Update Threshold
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">All Petitions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {petitions.map((petition) => (
            <div
              key={petition.petition_id}
              className="bg-white shadow-md rounded-lg p-6 border-l-4 hover:shadow-xl transition duration-300 ease-in-out"
              style={{ borderColor: petition.status === 'open' ? '#36A2EB' : '#FF6384' }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3">{petition.petition_title}</h3>
              <p className="text-gray-600 mb-3">{petition.petition_text}</p>
              <p className="text-sm text-gray-500 mb-2">
                Status: <span className="font-medium">{petition.status}</span>
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Signatures: <span className="font-medium">{petition.signatures}</span>
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Response: {petition.response || 'No response yet'}
              </p>
              <div className="flex space-x-4 mt-4">
                {/* {petition.status === 'open' && (
                  <button
                    onClick={() => closePetition(petition.petition_id)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 ease-in-out"
                  >
                    Close Petition
                  </button>
                )} */}
                <button
                  onClick={() => {
                    setSelectedPetitionId(petition.petition_id);
                    setShowModal(true);
                  }}
                  className="bg-primaryOrange text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-300 ease-in-out"
                >
                  Respond
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Add Response to Petition</h3>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="border border-gray-300 rounded w-full p-3 mt-2 mb-4"
              rows="4"
              placeholder="Type your response here..."
            ></textarea>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={respondToPetition}
                className="bg-primaryOrange text-white py-2 px-6 rounded hover:bg-orange-600 transition duration-300 ease-in-out"
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
