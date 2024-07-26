import { useEffect, useState } from 'react'; // Importing useEffect and useState hooks from React.
import axios from 'axios'; // Importing Axios for making HTTP requests.

export default function Dashboard() {
    const [users, setUsers] = useState([]); // Creating a state variable 'users' with an initial value of an empty array.

    useEffect(() => {
        // Defining an asynchronous function to fetch data from the server.
        async function fetchData() {
            const result = await axios.get('/api/dashboard'); // Sending a GET request to the '/api/dashboard' endpoint.
            setUsers(result.data); // Updating the 'users' state with the retrieved data.
        }
        fetchData(); // Calling the fetchData function when the component mounts.
    }, []); // The empty dependency array ensures this effect runs only once when the component mounts.

    return (
        <div>
            <h1>Dashboard</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.username} ({user.email})</li> // Rendering a list item for each user.
                ))}
            </ul>
        </div>
    );
}
