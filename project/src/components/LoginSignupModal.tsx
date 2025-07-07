import React, { useState } from 'react';

interface Props {
    show: boolean;
    onClose: () => void;
}

const LoginSignupModal: React.FC<Props> = ({ show, onClose }) => {
    const [formType, setFormType] = useState<'login' | 'signup'>('login');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formType === 'signup' && formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const endpoint = formType === 'login' ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/signup';
            const body = formType === 'login'
                ? { email: formData.email, password: formData.password }
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
                alert(data.error || 'Something went wrong');
                return;
            }

            if (formType === 'login' && data.token) {
                localStorage.setItem('token', data.token);
            }

            alert(`${formType === 'login' ? 'Login' : 'Signup'} successful!`);
            onClose();
        } catch (err) {
            alert('Error during request. Please try again.');
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
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-blue-600">
                        {formType === 'login' ? 'Login' : 'Sign Up'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-red-500 text-2xl font-bold"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {formType === 'signup' && (
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formType === 'signup' && (
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-sky-600 hover:to-blue-700 font-medium"
                    >
                        {formType === 'login' ? 'Login' : 'Create Account'}
                    </button>

                    <p className="text-sm text-center text-gray-600">
                        {formType === 'login' ? (
                            <>
                                Don't have an account?{' '}
                                <span
                                    className="text-blue-600 cursor-pointer hover:underline"
                                    onClick={() => setFormType('signup')}
                                >
                                    Sign up
                                </span>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <span
                                    className="text-blue-600 cursor-pointer hover:underline"
                                    onClick={() => setFormType('login')}
                                >
                                    Login
                                </span>
                            </>
                        )}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginSignupModal;