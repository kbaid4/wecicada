import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignUpPage from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import SuppliersPage from './components/SuppliersPage';
import CreateEventPage from './components/CreateEventPage';
import AddSupplier from './components/AddSupplier';
import SuppliersProfile from './components/SuppliersProfile';
import Events from './components/Events';
import EventsManagementPage from './components/EventsManagementPage';
import CreateTaskPage from './components/CreateTaskPage';
import ServiceProvider from './components/ServiceProvider';
import Marketing from './components/Marketing';
import Legal from './components/Legal';
import CateringService from './components/CateringService';
import AVP from './components/AVP';
import DDS from './components/DDS';
import EntPrf from './components/EntPrf';
import Furniture from './components/Furniture';
import PhotoVid from './components/PhotoVid';
import Transportation from './components/Transportation';
import PromoMarketing from './components/PromoMarketing';
import Techpro from './components/Techpro';
import SupplierSide from './components/SupplierSide';
import EditProfile from './components/EditProfile';
import SupplierHomepage from './components/SupplierHomepage';
import AssignedTask from './components/AssignedTask'
import MessagesPage from './components/MessagesPage'


function App() {
  return (
    <Routes>

      <Route path="/" element={<LandingPage />} />
      <Route path="/SignUpPage" element={<SignUpPage />} />
      <Route path="/SignInPage" element={<SignInPage />} />
      <Route path="/SuppliersPage" element={<SuppliersPage />} />
      <Route path="/CreateEventPage" element={<CreateEventPage />} />
      <Route path="/AddSupplier" element={<AddSupplier />} />
      <Route path="/SuppliersProfile" element={<SuppliersProfile />} />
      <Route path="/Events" element={<Events />} />
      <Route path="/EventsManagementPage" element={<EventsManagementPage />} />
      <Route path="/CreateTaskPage/:eventId" element={<CreateTaskPage />} />
      <Route path="/ServiceProvider" element={<ServiceProvider />} />
      <Route path="/Marketing" element={<Marketing />} />
      <Route path="/Legal" element={<Legal />} />
      <Route path="/CateringService" element={<CateringService />} />
      <Route path="/AVP" element={<AVP />} />
      <Route path="/DDS" element={<DDS />} />
      <Route path="/EntPrf" element={<EntPrf />} />
      <Route path="/Furniture" element={<Furniture />} />
      <Route path="/PhotoVid" element={<PhotoVid />} />
      <Route path="/Transportation" element={<Transportation />} />
      <Route path="/PromoMarketing" element={<PromoMarketing />} />
      <Route path="/Techpro" element={<Techpro />} />
      <Route path="/SupplierSide" element={<SupplierSide />} />
      <Route path="/EditProfile" element={<EditProfile />} />
      <Route path="/SupplierHomepage" element={<SupplierHomepage />} />
      <Route path="/AssignedTask" element={<AssignedTask />} />
      <Route path="/MessagesPage" element={<MessagesPage />} />
    </Routes>
  );
}

export default App;


