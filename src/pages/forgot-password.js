import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/api/forgot-password', { email });
            setMessage('If this email is registered, you will receive a password reset link.');
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
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Reset Password</button>
            <button type="button" onClick={() => router.push('/login')}>Back</button> {/* Back button */}
        </form>
    );
}
