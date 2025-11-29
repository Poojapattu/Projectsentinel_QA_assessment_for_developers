import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

export default function AlgorithmAnimations() {
  const [currentAlgorithm, setCurrentAlgorithm] = useState('bubbleSort');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);

  const algorithms = {
    bubbleSort: {
      name: 'Bubble Sort',
      complexity: { time: 'O(n²)', space: 'O(1)' }
    },
    quickSort: {
      name: 'Quick Sort', 
      complexity: { time: 'O(n log n)', space: 'O(log n)' }
    },
    binarySearch: {
      name: 'Binary Search',
      complexity: { time: 'O(log n)', space: 'O(1)' }
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        Algorithm Animation & Education
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Live Visualization</h4>
            <div className="flex items-end justify-center gap-1 h-32">
              {[5, 2, 8, 1, 9].map((value, index) => (
                <div
                  key={index}
                  className="w-8 bg-gradient-to-t from-blue-400 to-purple-500 rounded-t transition-all duration-500"
                  style={{ height: `${value * 12}px` }}
                >
                  <span className="text-xs text-white -mt-6 block text-center">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Algorithm Education</h4>
            <p className="text-white/70 text-sm">
              Interactive visualization of sorting and search algorithms with complexity analysis.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-white/70 text-sm">Time Complexity</div>
              <div className="text-yellow-400 font-mono font-bold">
                {algorithms[currentAlgorithm].complexity.time}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-white/70 text-sm">Space Complexity</div>
              <div className="text-yellow-400 font-mono font-bold">
                {algorithms[currentAlgorithm].complexity.space}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}