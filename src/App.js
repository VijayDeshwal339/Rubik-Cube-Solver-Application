import React, { useState, useEffect } from 'react';
import { RubiksCube } from './components/RubiksCube.js';
import { CubeSolver } from './components/CubeSolver.js';
import Cube3D from './components/Cube3D.jsx';
import { RotateCcw, Shuffle, Play, SkipForward, Square } from 'lucide-react';

function App() {
  const [cube, setCube] = useState(new RubiksCube());
  const [solutionSteps, setSolutionSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSolved, setIsSolved] = useState(true);
  const [scrambleMoves, setScrambleMoves] = useState([]);

  // Update solved state when cube changes
  useEffect(() => {
    setIsSolved(cube.isSolved());
  }, [cube]);

  const handleScramble = () => {
    const newCube = new RubiksCube();
    const moves = newCube.scramble(15);
    setCube(newCube);
    setScrambleMoves(moves);
    setSolutionSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleSolve = () => {
    const cubeCopy = cube.clone();
    const solver = new CubeSolver(cubeCopy);
    const solution = solver.solve();
    
    // Create step-by-step solution
    const steps = [];
    const stepCube = cube.clone();
    
    steps.push({
      move: 'Initial State',
      cubeState: stepCube.getCubeString(),
      stepNumber: 0
    });

    solution.forEach((move, index) => {
      stepCube.executeMove(move);
      steps.push({
        move: move,
        cubeState: stepCube.getCubeString(),
        stepNumber: index + 1
      });
    });

    setSolutionSteps(steps);
    setCurrentStep(0);
  };

  const handleManualMove = (move) => {
    const newCube = cube.clone();
    newCube.executeMove(move);
    setCube(newCube);
  };

  const handleStepForward = () => {
    if (currentStep < solutionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaySolution = () => {
    if (!isPlaying && solutionSteps.length > 0) {
      setIsPlaying(true);
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= solutionSteps.length - 1) {
            setIsPlaying(false);
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleReset = () => {
    const newCube = new RubiksCube();
    setCube(newCube);
    setSolutionSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setScrambleMoves([]);
  };

  const getCurrentCubeState = () => {
    if (solutionSteps.length > 0 && currentStep < solutionSteps.length) {
      return solutionSteps[currentStep].cubeState;
    }
    return cube.getCubeString();
  };

  const getCurrentMove = () => {
    if (solutionSteps.length > 0 && currentStep < solutionSteps.length) {
      return solutionSteps[currentStep].move;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            3D Rubik's Cube Solver
          </h1>
          <p className="text-gray-600">
            Interactive 3D cube with object-oriented representation and layer-by-layer solving
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 3D Cube Visualization */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
              Interactive 3D Cube
            </h2>
            
            <div className="flex justify-center">
              <Cube3D cubeString={getCurrentCubeState()} />
            </div>

            {/* Cube Status */}
            <div className="text-center mt-6 mb-4">
              <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-medium ${
                isSolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                <Square className="w-5 h-5 mr-2" />
                {isSolved ? 'Cube Solved!' : 'Cube Scrambled'}
              </div>
            </div>

            {/* Current Move Display */}
            {getCurrentMove() && getCurrentMove() !== 'Initial State' && (
              <div className="text-center mb-4">
                <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-lg inline-block">
                  <span className="font-medium">Current Move: </span>
                  <span className="font-mono text-xl font-bold">{getCurrentMove()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Main Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Cube Controls</h2>
              
              <div className="grid grid-cols-1 gap-3 mb-6">
                <button
                  onClick={handleScramble}
                  disabled={isPlaying}
                  className="flex items-center justify-center px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 transition-colors font-medium"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Scramble Cube
                </button>
                
                <button
                  onClick={handleSolve}
                  disabled={isPlaying || isSolved}
                  className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors font-medium"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Find Solution
                </button>
                
                <button
                  onClick={handleReset}
                  disabled={isPlaying}
                  className="flex items-center justify-center px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-400 transition-colors font-medium"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset Cube
                </button>

                <button
                  onClick={handlePlaySolution}
                  disabled={isPlaying || solutionSteps.length === 0}
                  className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors font-medium"
                >
                  <SkipForward className="w-5 h-5 mr-2" />
                  Play Solution
                </button>
              </div>

              {/* Solution Navigation */}
              {solutionSteps.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-3">Solution Steps</h3>
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={handleStepBackward}
                      disabled={currentStep === 0 || isPlaying}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                    >
                      ← Previous
                    </button>
                    
                    <span className="text-sm text-gray-600 font-medium">
                      Step {currentStep} of {solutionSteps.length - 1}
                    </span>
                    
                    <button
                      onClick={handleStepForward}
                      disabled={currentStep === solutionSteps.length - 1 || isPlaying}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                    >
                      Next →
                    </button>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / Math.max(1, solutionSteps.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Manual Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Manual Rotations</h2>
              
              <div className="grid grid-cols-3 gap-2">
                {['F', 'R', 'U', 'D', 'L', 'B'].map(face => (
                  <div key={face} className="space-y-2">
                    <button
                      onClick={() => handleManualMove(face)}
                      disabled={isPlaying}
                      className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors font-medium"
                    >
                      {face}
                    </button>
                    <button
                      onClick={() => handleManualMove(face + "'")}
                      disabled={isPlaying}
                      className="w-full px-3 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 disabled:bg-gray-400 transition-colors text-sm"
                    >
                      {face}'
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Face notation:</strong></p>
                <p>F=Front, R=Right, U=Up, D=Down, L=Left, B=Back</p>
                <p>Prime (') = Counter-clockwise rotation</p>
              </div>
            </div>

            {/* Scramble Info */}
            {scrambleMoves.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Last Scramble</h2>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-mono text-sm break-words">
                    {scrambleMoves.join(' ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            This 3D interactive solver uses a simplified layer-by-layer algorithm. 
            Drag the cube to rotate and view all sides!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;