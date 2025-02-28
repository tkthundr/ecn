import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = () => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize('G-DMH2YMEPGH');
  } else {
    console.log('Google Analytics is disabled in development mode');
  }
};

// Track page views
export const trackPageView = (path) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.send({ hitType: 'pageview', page: path });
  }
};

// Track events
export const trackEvent = (category, action, label = null, value = null) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.event({
      category,
      action,
      label,
      value
    });
  }
}; 