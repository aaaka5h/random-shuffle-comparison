// backend: index.js
const express = require("express");
const cors = require("cors");
const { performance } = require("perf_hooks");

const app = express();
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
);
app.use(express.json());

const DEFAULT_PORT = 8888;

function unbiasedBit() {
    return Math.random() < 0.5 ? 0 : 1;
}

function uniformInt(n) {
    return Math.floor(Math.random() * n);
}

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function fisherYatesShuffle(arr) {
    // TODO: Wait for piazza post, Idk if this is the right one
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function ballsBinsShuffle(C) {
    if (C.length <= 1) {
        return C;
    }

    const n = C.length;
    let L = Array.from({ length: n }, () => []);
    for (let c of C) {
        const X = uniformInt(n);
        L[X].push(c);
    }

    for (let i = 0; i < n; i++) {
        if (L[i].length > 1) {
            L[i] = ballsBinsShuffle(L[i]);
        }
    }

    return L.flat();
}

function binaryShuffle(C) {
    if (C.length <= 1) {
        return C;
    }

    let L = [];
    let R = [];
    for (const c of C) {
        const X = unbiasedBit();
        if (X === 1) {
            L.push(c);
        } else {
            R.push(c);
        }
    }

    return [...binaryShuffle(L), ...binaryShuffle(R)];
}

function measureTime(func, arr) {
    let start = performance.now();
    func(arr);
    return performance.now() - start;
}

app.post("/benchmark", (req, res) => {
    // attempt at making sure caching isn't dramatically speeding up the algorithm runtime on the following iterations
    res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    const { algo, n } = req.body;
    const arr = Array.from({ length: n }, (_, i) => i);
    console.log(`Executing ${algo} algorithm...`);

    let timeTaken;
    if (algo === "fisherYates") {
        timeTaken = measureTime(fisherYatesShuffle, arr);
    } else if (algo === "ballsBins") {
        timeTaken = measureTime(ballsBinsShuffle, arr);
    } else if (algo === "binary") {
        timeTaken = measureTime(binaryShuffle, arr);
    }

    res.json({ time: timeTaken.toFixed(2) });
});

app.listen(DEFAULT_PORT, () =>
    console.log(`Server running on port ${DEFAULT_PORT}`)
);
