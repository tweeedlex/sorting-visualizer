import { useState, useEffect } from "react";

// Types
type SortingAlgorithm = "quick" | "heap" | "smooth" | "intro";
type ArrayElement = { value: number; isComparing: boolean; isSwapping: boolean };
type SortingStats = {
    comparisons: number;
    swaps: number;
    duration: number;
};

// Utility functions
const generateRandomArray = (size: number, min: number, max: number): ArrayElement[] => {
    return Array.from({ length: size }, () => ({
        value: Math.floor(Math.random() * (max - min + 1)) + min,
        isComparing: false,
        isSwapping: false,
    }));
};

// Sorting algorithms
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const quickSort = async (
    arr: ArrayElement[],
    setArray: React.Dispatch<React.SetStateAction<ArrayElement[]>>,
    setStats: React.Dispatch<React.SetStateAction<Record<SortingAlgorithm, SortingStats>>>,
    speed: number
) => {
    const stats = { comparisons: 0, swaps: 0, duration: 0 };
    const startTime = performance.now();
    const tempArray = [...arr];

    const partition = async (arr: ArrayElement[], low: number, high: number) => {
        const pivot = arr[high].value;
        let i = low - 1;

        for (let j = low; j < high; j++) {
            stats.comparisons++;

            // Highlight elements being compared
            arr[j].isComparing = true;
            arr[high].isComparing = true;
            setArray([...arr]);
            await sleep(speed);

            if (arr[j].value < pivot) {
                i++;

                // Highlight elements being swapped
                arr[i].isSwapping = true;
                arr[j].isSwapping = true;
                setArray([...arr]);
                await sleep(speed);

                // Swap
                [arr[i], arr[j]] = [arr[j], arr[i]];
                stats.swaps++;

                setArray([...arr]);
                await sleep(speed);

                // Reset highlighting
                arr[i].isSwapping = false;
                arr[j].isSwapping = false;
            }

            // Reset comparison highlighting
            arr[j].isComparing = false;
            arr[high].isComparing = false;
        }

        // Swap pivot
        i++;
        arr[i].isSwapping = true;
        arr[high].isSwapping = true;
        setArray([...arr]);
        await sleep(speed);

        [arr[i], arr[high]] = [arr[high], arr[i]];
        stats.swaps++;

        setArray([...arr]);
        await sleep(speed);

        arr[i].isSwapping = false;
        arr[high].isSwapping = false;

        return i;
    };

    const quickSortHelper = async (arr: ArrayElement[], low: number, high: number) => {
        if (low < high) {
            const pivotIndex = await partition(arr, low, high);
            await quickSortHelper(arr, low, pivotIndex - 1);
            await quickSortHelper(arr, pivotIndex + 1, high);
        }
    };

    await quickSortHelper(tempArray, 0, tempArray.length - 1);

    stats.duration = performance.now() - startTime;
    setStats(prev => ({ ...prev, quick: stats }));

    return tempArray;
};

