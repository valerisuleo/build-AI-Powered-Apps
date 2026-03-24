import { useEffect, useState } from 'react';

import './App.css';
import axios from 'axios';
import { Button } from './components/ui/button';
import Home from './pages/home';

function App() {
    // const [message, setMessage] = useState('Hey Siri, call dad');
    // async function getAll() {
    //     const promise = axios.get('/api/hello');
    //     const response = (await promise).data;
    //     console.log('res', response);
    //     setTimeout(() => {
    //         setMessage(() => response['message']);
    //     }, 1500);
    // }
    // useEffect(() => {
    //     getAll();
    // }, []);
    // return (
    //     <div className="p-4">
    //         <p className="font-bold text-3xl">{message}</p>
    //         <Button>Click me</Button>
    //     </div>
    // );
    return (
        <div className="p-4">
            <Home></Home>
        </div>
    );
}

export default App;
