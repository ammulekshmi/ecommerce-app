// resources/js/components/Auth/Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await axios.post('/api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            }, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
            });
            setSuccess('Registration successful!');
            console.log(response.data);
        } catch (err) {
            setError('Registration failed. Please check your input.');
            console.error('Registration error:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div className="card">
            <div className="card-header">Register</div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <div className="mb-3">
                        <label htmlFor="nameInput" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nameInput"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                    <div className="mb-3">
                        <label htmlFor="passwordConfirmationInput" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="passwordConfirmationInput"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;