const heapSort = async (
    arr: ArrayElement[],
    setArray: React.Dispatch<React.SetStateAction<ArrayElement[]>>,
    setStats: React.Dispatch<React.SetStateAction<Record<SortingAlgorithm, SortingStats>>>,
    speed: number
) => {
    const stats = { comparisons: 0, swaps: 0, duration: 0 };
    const startTime = performance.now();
    const tempArray = [...arr];

    const heapify = async (arr: ArrayElement[], n: number, i: number) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n) {
            stats.comparisons++;
            arr[left].isComparing = true;
            arr[largest].isComparing = true;
            setArray([...arr]);
            await sleep(speed);

            if (arr[left].value > arr[largest].value) {
                largest = left;
            }

            arr[left].isComparing = false;
            arr[largest].isComparing = false;
        }

        if (right < n) {
            stats.comparisons++;
            arr[right].isComparing = true;
            arr[largest].isComparing = true;
            setArray([...arr]);
            await sleep(speed);

            if (arr[right].value > arr[largest].value) {
                largest = right;
            }

            arr[right].isComparing = false;
            arr[largest].isComparing = false;
        }

        if (largest !== i) {
            arr[i].isSwapping = true;
            arr[largest].isSwapping = true;
            setArray([...arr]);
            await sleep(speed);

            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            stats.swaps++;

            setArray([...arr]);
            await sleep(speed);

            arr[i].isSwapping = false;
            arr[largest].isSwapping = false;

            await heapify(arr, n, largest);
        }
    };

    // Build max heap
    for (let i = Math.floor(tempArray.length / 2) - 1; i >= 0; i--) {
        await heapify(tempArray, tempArray.length, i);
    }

    // Extract elements from heap one by one
    for (let i = tempArray.length - 1; i > 0; i--) {
        tempArray[0].isSwapping = true;
        tempArray[i].isSwapping = true;
        setArray([...tempArray]);
        await sleep(speed);

        [tempArray[0], tempArray[i]] = [tempArray[i], tempArray[0]];
        stats.swaps++;

        setArray([...tempArray]);
        await sleep(speed);

        tempArray[0].isSwapping = false;
        tempArray[i].isSwapping = false;

        await heapify(tempArray, i, 0);
    }

    stats.duration = performance.now() - startTime;
    setStats(prev => ({ ...prev, heap: stats }));

    return tempArray;
};

const smoothSort = async (
    arr: ArrayElement[],
    setArray: React.Dispatch<React.SetStateAction<ArrayElement[]>>,
    setStats: React.Dispatch<React.SetStateAction<Record<SortingAlgorithm, SortingStats>>>,
    speed: number
) => {
    const stats = { comparisons: 0, swaps: 0, duration: 0 };
    const startTime = performance.now();
    const tempArray = [...arr];

    // Leonardo numbers
    const LP = [1, 1];
    for (let i = 2; i < 45; i++) {
        LP[i] = LP[i - 1] + LP[i - 2] + 1;
    }

    const sift = async (arr: ArrayElement[], pshift: number, head: number) => {
        const val = arr[head];

        while (pshift > 1) {
            const rt = head - 1;
            const lf = head - 1 - LP[pshift - 2];

            arr[head].isComparing = true;
            arr[lf].isComparing = true;
            setArray([...arr]);
            await sleep(speed);
            stats.comparisons++;

            if (val.value >= arr[lf].value) {
                arr[rt].isComparing = true;
                setArray([...arr]);
                await sleep(speed);
                stats.comparisons++;

                if (val.value >= arr[rt].value) {
                    break;
                }

                arr[head].isSwapping = true;
                arr[rt].isSwapping = true;
                setArray([...arr]);
                await sleep(speed);

                arr[head] = arr[rt];
                head = rt;
                pshift -= 1;
                stats.swaps++;

                arr[head].isSwapping = false;
                arr[rt].isSwapping = false;
            } else {
                arr[head].isSwapping = true;
                arr[lf].isSwapping = true;
                setArray([...arr]);
                await sleep(speed);

                arr[head] = arr[lf];
                head = lf;
                pshift -= 2;
                stats.swaps++;

                arr[head].isSwapping = false;
                arr[lf].isSwapping = false;
            }

            arr[head].isComparing = false;
            arr[lf].isComparing = false;
            if (rt < arr.length) arr[rt].isComparing = false;
        }

        arr[head] = val;
    };

    const trinkle = async (arr: ArrayElement[], p: number, pshift: number, head: number, isTrusty: boolean) => {
        const val = arr[head];

        while (p !== 1) {
            let stepson = head - LP[pshift];

            arr[head].isComparing = true;
            arr[stepson].isComparing = true;
            setArray([...arr]);
            await sleep(speed);
            stats.comparisons++;

            if (arr[stepson].value <= val.value) {
                break;
            }

            if (!isTrusty && pshift > 1) {
                const rt = head - 1;
                const lf = head - 1 - LP[pshift - 2];

                arr[rt].isComparing = true;
                setArray([...arr]);
                await sleep(speed);
                stats.comparisons++;

                if (arr[rt].value > arr[stepson].value) {
                    stepson = rt;
                }

                arr[lf].isComparing = true;
                setArray([...arr]);
                await sleep(speed);
                stats.comparisons++;

                if (arr[lf].value > arr[stepson].value) {
                    stepson = lf;
                }

                arr[rt].isComparing = false;
                arr[lf].isComparing = false;
            }

            arr[head].isSwapping = true;
            arr[stepson].isSwapping = true;
            setArray([...arr]);
            await sleep(speed);

            arr[head] = arr[stepson];
            head = stepson;
            stats.swaps++;

            arr[head].isSwapping = false;
            arr[stepson].isSwapping = false;

            arr[head].isComparing = false;
            arr[stepson].isComparing = false;

            // Handle binary representation of p
            const trail = Number(p & ~(p - 1)).toString(2).length - 1;
            p &= p - 1;
            pshift = trail;
            isTrusty = false;
        }

        if (!isTrusty) {
            arr[head] = val;
        }
    };

    const smoothSortHelper = async (arr: ArrayElement[]) => {
        let p = 1;
        let pshift = 1;

        for (let i = 1; i < arr.length; i++) {
            if ((p & 0x7) === 3) {
                await sift(arr, pshift, i - 1);
                p >>>= 2;
                pshift += 2;
            } else if ((p & 0x3) === 1) {
                if (i + 1 < arr.length) {
                    await sift(arr, pshift, i - 1);
                } else {
                    await trinkle(arr, p, pshift, i - 1, false);
                }

                p = (p >>> 1) ^ 0x1;
                pshift--;
            } else {
                p <<= 1;
                pshift--;
            }
        }

        for (let i = arr.length - 1; i > 0; i--) {
            if (p === 1) {
                await trinkle(arr, p, pshift, i, false);
            } else {
                await trinkle(arr, p, pshift, i, true);

                // Handle binary representation of p
                const trail = Number(p & ~(p - 1)).toString(2).length - 1;
                p &= p - 1;
                pshift = trail;
            }
        }
    };

    await smoothSortHelper(tempArray);

    stats.duration = performance.now() - startTime;
    setStats(prev => ({ ...prev, smooth: stats }));

    return tempArray;
};

