import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/api/login', { email, password });
            router.push('/dashboard');
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Login</button>
            <p>
                Don't have an account? <a href="/signup">Sign Up</a>
            </p>
            <p>
                Forgot your password? <a href="/forgot-password">Reset Password</a>
            </p>
        </form>
    );
}
