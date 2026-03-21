/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import "./App.css";
import axios from "axios";

function App() {
  const [value, setValue] = useState("Hey Siri, call dad");

  async function getAll() {
    const promise = axios.get("/api/hello");
    const result = (await promise).data;
    console.log("res", result);
    setTimeout(() => {
      setValue(() => "ok, lets play the Beatles");
    }, 1500);
  }

  useEffect(() => {
    getAll();
  }, []);

  return <div>{value}</div>;
}

export default App;
