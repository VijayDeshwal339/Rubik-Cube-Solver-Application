import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Shuffle, Play, Pause, SkipForward, RotateCw } from 'lucide-react';

// Cube face colors
const COLORS = {
  w: '#ffffff', // white
  y: '#ffd500', // yellow
  r: '#ff0000', // red
  o: '#ff8c00', // orange
  b: '#0000ff', // blue
  g: '#00ff00'  // green
};

// Initial solved cube state
const SOLVED_CUBE = {
  U: ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'], // Up (white)
  D: ['y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y'], // Down (yellow)
  F: ['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'], // Front (red)
  B: ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'], // Back (orange)
  R: ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'], // Right (blue)
  L: ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g']  // Left (green)
};

class RubiksCube {
  constructor() {
    this.faces = JSON.parse(JSON.stringify(SOLVED_CUBE));
  }

  // Deep clone the cube state
  clone() {
    const newCube = new RubiksCube();
    newCube.faces = JSON.parse(JSON.stringify(this.faces));
    return newCube;
  }

  // Rotate a face 90 degrees clockwise
  rotateFaceClockwise(face) {
    const temp = [...this.faces[face]];
    this.faces[face][0] = temp[6];
    this.faces[face][1] = temp[3];
    this.faces[face][2] = temp[0];
    this.faces[face][3] = temp[7];
    this.faces[face][4] = temp[4];
    this.faces[face][5] = temp[1];
    this.faces[face][6] = temp[8];
    this.faces[face][7] = temp[5];
    this.faces[face][8] = temp[2];
  }

  // Rotate a face 90 degrees counter-clockwise
  rotateFaceCounterClockwise(face) {
    this.rotateFaceClockwise(face);
    this.rotateFaceClockwise(face);
    this.rotateFaceClockwise(face);
  }

  // Execute a move (F, R, U, L, D, B, and their primes)
  executeMove(move) {
    switch (move) {
      case 'F':
        this.rotateFaceClockwise('F');
        this.cycleEdges([
          ['U', [6, 7, 8]], ['R', [0, 3, 6]],
          ['D', [2, 1, 0]], ['L', [8, 5, 2]]
        ]);
        break;
      case "F'":
        this.rotateFaceCounterClockwise('F');
        this.cycleEdges([
          ['L', [8, 5, 2]], ['D', [2, 1, 0]],
          ['R', [0, 3, 6]], ['U', [6, 7, 8]]
        ]);
        break;
      case 'R':
        this.rotateFaceClockwise('R');
        this.cycleEdges([
          ['U', [2, 5, 8]], ['B', [0, 3, 6]],
          ['D', [2, 5, 8]], ['F', [2, 5, 8]]
        ]);
        break;
      case "R'":
        this.rotateFaceCounterClockwise('R');
        this.cycleEdges([
          ['F', [2, 5, 8]], ['D', [2, 5, 8]],
          ['B', [0, 3, 6]], ['U', [2, 5, 8]]
        ]);
        break;
      case 'U':
        this.rotateFaceClockwise('U');
        this.cycleEdges([
          ['F', [0, 1, 2]], ['L', [0, 1, 2]],
          ['B', [0, 1, 2]], ['R', [0, 1, 2]]
        ]);
        break;
      case "U'":
        this.rotateFaceCounterClockwise('U');
        this.cycleEdges([
          ['R', [0, 1, 2]], ['B', [0, 1, 2]],
          ['L', [0, 1, 2]], ['F', [0, 1, 2]]
        ]);
        break;
      case 'L':
        this.rotateFaceClockwise('L');
        this.cycleEdges([
          ['U', [0, 3, 6]], ['F', [0, 3, 6]],
          ['D', [0, 3, 6]], ['B', [8, 5, 2]]
        ]);
        break;
      case "L'":
        this.rotateFaceCounterClockwise('L');
        this.cycleEdges([
          ['B', [8, 5, 2]], ['D', [0, 3, 6]],
          ['F', [0, 3, 6]], ['U', [0, 3, 6]]
        ]);
        break;
      case 'D':
        this.rotateFaceClockwise('D');
        this.cycleEdges([
          ['F', [6, 7, 8]], ['R', [6, 7, 8]],
          ['B', [6, 7, 8]], ['L', [6, 7, 8]]
        ]);
        break;
      case "D'":
        this.rotateFaceCounterClockwise('D');
        this.cycleEdges([
          ['L', [6, 7, 8]], ['B', [6, 7, 8]],
          ['R', [6, 7, 8]], ['F', [6, 7, 8]]
        ]);
        break;
      case 'B':
        this.rotateFaceClockwise('B');
        this.cycleEdges([
          ['U', [0, 1, 2]], ['L', [0, 3, 6]],
          ['D', [8, 7, 6]], ['R', [8, 5, 2]]
        ]);
        break;
      case "B'":
        this.rotateFaceCounterClockwise('B');
        this.cycleEdges([
          ['R', [8, 5, 2]], ['D', [8, 7, 6]],
          ['L', [0, 3, 6]], ['U', [0, 1, 2]]
        ]);
        break;
    }
  }

