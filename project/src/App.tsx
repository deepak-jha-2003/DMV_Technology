import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AuthSuccess from './components/AuthSuccess';

// Home page component with all sections
const HomePage = () => (
  <>
    <Hero />
    <Services />
    <About />
    <Testimonials />
    <Contact />
  </>
);

// Contact page component (separate page)
const ContactPage = () => {
  // Scroll to top when contact page loads
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      <Contact />
    </div>
  );
};

// Success pages
const LoginSuccessPage = () => (
  <div className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
    <div className="text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back!</h1>
        <p className="text-lg text-gray-600 mb-8">You have successfully logged in to DMV Technology.</p>
      </div>
    </div>
  </div>
);

const SignupSuccessPage = () => (
  <div className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
    <div className="text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Created!</h1>
        <p className="text-lg text-gray-600 mb-8">Welcome to DMV Technology. Your account has been successfully created.</p>
      </div>
    </div>
  </div>
);

// Get Started page
const GetStartedPage = () => (
  <div className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
    <div className="text-center max-w-2xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Let's Get Started</h1>
      <p className="text-lg text-gray-600 mb-8">
        Ready to transform your business with cutting-edge technology solutions? 
        Contact us today to discuss your project requirements.
      </p>
      <div className="space-y-4">
        <Link 
          to="/contact" 
          className="inline-block bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Contact Us Now
        </Link>
        <div className="text-sm text-gray-500">
          Or call us directly at: <span className="font-medium text-gray-700">(555) 123-4567</span>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/login-success" element={<LoginSuccessPage />} />
        <Route path="/signup-success" element={<SignupSuccessPage />} />
        <Route path="/get-started" element={<GetStartedPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;