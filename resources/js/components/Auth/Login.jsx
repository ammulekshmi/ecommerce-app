// resources/js/components/Login.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [feedback, setFeedback] = useState('');
    const { login, isAuthenticated, authLoading } = useContext(AuthContext); // Use login from context
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate('/'); // Redirect to home or dashboard
        }
    }, [isAuthenticated, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback('');

        const result = await login({ email, password });

        if (result.success) {
            setFeedback({ type: 'success', message: result.message });
            // The useEffect will handle navigation
        } else {
            setFeedback({ type: 'error', message: result.message });
        }
    };

    if (authLoading || isAuthenticated) {
        return <div className="text-center mt-5">Loading...</div>; // Or a spinner
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">Login</div>
                        <div className="card-body">
                            {feedback.message && (
                                <div className={`alert alert-${feedback.type === 'success' ? 'success' : 'danger'}`}>
                                    {feedback.message}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="emailInput" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="emailInput"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="passwordInput" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="passwordInput"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={authLoading}>
                                    {authLoading ? 'Logging in...' : 'Login'}
                                </button>
                                <p className="mt-3">
                                    Don't have an account? <Link to="/register">Register here</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;