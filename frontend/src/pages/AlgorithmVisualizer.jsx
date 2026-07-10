import { useState, useEffect, useRef } from "react";

const MergeSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [speedMs, setSpeedMs] = useState(100);
  const [comparingIndices, setComparingIndices] = useState([]);

  const animationQueueRef = useRef([]);

  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    if (isSorting) return;
    const newArr = Array.from(
      { length: 40 },
      () => Math.floor(Math.random() * 400) + 20,
    );
    setArray(newArr);
    setComparingIndices([]);
    animationQueueRef.current = [];
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const mergeSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    animationQueueRef.current = [];

    let arrCopy = [...array];
    const auxiliaryArray = arrCopy.slice();

    mergeSortHelper(
      arrCopy,
      0,
      arrCopy.length - 1,
      auxiliaryArray,
      animationQueueRef.current,
    );

    for (let i = 0; i < animationQueueRef.current.length; i++) {
      const animation = animationQueueRef.current[i];

      if (animation.type === "compare") {
        setComparingIndices([animation.idx1, animation.idx2]);
      } else if (animation.type === "overwrite") {
        setArray((prevArray) => {
          const newArray = [...prevArray];
          newArray[animation.idx] = animation.newHeight;
          return newArray;
        });
        setComparingIndices([animation.idx]);
      }
      await sleep(speedMs);
    }

    setComparingIndices([]);
    setIsSorting(false);
  };

  const mergeSortHelper = (
    mainArray,
    startIdx,
    endIdx,
    auxiliaryArray,
    animations,
  ) => {
    if (startIdx === endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
    mergeSortHelper(
      auxiliaryArray,
      middleIdx + 1,
      endIdx,
      mainArray,
      animations,
    );
    doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
  };

  const doMerge = (
    mainArray,
    startIdx,
    middleIdx,
    endIdx,
    auxiliaryArray,
    animations,
  ) => {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;

    while (i <= middleIdx && j <= endIdx) {
      animations.push({ type: "compare", idx1: i, idx2: j });
      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        animations.push({
          type: "overwrite",
          idx: k,
          newHeight: auxiliaryArray[i],
        });
        mainArray[k++] = auxiliaryArray[i++];
      } else {
        animations.push({
          type: "overwrite",
          idx: k,
          newHeight: auxiliaryArray[j],
        });
        mainArray[k++] = auxiliaryArray[j++];
      }
    }

    while (i <= middleIdx) {
      animations.push({ type: "compare", idx1: i, idx2: i });
      animations.push({
        type: "overwrite",
        idx: k,
        newHeight: auxiliaryArray[i],
      });
      mainArray[k++] = auxiliaryArray[i++];
    }

    while (j <= endIdx) {
      animations.push({ type: "compare", idx1: j, idx2: j });
      animations.push({
        type: "overwrite",
        idx: k,
        newHeight: auxiliaryArray[j],
      });
      mainArray[k++] = auxiliaryArray[j++];
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#2B2B2B]">
      <div className="mb-6 border-b border-[#4e5254] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Algorithm Visualizer
          </h1>
          <p className="text-[#808080] font-mono text-sm">
            Demonstrating Merge Sort algorithm
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex space-x-4">
          <button
            onClick={resetArray}
            disabled={isSorting}
            className="bg-[#313335] hover:bg-[#3C3F41] border border-[#4e5254] px-4 py-2 rounded font-mono text-sm text-[#A9B7C6] transition-colors disabled:opacity-50"
          >
            Reset Data
          </button>
          <button
            onClick={mergeSort}
            disabled={isSorting}
            className="bg-[#629755] hover:bg-[#528246] border border-[#48763f] px-4 py-2 rounded font-mono text-sm text-white transition-colors shadow-sm disabled:opacity-50 flex items-center"
          >
            <span className="mr-2">▶</span> Run Merge Sort
          </button>
        </div>
      </div>

      <div className="flex-grow bg-[#313335] rounded-lg border border-[#4e5254] p-4 flex items-end justify-center h-96 shadow-inner overflow-hidden">
        <div className="flex items-end space-x-1 h-full w-full max-w-4xl mx-auto">
          {array.map((value, idx) => {
            const isComparing = comparingIndices.includes(idx);
            const barColor = isComparing ? "bg-[#CC7832]" : "bg-[#467CDA]";

            return (
              <div
                key={idx}
                className={`w-full rounded-t-sm transition-all duration-75 ${barColor}`}
                style={{ height: `${(value / 400) * 100}%` }}
              ></div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-between text-xs font-mono text-[#808080]">
        <p>Array Length: {array.length}</p>
        <p>Time Complexity: O(N log N)</p>
      </div>
    </div>
  );
};

export default MergeSortVisualizer;
