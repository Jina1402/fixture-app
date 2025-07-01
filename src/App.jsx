
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import FeedbackForm from '@/pages/FeedbackForm';
import PulseCheck from '@/pages/PulseCheck';
import Dashboard from '@/pages/Dashboard';
import AdminPanel from '@/pages/AdminPanel';

function App() {
  return (
    <>
      <Helmet>
        <title>Fixure - Feedback to Resolution Platform</title>
        <meta name="description" content="Transform team feedback into actionable resolutions with Fixure's strategic insight platform for fast-growing companies." />
      </Helmet>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/pulse" element={<PulseCheck />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </>
  );
}

export default App;
