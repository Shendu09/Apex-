import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const LoginPage = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      setLoading(true);
      setError('');
      try {
        const result = await authService.sendOTP(phoneNumber);
        setStep('otp');
        // Show OTP in alert for demo (in production, it's sent via SMS)
        if (result.otp) {
          alert(`Demo OTP: ${result.otp}\n\n(In production, this will be sent via SMS)`);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        console.error('OTP send error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      setLoading(true);
      setError('');
      try {
        // For now, just verify OTP - don't send userType and language yet
        // They will be selected in the next screens
        await authService.verifyOTP(
          phoneNumber,
          otp,
          undefined, // userType will be selected on next page
          undefined  // language will be selected on next page
        );
        // Call onLogin to update phone number in App state
        onLogin(phoneNumber);
        // Navigate to language selection first
        navigate('/language');
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        console.error('OTP verify error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-farm-green rounded-full p-6 mb-4">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 12h3v9h6v-6h2v6h6v-9h3L12 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-farm-dark-green mb-2">Farm Bridge</h1>
          <p className="text-gray-600">Welcome to Farm Bridge</p>
          <p className="text-sm text-gray-500 mt-2">© 2026 Farm Bridge. All rights reserved.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Enter Phone Number</label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-farm-green transition-colors">
                  <span className="px-4 py-3 bg-gray-50 text-gray-700 font-medium">+91</span>
                  <input
                    type="tel"
                    maxLength="10"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10 digit number"
                    className="flex-1 px-4 py-3 outline-none text-lg"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || phoneNumber.length !== 10}
                className="w-full bg-farm-green hover:bg-farm-dark-green text-white font-semibold py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Verify OTP</h2>
              <p className="text-gray-600 text-sm text-center mb-6">Sent to +91 {phoneNumber}</p>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Enter OTP</label>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6 digit OTP"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-farm-green transition-colors text-lg text-center tracking-widest"
                  required
                />
              </div>
              <button
                disabled={loading || otp.length !== 6}
                className="w-full bg-farm-green hover:bg-farm-dark-green text-white font-semibold py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                disabled={loading}
                className="w-full mt-3 text-farm-green hover:text-farm-dark-green font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change Number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
