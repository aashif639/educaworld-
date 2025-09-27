
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon } from './Icons';

const Login: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
    const { login, loading } = useAuth();

    const handleLogin = () => {
        login();
        onLoginSuccess();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50">
            <div className="p-10 bg-white rounded-xl shadow-lg text-center max-w-md w-full">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Access</h2>
                <p className="text-gray-600 mb-8">Please sign in to manage the platform.</p>
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-75 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {loading ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                        </>
                    ) : (
                        <>
                            <GoogleIcon className="w-6 h-6 mr-3" />
                            Sign in with Google
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Login;
