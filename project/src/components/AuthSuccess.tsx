import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const [debugInfo, setDebugInfo] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const processedRef = useRef(false);

    useEffect(() => {
        // Prevent multiple executions
        if (processedRef.current || isProcessing) {
            return;
        }

        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        // Debug information
        console.log('AuthSuccess - token:', token);
        console.log('AuthSuccess - userParam:', userParam);
        console.log('AuthSuccess - full URL:', window.location.href);
        setDebugInfo(`Token: ${token ? 'Present' : 'Missing'}, User: ${userParam ? 'Present' : 'Missing'}`);

        if (token && userParam) {
            setIsProcessing(true);
            processedRef.current = true;

            try {
                const user = JSON.parse(decodeURIComponent(userParam));
                console.log('AuthSuccess - parsed user:', user);
                
                // Store the token and user data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                // Update auth context
                login(token, user);
                
                console.log('AuthSuccess - login completed, redirecting...');
                
                // Show success message and redirect
                setTimeout(() => {
                    navigate('/', { 
                        replace: true,
                        state: { 
                            message: `Welcome back, ${user.name}! You have successfully signed in.`,
                            type: 'success'
                        }
                    });
                }, 2000);
                
            } catch (error) {
                console.error('Error parsing OAuth response:', error);
                setDebugInfo(`Error parsing user data: ${error}`);
                processedRef.current = true;
                setTimeout(() => {
                    navigate('/', { 
                        replace: true,
                        state: { 
                            message: 'Authentication failed. Please try again.',
                            type: 'error'
                        }
                    });
                }, 3000);
            }
        } else {
            // If no token/user data, we might already be on home page after redirect
            console.log('AuthSuccess - missing token or user data, checking if already logged in');
            const existingToken = localStorage.getItem('token');
            const existingUser = localStorage.getItem('user');
            
            if (existingToken && existingUser) {
                // User is already logged in, redirect immediately
                console.log('AuthSuccess - user already logged in, redirecting home');
                processedRef.current = true;
                navigate('/', { replace: true });
            } else {
                // No auth data at all
                setDebugInfo('Missing token or user data in URL');
                processedRef.current = true;
                setTimeout(() => {
                    navigate('/', { 
                        replace: true,
                        state: { 
                            message: 'Authentication failed. Please try again.',
                            type: 'error'
                        }
                    });
                }, 3000);
            }
        }
    }, [searchParams, navigate, login, isProcessing]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full mx-auto">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <h2 className="mt-4 text-xl font-semibold text-gray-900">
                            Completing Sign In...
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Please wait while we finalize your authentication.
                        </p>
                        {import.meta.env.DEV && (
                            <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
                                Debug: {debugInfo}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthSuccess;
