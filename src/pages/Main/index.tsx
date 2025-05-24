import { useState, useEffect } from "react";
import SortingAlgorithmFactory, { ArrayElement, SortingStats } from "./algorithms";

const generateRandomArray = (size: number, min: number, max: number): ArrayElement[] => {
    return Array.from({ length: size }, () => ({
        value: Math.floor(Math.random() * (max - min + 1)) + min,
        isComparing: false,
        isSwapping: false,
    }));
};

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

export default function SortingVisualizer() {
    const [array, setArray] = useState<ArrayElement[]>([]);
    const [originalArray, setOriginalArray] = useState<ArrayElement[]>([]);
    const [arraySize, setArraySize] = useState<number>(30);
    const [minValue, setMinValue] = useState<number>(5);
    const [maxValue, setMaxValue] = useState<number>(100);
    const [sortingSpeed, setSortingSpeed] = useState<number>(80);
    const [isSorting, setIsSorting] = useState<boolean>(false);
    const [currentAlgorithm, setCurrentAlgorithm] = useState<string | null>(null);
    const [stats, setStats] = useState<Record<string, SortingStats>>({
        quick: { comparisons: 0, swaps: 0, duration: 0 },
        heap: { comparisons: 0, swaps: 0, duration: 0 },
        smooth: { comparisons: 0, swaps: 0, duration: 0 },
        intro: { comparisons: 0, swaps: 0, duration: 0 },
    });

    const getActualSpeed = () => Math.max(10, 110 - sortingSpeed);

    const validateValues = () => {
        if (minValue >= maxValue) {
            alert("Min value has to be less than max value");
            return false;
        }
        if (minValue > 1_000_000 || maxValue > 1_000_000) {
            alert("Values have to be less than 1,000,000");
            return false;
        }
        return true;
    };

    const generateArray = () => {
        if (isSorting || !validateValues()) return;
        const newArray = generateRandomArray(arraySize, minValue, maxValue);
        setArray(newArray);
        setOriginalArray([...newArray]);
        setCurrentAlgorithm(null);
    };

    const startSorting = async (algorithm: string) => {
        if (isSorting || !validateValues()) return;

        setIsSorting(true);
        setCurrentAlgorithm(algorithm);
        setArray([...originalArray]);

        try {
            const sortingAlgorithm = SortingAlgorithmFactory.create(
              algorithm,
              originalArray,
              setArray,
              getActualSpeed()
            );

            const result = await sortingAlgorithm.sort();

            setArray(result.array);
            setStats(prev => ({ ...prev, [algorithm]: result.stats }));
        } catch (error) {
            console.error("Sorting error:", error);
        } finally {
            setIsSorting(false);
        }
    };

    useEffect(() => {
        generateArray();
    }, []);

    const maxArrayValue = Math.max(...array.map(item => item.value), 1);

    const algorithms = [
        { key: "quick", name: "Quick Sort" },
        { key: "heap", name: "Heap Sort" },
        { key: "smooth", name: "Smooth Sort" },
        { key: "intro", name: "Introspective Sort" }
    ];

    const algorithmsInfo = [
        {
            title: "Quick Sort",
            description: "A divide-and-conquer algorithm that picks a pivot and partitions the array around it. Average time complexity: O(n log n)."
        },
        {
            title: "Heap Sort",
            description: "Uses a binary heap to sort elements by building a max heap and repeatedly extracting the maximum. Time complexity: O(n log n)."
        },
        {
            title: "Smooth Sort",
            description: "An adaptive algorithm based on Leonardo numbers, leveraging existing order in the input. Best case: O(n)."
        },
        {
            title: "Introspective Sort",
            description: "A hybrid algorithm combining quicksort, heapsort, and insertion sort, switching to heapsort when recursion depth is too high."
        }
    ];

    return (
      <div className="flex flex-col w-full max-w-6xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-6">OOP Sorting Algorithm Visualizer</h1>

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
                    className="w-24 p-1 border rounded bg-transparent"
                  />
              </div>

              <div className="flex flex-col gap-2">
                  <label className="font-medium">Max Value</label>
                  <input
                    type="number"
                    min={minValue + 1}
                    max="1000000"
                    value={maxValue}
                    onChange={(e) => !isSorting && setMaxValue(Number(e.target.value))}
                    disabled={isSorting}
                    className="w-24 p-1 border rounded bg-transparent"
                  />
              </div>

              <div className="flex flex-col gap-2">
                  <label className="font-medium">Sorting Speed</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={sortingSpeed}
                    onChange={(e) => setSortingSpeed(Number(e.target.value))}
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

          <div className="flex flex-wrap gap-4 mb-6">
              {algorithms.map(({ key, name }) => (
                <button
                  key={key}
                  onClick={() => startSorting(key)}
                  disabled={isSorting}
                  className={`px-4 py-2 rounded ${
                    currentAlgorithm === key
                      ? "bg-green-500 text-white"
                      : "bg-gray-600 hover:bg-gray-500 text-white"
                  } disabled:bg-gray-400`}
                >
                    {name}
                </button>
              ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {algorithms.map(({ key, name }) => (
                <div
                  key={key}
                  className={`p-4 border rounded ${
                    currentAlgorithm === key ? "border-green-500" : "border-gray-300"
                  }`}
                >
                    <h3 className="font-bold text-lg mb-2">{name}</h3>
                    <div className="flex flex-col gap-1">
                        <p>Comparisons: {stats[key].comparisons}</p>
                        <p>Swaps: {stats[key].swaps}</p>
                        <p>Duration: {stats[key].duration.toFixed(2)} ms</p>

                        {stats[key].comparisons > 0 && (
                          <button
                            onClick={() => downloadArrayData(originalArray, array, key, stats[key])}
                            className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                          >
                              Save Results
                          </button>
                        )}
                    </div>
                </div>
              ))}
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {algorithmsInfo.map(({ title, description }, index) => (
                <div key={index} className="p-4 border rounded">
                    <h3 className="font-bold text-lg mb-2">{title}</h3>
                    <p className="text-sm">{description}</p>
                </div>
              ))}
          </div>
      </div>
    );
}
