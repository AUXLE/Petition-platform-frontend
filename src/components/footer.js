import React from "react";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    return(
        <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} Shangri-La Petition Platform. All rights reserved.
            </p>
            {/* <div className="flex items-center space-x-6">
                <button
                    className="hover:text-gray-800 text-primaryOrange transition duration-300 ease-in-out text-md font-semibold"
                    onClick={() => navigate('/about')}
                >
                    About Us
                </button>
                <button
                    className="hover:text-gray-800 text-primaryOrange transition duration-300 ease-in-out text-md font-semibold"
                    onClick={() => navigate('/contact')}
                >
                    Contact
                </button>
                <button
                    className="hover:text-gray-800 text-primaryOrange transition duration-300 ease-in-out text-md font-semibold"
                    onClick={() => navigate('/privacy')}
                >
                    Privacy Policy
                </button>
            </div> */}
        </div>
    );
};

export default Footer;