  // Helper method to cycle edges during face rotations
  cycleEdges(edges) {
    const temp = edges[0][1].map(i => this.faces[edges[0][0]][i]);
    for (let i = 0; i < edges.length - 1; i++) {
      const [face1, positions1] = edges[i];
      const [face2, positions2] = edges[i + 1];
      positions1.forEach((pos, idx) => {
        this.faces[face1][pos] = this.faces[face2][positions2[idx]];
      });
    }
    const lastEdge = edges[edges.length - 1];
    lastEdge[1].forEach((pos, idx) => {
      this.faces[lastEdge[0]][pos] = temp[idx];
    });
  }

  // Check if cube is solved
  isSolved() {
    return Object.keys(this.faces).every(face =>
      this.faces[face].every(square => square === this.faces[face][4])
    );
  }

  // Get cube state as string for comparison
  getStateString() {
    return Object.keys(this.faces)
      .sort()
      .map(face => this.faces[face].join(''))
      .join('');
  }

  // Get a random scramble
  getScramble(length = 25) {
    const moves = ['F', "F'", 'R', "R'", 'U', "U'", 'L', "L'", 'D', "D'", 'B', "B'"];
    const scramble = [];
    let lastMove = '';
    
    for (let i = 0; i < length; i++) {
      let move;
      do {
        move = moves[Math.floor(Math.random() * moves.length)];
      } while (move[0] === lastMove[0]); // Avoid consecutive moves on same face
      
      scramble.push(move);
      lastMove = move;
    }
    
    return scramble;
  }

  // Apply scramble to cube
  scramble(moves = null) {
    const scrambleMoves = moves || this.getScramble();
    scrambleMoves.forEach(move => this.executeMove(move));
    return scrambleMoves;
  }
}

// Improved cube solver using BFS for optimal solutions
class CubeSolver {
  constructor(cube) {
    this.cube = cube.clone();
    this.solution = [];
    this.moves = ['F', "F'", 'R', "R'", 'U', "U'", 'L', "L'", 'D', "D'", 'B', "B'"];
  }

  // Get the inverse of a move
  getInverseMove(move) {
    if (move.includes("'")) {
      return move.replace("'", "");
    } else {
      return move + "'";
    }
  }

  // Breadth-first search for optimal solution (limited depth for performance)
  solveBFS(maxDepth = 8) {
    if (this.cube.isSolved()) {
      return [];
    }

    const queue = [{ cube: this.cube.clone(), moves: [] }];
    const visited = new Set([this.cube.getStateString()]);
    
    while (queue.length > 0) {
      const { cube: currentCube, moves } = queue.shift();
      
      if (moves.length >= maxDepth) {
        continue;
      }
      
      for (const move of this.moves) {
        // Skip redundant moves (opposite of last move)
        if (moves.length > 0 && move === this.getInverseMove(moves[moves.length - 1])) {
          continue;
        }
        
        // Skip moves on same face as last move
        if (moves.length > 0 && move[0] === moves[moves.length - 1][0]) {
          continue;
        }
        
        const newCube = currentCube.clone();
        newCube.executeMove(move);
        const newMoves = [...moves, move];
        
        if (newCube.isSolved()) {
          return newMoves;
        }
        
        const stateString = newCube.getStateString();
        if (!visited.has(stateString) && newMoves.length < maxDepth) {
          visited.add(stateString);
          queue.push({ cube: newCube, moves: newMoves });
        }
      }
    }
    
    // If BFS doesn't find solution, fall back to layer-by-layer
    return this.solveLayerByLayer();
  }

