import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/api/form', { username, email, password });
            router.push('/login');
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
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Sign Up</button>
            <button type="button" onClick={() => router.push('/login')}>Back</button> {/* Back button */}
        </form>
    );
}
