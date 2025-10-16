import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';
import RSVPPage from '../pages/RSVPPage';
import ChatPage from '../pages/ChatPage';
import LoadingSpinner from '../components/LoadingSpinner';
import Login from '../pages/Login';
import RSVPDashboard from '../pages/RSVPDashboard';

const ProtectedRoute = ({ children }:any) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Login />;
};

const AllRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
      <Route path="/rsvp-dashboard" element={<ProtectedRoute><RSVPDashboard /></ProtectedRoute>}/>
      <Route path="/rsvp/:id" element={<ProtectedRoute><RSVPPage /></ProtectedRoute>}/>
      <Route path="/rsvp/chat/:id" element={ <ProtectedRoute> <ChatPage /> </ProtectedRoute> }/>
    </Routes>
  );
};

export default AllRoutes;