import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import CourtCaseNotificationSystem from './components/CourtCaseNotificationSystem';
import PricingPage from './pages/Pricing';
import { trackPageView } from './utils/analytics';

// Component to track page views
function PageViewTracker() {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);
  
  return null;
}

function App() {
  return (
    <Router>
      <PageViewTracker />
      <Routes>
        <Route path="/" element={<CourtCaseNotificationSystem />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </Router>
  );
}

export default App;