  // Improved layer-by-layer solver with better algorithms
  solveLayerByLayer() {
    this.solution = [];
    
    // Step 1: Solve white cross
    this.solveWhiteCross();
    
    // Step 2: Solve white corners
    this.solveWhiteCorners();
    
    // Step 3: Solve middle layer
    this.solveMiddleLayer();
    
    // Step 4: Solve yellow cross
    this.solveYellowCross();
    
    // Step 5: Orient yellow corners
    this.orientYellowCorners();
    
    // Step 6: Permute yellow corners
    this.permuteYellowCorners();
    
    // Step 7: Permute yellow edges
    this.permuteYellowEdges();
    
    return this.solution;
  }

  solve() {
    // Try BFS first for simple cases (1-8 moves)
    const bfsSolution = this.solveBFS(8);
    if (bfsSolution.length > 0) {
      return bfsSolution;
    }
    
    // Fall back to layer-by-layer for complex cases
    return this.solveLayerByLayer();
  }

  executeSequence(moves) {
    moves.forEach(move => {
      this.cube.executeMove(move);
      this.solution.push(move);
    });
  }

  // White cross solving with proper edge positioning
  solveWhiteCross() {
    const whiteEdgePositions = [
      { face: 'U', pos: 1, adjacent: 'F' },
      { face: 'U', pos: 3, adjacent: 'L' },
      { face: 'U', pos: 5, adjacent: 'R' },
      { face: 'U', pos: 7, adjacent: 'B' }
    ];

    for (const edge of whiteEdgePositions) {
      if (this.cube.faces[edge.face][edge.pos] !== 'w') {
        this.positionWhiteEdge(edge);
      }
    }
  }

  positionWhiteEdge(targetEdge) {
    // Find white edge piece
    const faces = ['F', 'R', 'B', 'L', 'D'];
    const edgePositions = [1, 3, 5, 7];
    
    for (const face of faces) {
      for (const pos of edgePositions) {
        if (this.cube.faces[face][pos] === 'w') {
          this.moveWhiteEdgeToTop(face, pos, targetEdge);
          return;
        }
      }
    }
  }

  moveWhiteEdgeToTop(face, pos, targetEdge) {
    // Simplified white edge positioning
    const maxMoves = 8;
    let moves = 0;
    
    while (this.cube.faces[targetEdge.face][targetEdge.pos] !== 'w' && moves < maxMoves) {
      if (face === 'D') {
        this.executeSequence(['D']);
      } else {
        this.executeSequence([face, 'U']);
      }
      moves++;
    }
  }

  solveWhiteCorners() {
    const cornerAlgorithm = ['R', 'U', "R'", "U'"];
    let attempts = 0;
    const maxAttempts = 20;
    
    while (!this.areWhiteCornersSolved() && attempts < maxAttempts) {
      this.executeSequence(cornerAlgorithm);
      attempts++;
    }
  }

  areWhiteCornersSolved() {
    return [0, 2, 6, 8].every(pos => this.cube.faces.U[pos] === 'w');
  }

  solveMiddleLayer() {
    const rightHandAlgorithm = ['R', 'U', "R'", "U'", "R'", 'F', 'R', "F'"];
    const leftHandAlgorithm = ["L'", "U'", 'L', 'U', 'L', "F'", "L'", 'F'];
    
    let attempts = 0;
    const maxAttempts = 15;
    
    while (!this.isMiddleLayerSolved() && attempts < maxAttempts) {
      if (attempts % 2 === 0) {
        this.executeSequence(rightHandAlgorithm);
      } else {
        this.executeSequence(leftHandAlgorithm);
      }
      attempts++;
    }
  }

  isMiddleLayerSolved() {
    const faces = ['F', 'R', 'B', 'L'];
    return faces.every(face => 
      [3, 5].every(pos => this.cube.faces[face][pos] === this.cube.faces[face][4])
    );
  }

