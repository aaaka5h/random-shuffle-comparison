import React, { useState } from "react";
import axios from "axios";

const RunAlgoSection = ({ algo, name, n }) => {
    const DEFAULT_PORT = 8888;
    const BACKEND_ENDPOINT = `http://localhost:${DEFAULT_PORT}/benchmark`;
    const EXAMPLE_RESULT = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * n)
    );
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const runShuffleAlgo = async () => {
        setLoading(true);
        try {
            const response = await axios.post(BACKEND_ENDPOINT, {
                algo,
                n,
            });
            setResults(response.data);
        } catch (e) {
            console.error(`Error running ${algo} algorithm: `, e);
            setResults({ timeTaken: 0 });
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>{name}</h2>
            <button onClick={runShuffleAlgo}>Run Benchmark</button>
            {results && (
                <div>
                    <h4>Results:</h4>
                    <div>
                        <p>Time Taken: {results.time}ms</p>
                        <p>{EXAMPLE_RESULT.toString()}...</p>
                    </div>
                </div>
            )}
            {loading && (
                <div>
                    <p>Loading...</p>
                </div>
            )}
        </div>
    );
};

export default RunAlgoSection;
