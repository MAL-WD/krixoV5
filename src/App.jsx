import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import ContactPage from './ContactPage';
import HireUsPage from './HireUsPage';
import AdminPanel from './AdminPanel';
import WorkerProfile from './WorkerProfile';
import ScrollToTop from './components/ScrollTop';
import APITest from './components/APITest';
import BackendTest from './components/BackendTest';
import CorsTest from './components/CorsTest';
import BackendDiagnostic from './components/BackendDiagnostic';
import DetailedApiTest from './components/DetailedApiTest';
import SimpleApiTest from './components/SimpleApiTest';
import AdminTest from './components/AdminTest';
import ErrorPage from './components/ErrorPage';

const App = () => {
  return (
    <Router>
        <ScrollToTop/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/HireUs" element={<HireUsPage />} />
        <Route path="/Admin" element={<AdminPanel/>}/>
        <Route path="/worker-profile" element={<WorkerProfile/>}/>
        <Route path="/api-test" element={<APITest/>}/>
        <Route path="/backend-test" element={<BackendTest/>}/>
        <Route path="/cors-test" element={<CorsTest/>}/>
        <Route path="/backend-diagnostic" element={<BackendDiagnostic/>}/>
        <Route path="/detailed-api-test" element={<DetailedApiTest/>}/>
        <Route path="/simple-api-test" element={<SimpleApiTest/>}/>
        <Route path="/admin-test" element={<AdminTest/>}/>
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;