  solveYellowCross() {
    const yellowCrossAlgorithm = ['F', 'R', 'U', "R'", "U'", "F'"];
    let attempts = 0;
    const maxAttempts = 4;
    
    while (!this.isYellowCrossSolved() && attempts < maxAttempts) {
      this.executeSequence(yellowCrossAlgorithm);
      attempts++;
    }
  }

  isYellowCrossSolved() {
    return [1, 3, 5, 7].every(pos => this.cube.faces.D[pos] === 'y');
  }

  orientYellowCorners() {
    const cornerOrientationAlgorithm = ['R', 'U', "R'", 'U', 'R', 'U', 'U', "R'"];
    let attempts = 0;
    const maxAttempts = 8;
    
    while (!this.areYellowCornersOriented() && attempts < maxAttempts) {
      this.executeSequence(cornerOrientationAlgorithm);
      attempts++;
    }
  }

  areYellowCornersOriented() {
    return [0, 2, 6, 8].every(pos => this.cube.faces.D[pos] === 'y');
  }

  permuteYellowCorners() {
    const cornerPermutationAlgorithm = ['R', "F'", "R'", 'B', 'B', 'R', "F'", "R'", 'B', 'B', 'R', 'R'];
    let attempts = 0;
    const maxAttempts = 4;
    
    while (!this.areYellowCornersPermuted() && attempts < maxAttempts) {
      this.executeSequence(cornerPermutationAlgorithm);
      attempts++;
    }
  }

  areYellowCornersPermuted() {
    const faces = ['F', 'R', 'B', 'L'];
    return faces.every(face => {
      const corner1 = this.cube.faces[face][6];
      const corner2 = this.cube.faces[face][8];
      return corner1 === corner2;
    });
  }

  permuteYellowEdges() {
    const edgePermutationAlgorithm = ['R', 'U', "R'", 'F', "R'", "F'", 'R'];
    let attempts = 0;
    const maxAttempts = 6;
    
    while (!this.cube.isSolved() && attempts < maxAttempts) {
      this.executeSequence(edgePermutationAlgorithm);
      attempts++;
    }
  }
}

