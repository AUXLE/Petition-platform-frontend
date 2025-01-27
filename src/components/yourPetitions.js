import React from "react";
import { useNavigate } from 'react-router-dom';
import PetitionCards from "./petitionCard";

const YourPetitions = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-gray-800 mr-11">Your Petitions</p>
            <button
                className="w-[100] text-primaryOrange py-2 px-4 rounded-lg hover:text-orange-600 hover:underline transition font-semibold"
                onClick={() => navigate('/my-petitions')}
              >
                View all
              </button>
            </div>
            <div>
                <PetitionCards/>
            </div>
        </div>
    );
};

export default YourPetitions;