const introSort = async (
    arr: ArrayElement[],
    setArray: React.Dispatch<React.SetStateAction<ArrayElement[]>>,
    setStats: React.Dispatch<React.SetStateAction<Record<SortingAlgorithm, SortingStats>>>,
    speed: number
) => {
    const stats = { comparisons: 0, swaps: 0, duration: 0 };
    const startTime = performance.now();
    const tempArray = [...arr];

    const insertionSort = async (arr: ArrayElement[], left: number, right: number) => {
        for (let i = left + 1; i <= right; i++) {
            let j = i;
            while (j > left) {
                arr[j].isComparing = true;
                arr[j - 1].isComparing = true;
                setArray([...arr]);
                await sleep(speed);
                stats.comparisons++;

                if (arr[j].value < arr[j - 1].value) {
                    arr[j].isSwapping = true;
                    arr[j - 1].isSwapping = true;
                    setArray([...arr]);
                    await sleep(speed);

                    [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
                    stats.swaps++;

                    setArray([...arr]);
                    await sleep(speed);

                    arr[j].isSwapping = false;
                    arr[j - 1].isSwapping = false;
                } else {
                    break;
                }

                arr[j].isComparing = false;
                arr[j - 1].isComparing = false;
                j--;
            }
        }
    };

    const heapify = async (arr: ArrayElement[], n: number, i: number) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n) {
            stats.comparisons++;
            arr[left].isComparing = true;
            arr[largest].isComparing = true;
            setArray([...arr]);
            await sleep(speed);

            if (arr[left].value > arr[largest].value) {
                largest = left;
            }

            arr[left].isComparing = false;
            arr[largest].isComparing = false;
        }

        if (right < n) {
            stats.comparisons++;
            arr[right].isComparing = true;
            arr[largest].isComparing = true;
            setArray([...arr]);
            await sleep(speed);

            if (arr[right].value > arr[largest].value) {
                largest = right;
            }

            arr[right].isComparing = false;
            arr[largest].isComparing = false;
        }

        if (largest !== i) {
            arr[i].isSwapping = true;
            arr[largest].isSwapping = true;
            setArray([...arr]);
            await sleep(speed);

            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            stats.swaps++;

            setArray([...arr]);
            await sleep(speed);

            arr[i].isSwapping = false;
            arr[largest].isSwapping = false;

            await heapify(arr, n, largest);
        }
    };

    const heapSortHelper = async (arr: ArrayElement[], start: number, end: number) => {
        // Build max heap
        for (let i = Math.floor((end - start + 1) / 2) - 1 + start; i >= start; i--) {
            await heapify(arr, end + 1, i);
        }

        // Extract elements from heap one by one
        for (let i = end; i > start; i--) {
            arr[start].isSwapping = true;
            arr[i].isSwapping = true;
            setArray([...arr]);
            await sleep(speed);

            [arr[start], arr[i]] = [arr[i], arr[start]];
            stats.swaps++;

            setArray([...arr]);
            await sleep(speed);

            arr[start].isSwapping = false;
            arr[i].isSwapping = false;

            await heapify(arr, i, start);
        }
    };

    const partition = async (arr: ArrayElement[], low: number, high: number) => {
        const pivot = arr[high].value;
        let i = low - 1;

        for (let j = low; j < high; j++) {
            stats.comparisons++;
            arr[j].isComparing = true;
            arr[high].isComparing = true;
            setArray([...arr]);
            await sleep(speed);

            if (arr[j].value <= pivot) {
                i++;

                arr[i].isSwapping = true;
                arr[j].isSwapping = true;
                setArray([...arr]);
                await sleep(speed);

                [arr[i], arr[j]] = [arr[j], arr[i]];
                stats.swaps++;

                setArray([...arr]);
                await sleep(speed);

                arr[i].isSwapping = false;
                arr[j].isSwapping = false;
            }

            arr[j].isComparing = false;
            arr[high].isComparing = false;
        }

        i++;
        arr[i].isSwapping = true;
        arr[high].isSwapping = true;
        setArray([...arr]);
        await sleep(speed);

        [arr[i], arr[high]] = [arr[high], arr[i]];
        stats.swaps++;

        setArray([...arr]);
        await sleep(speed);

        arr[i].isSwapping = false;
        arr[high].isSwapping = false;

        return i;
    };

    const introSortHelper = async (arr: ArrayElement[], start: number, end: number, depthLimit: number) => {
        if (start < end) {
            // If the array size is small, use insertion sort
            if (end - start < 16) {
                await insertionSort(arr, start, end);
                return;
            }

            // If depth limit is zero, use heap sort
            if (depthLimit === 0) {
                await heapSortHelper(arr, start, end);
                return;
            }

            const pivot = await partition(arr, start, end);

            // Recursively sort the left and right sub-arrays
            await introSortHelper(arr, start, pivot - 1, depthLimit - 1);
            await introSortHelper(arr, pivot + 1, end, depthLimit - 1);
        }
    };

    // Calculate the maximum depth limit
    const depthLimit = 2 * Math.floor(Math.log(tempArray.length) / Math.log(2));

    await introSortHelper(tempArray, 0, tempArray.length - 1, depthLimit);

    stats.duration = performance.now() - startTime;
    setStats(prev => ({ ...prev, intro: stats }));

    return tempArray;
};

