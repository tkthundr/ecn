import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourtCaseNotificationSystem from './components/CourtCaseNotificationSystem';
import PricingPage from './pages/Pricing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CourtCaseNotificationSystem />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </Router>
  );
}

export default App;