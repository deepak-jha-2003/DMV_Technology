import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
    show: boolean;
    onClose: () => void;
}

const LoginSignupModal: React.FC<Props> = ({ show, onClose }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formType, setFormType] = useState<'login' | 'signup'>('login');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: ''
    });

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
        setPasswordError(false);
        
        // Check password strength for signup
        if (name === 'password' && formType === 'signup') {
            const strength = checkPasswordStrength(value);
            setPasswordStrength(strength);
        }
    };

    // Social login handlers
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const handleFacebookLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/facebook';
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: formData.email })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to send reset email');
                setIsLoading(false);
                return;
            }

            // Show success message
            setError(null);
            alert(`Password reset email sent! Check your inbox at ${formData.email}`);
            
        } catch (err: any) {
            if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                setError('Unable to connect to server. Please check your internet connection.');
            } else {
                setError('Error sending reset email. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation for signup
        if (formType === 'signup') {
            if (!agreeToTerms) {
                setError('Please agree to the Terms and Conditions');
                setIsLoading(false);
                return;
            }
            
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match!');
                setPasswordError(true);
                setIsLoading(false);
                return;
            }
            
            if (formData.password.length < 8) {
                setError('Password must be at least 8 characters long');
                setPasswordError(true);
                setIsLoading(false);
                return;
            }
        }

        try {
            const endpoint = formType === 'login' ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/signup';
            const body = formType === 'login'
                ? { email: formData.email, password: formData.password, rememberMe }
                : { name: formData.name, email: formData.email, password: formData.password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong');
                if (formType === 'login' && data.error === 'Invalid credentials') {
                    setPasswordError(true);
                }
                setIsLoading(false);
                return;
            }

            setError(null);
            setPasswordError(false);
            if (formType === 'login' && data.token) {
                login(data.token, data.user);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                onClose();
                navigate('/login-success');
            } else if (formType === 'signup') {
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                onClose();
                navigate('/signup-success');
            }
        } catch (err: any) {
            if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                setError('Unable to connect to server. Please check your internet connection or try again later.');
            } else {
                setError('Error during request. Please try again.');
            }
            setPasswordError(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-60 flex min-h-screen items-center justify-center px-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => {
                                setFormType('login');
                                setError(null);
                                setPasswordError(false);
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                formType === 'login'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-blue-600'
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFormType('signup');
                                setError(null);
                                setPasswordError(false);
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                formType === 'signup'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-blue-600'
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Social Login Options */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                onClick={handleFacebookLogin}
                                disabled={isLoading}
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                Facebook
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                            </div>
                        </div>
                    </div>
                    {formType === 'signup' && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                disabled={isLoading}
                            />
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className={`w-full px-4 py-3 pr-12 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
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
                        
                        {formType === 'signup' && formData.password && (
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
                    
                    {formType === 'signup' && (
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
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
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    Passwords do not match
                                </p>
                            )}
                            {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                                <p className="text-green-500 text-xs mt-1 flex items-center">
                                    <CheckCircle size={14} className="mr-1" />
                                    Passwords match
                                </p>
                            )}
                        </div>
                    )}

                    {/* Remember Me for Login */}
                    {formType === 'login' && (
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                disabled={isLoading}
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                Remember me for 30 days
                            </label>
                        </div>
                    )}

                    {/* Terms and Conditions for Signup */}
                    {formType === 'signup' && (
                        <div className="flex items-start">
                            <input
                                id="agreeToTerms"
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                                disabled={isLoading}
                            />
                            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                                I agree to the{' '}
                                <a href="#" className="text-blue-600 hover:underline">
                                    Terms and Conditions
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-blue-600 hover:underline">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || (formType === 'signup' && !agreeToTerms)}
                        className={`w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-sky-600 hover:to-blue-700 font-medium transition-all duration-200 flex items-center justify-center ${
                            isLoading || (formType === 'signup' && !agreeToTerms) 
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
                                {formType === 'login' ? 'Signing in...' : 'Creating account...'}
                            </>
                        ) : (
                            formType === 'login' ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                            <AlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                            <div className="text-red-700 text-sm">
                                {error === 'Invalid credentials' && formType === 'login' ? (
                                    <>
                                        Invalid email or password. Need an account?{' '}
                                        <button
                                            type="button"
                                            className="text-blue-600 hover:underline font-medium"
                                            onClick={() => { 
                                                setFormType('signup'); 
                                                setError(null); 
                                                setPasswordError(false);
                                                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                                            }}
                                        >
                                            Sign up here
                                        </button>
                                    </>
                                ) : (
                                    error
                                )}
                            </div>
                        </div>
                    )}

                    {/* Forgot Password for Login */}
                    {formType === 'login' && (
                        <div className="text-center">
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:underline"
                                onClick={() => {
                                    if (formData.email) {
                                        handleForgotPassword();
                                    } else {
                                        setError('Please enter your email address first');
                                    }
                                }}
                            >
                                Forgot your password?
                            </button>
                        </div>
                    )}

                    {/* Form Type Switch */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            {formType === 'login' ? (
                                <>
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        className="text-blue-600 hover:underline font-medium"
                                        onClick={() => {
                                            setFormType('signup');
                                            setError(null);
                                            setPasswordError(false);
                                            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                                        }}
                                    >
                                        Sign up for free
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        className="text-blue-600 hover:underline font-medium"
                                        onClick={() => {
                                            setFormType('login');
                                            setError(null);
                                            setPasswordError(false);
                                            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                                        }}
                                    >
                                        Sign in here
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginSignupModal;