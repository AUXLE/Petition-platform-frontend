import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import CreatePetition from './pages/createPetition';
import AllMyPetitions from './pages/allMyPetitions';
import AdminPage from './pages/adminPanel';
import AllSignPetitions from './pages/allSignPetitions';

function App() {
  return (
    <div className="bg-gray-50">
      <Router>
        <Routes>
          {/* Route for Login Page */}
          <Route path="/" element={<LoginForm />} />

          {/* Route for Register Page */}
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/NewPetition" element={<CreatePetition />} />
          <Route path='/my-petitions' element={<AllMyPetitions/>}/>
          <Route path='/admin' element={<AdminPage/>}/>
          <Route path='/sign-petitions' element={<AllSignPetitions/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
