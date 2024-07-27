import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
    const [username, setUsername] = useState('');
    const [competitions, setCompetitions] = useState([]);
    const [newCompetition, setNewCompetition] = useState({ name: '', description: '' });
    const [view, setView] = useState('competitions'); // 'create', 'competitions', 'profile'
    const router = useRouter();
    const userId = 1; // Assume user ID is 1 for now

    useEffect(() => {
        async function fetchData() {
            const result = await axios.get(`/api/dashboard?userId=${userId}`);
            setUsername(result.data.username);
            setCompetitions(result.data.competitions);
        }
        fetchData();
    }, []);

    const handleCreateCompetition = async (event) => {
        event.preventDefault();
        const result = await axios.post('/api/competitions', { ...newCompetition, userId });
        setCompetitions([...competitions, { id: result.data.id, ...newCompetition }]);
        setNewCompetition({ name: '', description: '' });
        setView('competitions');
    };

    const handleJoinCompetition = async (competitionId) => {
        await axios.put('/api/competitions', { userId, competitionId });
        // Add additional logic to update the UI if needed
    };

    const handleLogout = () => {
        // Clear session or token and redirect to login page
        router.push('/login');
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.profile}>
                    <img src="/../../public/images/profile-placeholder.png" alt="Profile" className={styles.profileImage} />
                    <h3>{username}</h3>
                    <p>Test team 123</p>
                    <p>INR 2000</p>
                </div>
                <button className={styles.button} onClick={() => setView('profile')}>Profile</button>
                <button className={styles.button} onClick={() => setView('create')}>Create / Join</button>
                <button className={styles.button} onClick={() => setView('competitions')}>Competitions</button>
                <button className={styles.button} onClick={handleLogout}>Logout</button>
            </div>
            <div className={styles.main}>
                <div className={styles.header}>
                    <button className={styles.headerButton} onClick={() => router.push('/privacy-policy')}>Privacy Policy</button>
                    <button className={styles.headerButton} onClick={() => router.push('/racecards')}>Racecards</button>
                    <button className={styles.headerButton} onClick={() => router.push('/points-system')}>Points System</button>
                    <button className={styles.headerButton} onClick={() => router.push('/settings')}>Settings</button>
                </div>
                {view === 'profile' && <Profile />}
                {view === 'create' && (
                    <form onSubmit={handleCreateCompetition} className={styles.form}>
                        <h2>Create Competition</h2>
                        <div>
                            <label>Competition Name:</label>
                            <input type="text" value={newCompetition.name} onChange={(e) => setNewCompetition({ ...newCompetition, name: e.target.value })} required />
                        </div>
                        <div>
                            <label>Description:</label>
                            <input type="text" value={newCompetition.description} onChange={(e) => setNewCompetition({ ...newCompetition, description: e.target.value })} required />
                        </div>
                        <button type="submit">Create Competition</button>
                    </form>
                )}
                {view === 'competitions' && (
                    <div>
                        <h2>Join Competitions</h2>
                        <ul className={styles.competitionList}>
                            {competitions.map(competition => (
                                <li key={competition.id} className={styles.competitionCard}>
                                    <h3>{competition.name}</h3>
                                    <p>{competition.description}</p>
                                    <button onClick={() => handleJoinCompetition(competition.id)}>Join</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

function Profile() {
    return (
        <div>
            <h2>Profile Page</h2>
            {/* Add profile details and edit options here */}
        </div>
    );
}