// Download helper function
const downloadArrayData = (
    originalArray: ArrayElement[],
    sortedArray: ArrayElement[],
    algorithm: string,
    stats: SortingStats
) => {
    const originalValues = originalArray.map(item => item.value);
    const sortedValues = sortedArray.map(item => item.value);

    const content = {
        algorithm,
        originalArray: originalValues,
        sortedArray: sortedValues,
        statistics: {
            comparisons: stats.comparisons,
            swaps: stats.swaps,
            duration: `${stats.duration.toFixed(2)}ms`,
        },
    };

    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${algorithm}-sort-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Main component
export default function SortingVisualizer() {
    const [array, setArray] = useState<ArrayElement[]>([]);
    const [originalArray, setOriginalArray] = useState<ArrayElement[]>([]);
    const [arraySize, setArraySize] = useState<number>(30);
    const [minValue, setMinValue] = useState<number>(5);
    const [maxValue, setMaxValue] = useState<number>(100);
    const [sortingSpeed, setSortingSpeed] = useState<number>(50);
    const [isSorting, setIsSorting] = useState<boolean>(false);
    const [currentAlgorithm, setCurrentAlgorithm] = useState<SortingAlgorithm | null>(null);
    const [stats, setStats] = useState<Record<SortingAlgorithm, SortingStats>>({
        quick: { comparisons: 0, swaps: 0, duration: 0 },
        heap: { comparisons: 0, swaps: 0, duration: 0 },
        smooth: { comparisons: 0, swaps: 0, duration: 0 },
        intro: { comparisons: 0, swaps: 0, duration: 0 },
    });

    // Function to generate a new array
    const generateArray = () => {
        if (isSorting) return;

        const newArray = generateRandomArray(arraySize, minValue, maxValue);
        setArray(newArray);
        setOriginalArray([...newArray]);
        setCurrentAlgorithm(null);
    };

    // Function to start sorting
    const startSorting = async (algorithm: SortingAlgorithm) => {
        if (isSorting) return;

        setIsSorting(true);
        setCurrentAlgorithm(algorithm);

        let sortedArray: ArrayElement[] = [];

        // Restore the original array before sorting
        setArray([...originalArray]);

        // Apply the selected sorting algorithm
        switch (algorithm) {
            case "quick":
                sortedArray = await quickSort([...originalArray], setArray, setStats, sortingSpeed);
                break;
            case "heap":
                sortedArray = await heapSort([...originalArray], setArray, setStats, sortingSpeed);
                break;
            case "smooth":
                sortedArray = await smoothSort([...originalArray], setArray, setStats, sortingSpeed);
                break;
            case "intro":
                sortedArray = await introSort([...originalArray], setArray, setStats, sortingSpeed);
                break;
        }

        // Reset all visual states
        const finalArray = sortedArray.map(item => ({
            ...item,
            isComparing: false,
            isSwapping: false,
        }));

        setArray(finalArray);
        setIsSorting(false);
    };

    // Generate initial array on component mount
    useEffect(() => {
        generateArray();
    }, []);

    // Calculate the maximum value for visualization
    const maxArrayValue = Math.max(...array.map(item => item.value));

    return (
        <div className="flex flex-col w-full max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Sorting Algorithm Visualizer</h1>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex flex-col gap-2">
                    <label className="font-medium">Array Size</label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={arraySize}
                        onChange={(e) => !isSorting && setArraySize(Number(e.target.value))}
                        disabled={isSorting}
                        className="w-full"
                    />
                    <span className="text-sm">{arraySize}</span>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium">Min Value</label>
                    <input
                        type="number"
                        min="1"
                        max={maxValue - 1}
                        value={minValue}
                        onChange={(e) => !isSorting && setMinValue(Number(e.target.value))}
                        disabled={isSorting}
                        className="w-24 p-1 border rounded"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium">Max Value</label>
                    <input
                        type="number"
                        min={minValue + 1}
                        max="1000"
                        value={maxValue}
                        onChange={(e) => !isSorting && setMaxValue(Number(e.target.value))}
                        disabled={isSorting}
                        className="w-24 p-1 border rounded"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium">Sorting Speed</label>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={sortingSpeed}
                        onChange={(e) => setSortingSpeed(101 - Number(e.target.value))}
                        className="w-full"
                    />
                    <span className="text-sm">{sortingSpeed}%</span>
                </div>

                <div className="flex flex-col gap-2 ml-auto">
                    <button
                        onClick={generateArray}
                        disabled={isSorting}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        Generate New Array
                    </button>
                </div>
            </div>

            {/* Array Visualization */}
            <div className="h-64 flex items-end gap-1 mb-8 border-b-2 border-gray-300 pb-2">
                {array.map((element, index) => (
                    <div
                        key={index}
                        className={`w-full ${
                            element.isComparing
                                ? "bg-yellow-400"
                                : element.isSwapping
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                        } transition-all duration-100`}
                        style={{
                            height: `${(element.value / maxArrayValue) * 100}%`,
                        }}
                    ></div>
                ))}
            </div>

            {/* Algorithm Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
                <button
                    onClick={() => startSorting("quick")}
                    disabled={isSorting}
                    className={`px-4 py-2 rounded ${
                        currentAlgorithm === "quick"
                            ? "bg-green-500 text-white"
                            : "bg-gray-600 hover:bg-gray-500"
                    } disabled:bg-gray-400`}
                >
                    Quick Sort
                </button>

                <button
                    onClick={() => startSorting("heap")}
                    disabled={isSorting}
                    className={`px-4 py-2 rounded ${
                        currentAlgorithm === "heap"
                            ? "bg-green-500 text-white"
                            : "bg-gray-600 hover:bg-gray-500"
                    } disabled:bg-gray-400`}
                >
                    Heap Sort
                </button>

                <button
                    onClick={() => startSorting("smooth")}
                    disabled={isSorting}
                    className={`px-4 py-2 rounded ${
                        currentAlgorithm === "smooth"
                            ? "bg-green-500 text-white"
                            : "bg-gray-600 hover:bg-gray-500"
                    } disabled:bg-gray-400`}
                >
                    Smooth Sort
                </button>

                <button
                    onClick={() => startSorting("intro")}
                    disabled={isSorting}
                    className={`px-4 py-2 rounded ${
                        currentAlgorithm === "intro"
                            ? "bg-green-500 text-white"
                            : "bg-gray-600 hover:bg-gray-500"
                    } disabled:bg-gray-400`}
                >
                    Introspective Sort
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {(["quick", "heap", "smooth", "intro"] as SortingAlgorithm[]).map((algo) => (
                    <div
                        key={algo}
                        className={`p-4 border rounded ${
                            currentAlgorithm === algo ? "border-green-500" : "border-gray-300"
                        }`}
                    >
                        <h3 className="font-bold text-lg mb-2">
                            {algo === "quick"
                                ? "Quick Sort"
                                : algo === "heap"
                                    ? "Heap Sort"
                                    : algo === "smooth"
                                        ? "Smooth Sort"
                                        : "Introspective Sort"}
                        </h3>
                        <div className="flex flex-col gap-1">
                            <p>Comparisons: {stats[algo].comparisons}</p>
                            <p>Swaps: {stats[algo].swaps}</p>
                            <p>Duration: {stats[algo].duration.toFixed(2)} ms</p>

                            {stats[algo].comparisons > 0 && (
                                <button
                                    onClick={() => downloadArrayData(originalArray, array, algo, stats[algo])}
                                    className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                >
                                    Save Results
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500"></div>
                    <span>Unsorted</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400"></div>
                    <span>Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500"></div>
                    <span>Swapping</span>
                </div>
            </div>

            {/* Algorithm descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded">
                    <h3 className="font-bold text-lg mb-2">Quick Sort</h3>
                    <p className="text-sm">
                        A divide-and-conquer algorithm that picks an element as a pivot and partitions the array around it.
                        Average time complexity: O(n log n).
                    </p>
                </div>

                <div className="p-4 border rounded">
                    <h3 className="font-bold text-lg mb-2">Heap Sort</h3>
                    <p className="text-sm">
                        Uses a binary heap data structure to sort elements. It first builds a max heap,
                        then repeatedly extracts the maximum element. Time complexity: O(n log n).
                    </p>
                </div>

                <div className="p-4 border rounded">
                    <h3 className="font-bold text-lg mb-2">Smooth Sort</h3>
                    <p className="text-sm">
                        An adaptive sorting algorithm based on Leonardo numbers. It's a variation of heapsort
                        that takes advantage of existing order in the input. Best case: O(n).
                    </p>
                </div>

                <div className="p-4 border rounded">
                    <h3 className="font-bold text-lg mb-2">Introspective Sort</h3>
                    <p className="text-sm">
                        A hybrid sorting algorithm that combines quicksort, heapsort, and insertion sort.
                        It begins with quicksort and switches to heapsort when the recursion depth exceeds a level.
                    </p>
                </div>
            </div>
        </div>
    );
}