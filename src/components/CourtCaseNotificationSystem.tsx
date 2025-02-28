// Login Modal Component
const LoginModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Login</h3>
        <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            required
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-3">
          <button
            type="submit"
            className="w-full sm:w-1/2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-3 sm:mb-0"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setShowLoginModal(false)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);import React, { useState } from 'react';

const CourtCaseNotificationSystem = () => {
const [caseId, setCaseId] = useState('');
const [email, setEmail] = useState('');
const [isSubmitted, setIsSubmitted] = useState(false);
const [errors, setErrors] = useState({});
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [showLoginModal, setShowLoginModal] = useState(false);
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');

const validateCaseId = (id) => {
  // Regex pattern for case ID format: 24E000000-123
  const pattern = /^\d{2}[A-Z]\d{6}-\d{3}$/;
  return pattern.test(id);
};

const validateEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Reset errors
  const newErrors = {};
  setSubmitError('');
  
  // Validate inputs
  if (!validateCaseId(caseId)) {
    newErrors.caseId = 'Please enter a valid case ID (format: 24E000000-123)';
  }
  
  if (!validateEmail(email)) {
    newErrors.email = 'Please enter a valid email address';
  }
  
  setErrors(newErrors);
  
  // If no errors, process the form
  if (Object.keys(newErrors).length === 0) {
    setIsSubmitting(true);
    
    try {
      // Get API URL based on environment
      const apiBaseUrl = import.meta.env.DEV 
        ? 'http://localhost:3001' 
        : '';
      
      // Submit to API route
      const response = await fetch(`${apiBaseUrl}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId,
          email,
          subscriptionDate: new Date().toISOString(),
          isActive: true
        }),
      });
      
      const data = await response.json();
      
      if (response.status === 403) {
        // Show modal instead of error message
        setShowLimitModal(true);
        throw new Error('Free tier limit reached! Please upgrade your plan to monitor additional cases.');
      } else if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }
      
      // Success
      setIsSubmitted(true);
    } catch (error) {
      console.error('Subscription error:', error);
      if (!error.message.includes('Free tier limit reached')) {
        // Only show other errors in the form
        setSubmitError(error.message || 'An error occurred while subscribing. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }
};

const handleLogin = (e) => {
  e.preventDefault();
  // In a real application, you would validate credentials against a backend
  if (username && password) {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setUsername('');
    setPassword('');
  }
};

const handleLogout = () => {
  setIsLoggedIn(false);
};

// Navigation Menu Component
const NavigationMenu = () => (
  <nav className="bg-gray-800 text-white p-4">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <div className="font-bold text-lg">North Carolina eCourts Notification System</div>
      <div>
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm hidden sm:inline">Welcome, User</span>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm font-medium"
          >
            Login
          </button>
        )}
      </div>
    </div>
  </nav>
);

// Login Modal Component
const LoginModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Login</h3>
        <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            required
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-3">
          <button
            type="submit"
            className="w-full sm:w-1/2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-3 sm:mb-0"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setShowLoginModal(false)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

// Main Content Component
const MainContent = () => {
  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Subscription Confirmed!</h2>
          <p className="text-sm text-gray-600 mb-4">
            You will now receive notifications for case <span className="font-medium">{caseId}</span> at <span className="font-medium">{email}</span>
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                setCaseId('');
                setEmail('');
                setIsSubmitted(false);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Subscribe to Another Case
            </button>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              View Pricing Plans
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">North Carolina eCourts Notifications</h2>
        <p className="text-sm text-gray-600">
          Enter your North Carolina case ID and email address to receive notifications about new filings and updates in the eCourts system.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="caseId" className="block text-sm font-medium text-gray-700 mb-1">
            Case ID
          </label>
          <input
            type="text"
            id="caseId"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            placeholder="24E000000-123"
            className={`w-full px-3 py-2 border ${errors.caseId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.caseId && (
            <p className="mt-1 text-xs text-red-600">{errors.caseId}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe to Notifications'}
          </button>
          
        {submitError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              <p>{submitError}</p>
              {submitError.includes('Free tier limit reached') && (
                <a 
                  href="/pricing" 
                  className="mt-2 inline-block text-blue-600 hover:text-blue-800 underline"
                >
                  View pricing plans
                </a>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

return (
  <div className="min-h-screen bg-gray-100 w-full">
    <NavigationMenu />
    <div className="py-8 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full mx-auto">
        <MainContent />
        <div className="max-w-6xl mx-auto mt-6 p-4 bg-gray-50 rounded border border-gray-200 text-xs text-gray-500 text-center">
          <p>DISCLAIMER: This site is not affiliated with, endorsed by, or connected to any North Carolina court system, the North Carolina Administrative Office of the Courts, eCourts, or any government agency. This is a third-party notification service.</p>
        </div>
      </div>
    </div>
    {showLoginModal && <LoginModal />}
    {showLimitModal && <FreeTierLimitModal />}
  </div>
);
};

export default CourtCaseNotificationSystem;