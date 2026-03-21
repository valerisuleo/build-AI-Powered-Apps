/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';

import './App.css';
import axios from 'axios';

function App() {
    const [value, setValue] = useState('Hey Siri, call dad');

    async function getAll() {
        const promise = axios.get('/api/hello');
        const response = (await promise).data;
        console.log('res', response);
        setTimeout(() => {
            setValue(() => response['message']);
        }, 1500);
    }

    useEffect(() => {
        getAll();
    }, []);

    return <p className="font-bold p-4 text-3xl">{value}</p>;
}

export default App;
