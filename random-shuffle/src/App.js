// frontend: App.js
import React, { useState } from "react";

import "./App.css";
import RunAlgoSection from "./components/RunAlgoSection";

export class RandomShuffleAlgos {
    static #_fisherYates = "fisherYates";
    static #_ballsBins = "ballsBins";
    static #_binary = "binary";

    static get FISHER_YATES() {
        return this.#_fisherYates;
    }
    static get BALLS_BINS() {
        return this.#_ballsBins;
    }
    static get BINARY() {
        return this.#_binary;
    }
}

function App() {
    const N_DEFAULT = 10000;
    const [n, setN] = useState(N_DEFAULT);

    return (
        <div className="App">
            <h1>Shuffling Algorithms Runtime Comparison</h1>
            <label>
                <b>{`Array Size: `}</b>
                <select
                    value={n}
                    onChange={(e) => setN(Number(e.target.value))}
                >
                    <option value={10000}>10⁴</option>
                    <option value={1000000}>10⁶</option>
                    <option value={10000000}>10⁸</option>
                </select>
            </label>
            <div className="App-content">
                <RunAlgoSection
                    algo={RandomShuffleAlgos.BALLS_BINS}
                    name={"BallsBinsShuffle"}
                    n={n}
                />
                <RunAlgoSection
                    algo={RandomShuffleAlgos.BINARY}
                    name={"BinaryShuffle"}
                    n={n}
                />
                <RunAlgoSection
                    algo={RandomShuffleAlgos.FISHER_YATES}
                    name={"FisherYates"}
                    n={n}
                />
            </div>
        </div>
    );
}

export default App;