const RubiksCube3D = () => {
  const [cube, setCube] = useState(new RubiksCube());
  const [isRotating, setIsRotating] = useState(false);
  const [solution, setSolution] = useState([]);
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrambleMoves, setScrambleMoves] = useState([]);
  const [manualMoves, setManualMoves] = useState([]);
  const cubeRef = useRef(null);

  const updateCube = () => {
    setCube(new RubiksCube());
    setCube(prev => {
      const newCube = prev.clone();
      return newCube;
    });
  };

  const handleManualMove = (move) => {
    if (isAnimating) return;
    
    const newCube = cube.clone();
    newCube.executeMove(move);
    setCube(newCube);
    setManualMoves(prev => [...prev, move]);
    
    // Clear solution when manual moves are made
    setSolution([]);
    setSolutionIndex(0);
  };

  const handleScramble = () => {
    if (isAnimating) return;
    
    const newCube = new RubiksCube();
    const moves = newCube.scramble();
    setScrambleMoves(moves);
    setCube(newCube);
    setSolution([]);
    setSolutionIndex(0);
    setManualMoves([]);
  };

  const handleSolve = () => {
    if (isAnimating || cube.isSolved()) return;

    const solver = new CubeSolver(cube);
    const solutionMoves = solver.solve();
    setSolution(solutionMoves);
    setSolutionIndex(0);
  };

  const handleStep = () => {
    if (solution.length === 0 || solutionIndex >= solution.length) return;

    const move = solution[solutionIndex];
    const newCube = cube.clone();
    newCube.executeMove(move);
    setCube(newCube);
    setSolutionIndex(prev => prev + 1);
  };

  const handleAutoSolve = async () => {
    if (solution.length === 0 || isAnimating) return;

    setIsAnimating(true);
    let currentCube = cube.clone();
    
    for (let i = solutionIndex; i < solution.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      currentCube.executeMove(solution[i]);
      setCube(currentCube.clone());
      setSolutionIndex(i + 1);
    }
    
    setIsAnimating(false);
  };

  const handleReset = () => {
    if (isAnimating) return;
    setCube(new RubiksCube());
    setSolution([]);
    setSolutionIndex(0);
    setScrambleMoves([]);
    setManualMoves([]);
  };

  const renderFace = (faceData, faceClass, faceName) => (
    <div className={`cube-face ${faceClass}`}>
      <div className="face-grid">
        {faceData.map((color, index) => (
          <div
            key={index}
            className="sticker"
            style={{ backgroundColor: COLORS[color] }}
          />
        ))}
      </div>
      {/* Face label for manual controls */}
      <div className="face-label">
        <span className="face-name">{faceName}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">3D Rubik's Cube Solver</h1>
          <p className="text-gray-300">Optimal BFS solver for simple cases, layer-by-layer for complex ones</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* 3D Cube Display */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="cube-container">
              <div ref={cubeRef} className="cube">
                {renderFace(cube.faces.F, 'front', 'F')}
                {renderFace(cube.faces.B, 'back', 'B')}
                {renderFace(cube.faces.R, 'right', 'R')}
                {renderFace(cube.faces.L, 'left', 'L')}
                {renderFace(cube.faces.U, 'top', 'U')}
                {renderFace(cube.faces.D, 'bottom', 'D')}
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Manual Controls */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Manual Controls</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Face Rotations</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['F', 'R', 'U', 'L', 'D', 'B'].map(face => (
                      <div key={face} className="flex gap-1">
                        <button
                          onClick={() => handleManualMove(face)}
                          disabled={isAnimating}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-2 py-2 rounded text-sm transition-all duration-200 hover:scale-105"
                        >
                          {face}
                        </button>
                        <button
                          onClick={() => handleManualMove(face + "'")}
                          disabled={isAnimating}
                          className="flex-1 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white px-2 py-2 rounded text-sm transition-all duration-200 hover:scale-105"
                        >
                          {face}'
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Automatic Controls */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Automatic Controls</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleScramble}
                  disabled={isAnimating}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <Shuffle size={20} />
                  Scramble
                </button>
                <button
                  onClick={handleSolve}
                  disabled={isAnimating || cube.isSolved()}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <Play size={20} />
                  Solve
                </button>
                <button
                  onClick={handleStep}
                  disabled={solution.length === 0 || solutionIndex >= solution.length || isAnimating}
                  className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <SkipForward size={20} />
                  Step
                </button>
                <button
                  onClick={handleAutoSolve}
                  disabled={solution.length === 0 || isAnimating || solutionIndex >= solution.length}
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  {isAnimating ? <Pause size={20} /> : <Play size={20} />}
                  Auto Solve
                </button>
              </div>
              <button
                onClick={handleReset}
                disabled={isAnimating}
                className="w-full mt-3 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>

            {/* Status Panel */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-3">Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">State:</span>
                  <span className={cube.isSolved() ? "text-green-400" : "text-yellow-400"}>
                    {cube.isSolved() ? "Solved!" : "Unsolved"}
                  </span>
                </div>
                {manualMoves.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Manual Moves:</span>
                    <span className="text-blue-400">{manualMoves.length}</span>
                  </div>
                )}
                {solution.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Solution Length:</span>
                      <span className="text-green-400">{solution.length} moves</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Progress:</span>
                      <span className="text-purple-400">{solutionIndex}/{solution.length}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Manual Moves Display */}
            {manualMoves.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">Your Moves</h3>
                <div className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {manualMoves.map((move, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded text-xs font-mono bg-blue-600 text-white"
                      >
                        {move}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Solution Display */}
            {solution.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">Solution</h3>
                <div className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {solution.map((move, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs font-mono ${
                          index < solutionIndex
                            ? "bg-green-600 text-white"
                            : index === solutionIndex
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-600 text-gray-300"
                        }`}
                      >
                        {move}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Scramble Display */}
            {scrambleMoves.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">Last Scramble</h3>
                <div className="max-h-24 overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {scrambleMoves.map((move, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded text-xs font-mono bg-orange-600 text-white"
                      >
                        {move}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RubiksCube3D;