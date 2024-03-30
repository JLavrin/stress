const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    const numWorkers = 4; // Number of worker threads to spawn
    const totalIterations = 1000000; // Total iterations for heavy computation

    const start = Date.now();

    let completedWorkers = 0;
    let result = 0;

    for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker(__filename, {
            workerData: {
                start: i * (totalIterations / numWorkers),
                end: (i + 1) * (totalIterations / numWorkers),
            }
        });

        worker.on('message', (message) => {
            result += message;
            completedWorkers++;

            if (completedWorkers === numWorkers) {
                console.log(`Result: ${result}`);
                console.log(`Time taken: ${Date.now() - start}ms`);
            }
        });
    }
} else {
    const { start, end } = workerData;
    let partialResult = 0;

    for (let i = start; i < end; i++) {
        // Perform heavy computation (e.g., Fibonacci)
        partialResult += fibonacci(i);
    }

    parentPort.postMessage(partialResult);

    function fibonacci(n) {
        let a = 0, b = 1, temp;
        if (n === 0) return a;
        for (let i = 2; i <= n; i++) {
            temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }
}
