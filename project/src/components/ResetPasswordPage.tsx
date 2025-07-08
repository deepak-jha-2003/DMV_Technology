import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: ''
    });
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        const emailParam = searchParams.get('email');
        
        if (!tokenParam || !emailParam) {
            setError('Invalid reset link. Please request a new password reset.');
            return;
        }
        
        setToken(tokenParam);
        setEmail(emailParam);
    }, [searchParams]);

    // Password strength checker
    const checkPasswordStrength = (password: string) => {
        let score = 0;
        let feedback = '';
        
        if (password.length >= 8) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        switch (score) {
            case 0:
            case 1:
                feedback = 'Very weak';
                break;
            case 2:
                feedback = 'Weak';
                break;
            case 3:
                feedback = 'Fair';
                break;
            case 4:
                feedback = 'Good';
                break;
            case 5:
                feedback = 'Strong';
                break;
            default:
                feedback = 'Very weak';
        }
        
        return { score, feedback };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(null);
        
        // Check password strength
        if (name === 'newPassword') {
            const strength = checkPasswordStrength(value);
            setPasswordStrength(strength);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token || !email) {
            setError('Invalid reset link. Please request a new password reset.');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        
        if (formData.newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    email,
                    newPassword: formData.newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to reset password');
                setIsLoading(false);
                return;
            }

            // Success - redirect to login
            alert('Password reset successful! You can now sign in with your new password.');
            navigate('/');
            
        } catch (err: any) {
            if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                setError('Unable to connect to server. Please check your internet connection.');
            } else {
                setError('Error resetting password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Reset Link</h1>
                    <p className="text-lg text-gray-600 mb-8">
                        This password reset link is invalid or has expired.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transition-all duration-200"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-600">Enter your new password for {email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            New Password *
                        </label>
                        <div className="relative">
                            <input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Enter your new password"
                                required
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        
                        {formData.newPassword && (
                            <div className="mt-2">
                                <div className="flex items-center space-x-2 text-sm">
                                    <div className="flex-1">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                    passwordStrength.score <= 1 ? 'bg-red-500' :
                                                    passwordStrength.score <= 2 ? 'bg-yellow-500' :
                                                    passwordStrength.score <= 3 ? 'bg-blue-500' :
                                                    'bg-green-500'
                                                }`}
                                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <span className={`text-xs ${
                                        passwordStrength.score <= 1 ? 'text-red-500' :
                                        passwordStrength.score <= 2 ? 'text-yellow-500' :
                                        passwordStrength.score <= 3 ? 'text-blue-500' :
                                        'text-green-500'
                                    }`}>
                                        {passwordStrength.feedback}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Password should be at least 8 characters with uppercase, lowercase, number, and special character
                                </p>
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password *
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your new password"
                                required
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                Passwords do not match
                            </p>
                        )}
                        {formData.confirmPassword && formData.newPassword === formData.confirmPassword && formData.newPassword && (
                            <p className="text-green-500 text-xs mt-1 flex items-center">
                                <CheckCircle size={14} className="mr-1" />
                                Passwords match
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
                        className={`w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-sky-600 hover:to-blue-700 font-medium transition-all duration-200 flex items-center justify-center ${
                            isLoading || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:shadow-lg transform hover:scale-[1.02]'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Resetting Password...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </button>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                            <AlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                            <div className="text-red-700 text-sm">
                                {error}
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            Back to Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
