import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { token } = router.query;

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/api/reset-password', { token, password });
            setMessage('Your password has been reset successfully.');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
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
                <label>New Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Reset Password</button>
        </form>
    );
}
