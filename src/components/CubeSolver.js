export class CubeSolver {
  constructor(cube) {
    this.cube = cube;
    this.solution = [];
  }

  executeSequence(moves) {
    moves.forEach(move => {
      this.cube.executeMove(move);
      this.solution.push(move);
    });
  }

  solve() {
    this.solution = [];
    
    this.solveWhiteCross();
    
    this.solveWhiteCorners();
    
    this.solveMiddleLayer();
    
    this.solveYellowCross();
    
    this.orientYellowCorners();
    
    this.permuteYellowCorners();
    
    this.permuteYellowEdges();
    
    return this.solution;
  }

  solveWhiteCross() {
    const maxAttempts = 50;
    let attempts = 0;
    
    while (!this.isWhiteCrossSolved() && attempts < maxAttempts) {
      if (this.cube.faces.F[1] === 'w') {
        this.executeSequence(['F', 'U', 'R', "U'"]);
      } else if (this.cube.faces.R[1] === 'w') {
        this.executeSequence(['R', 'U', 'B', "U'"]);
      } else if (this.cube.faces.B[1] === 'w') {
        this.executeSequence(['B', 'U', 'L', "U'"]);
      } else if (this.cube.faces.L[1] === 'w') {
        this.executeSequence(['L', 'U', 'F', "U'"]);
      } else {
        this.executeSequence(['U']);
      }
      attempts++;
    }
  }

  isWhiteCrossSolved() {
    return this.cube.faces.U[1] === 'w' && 
           this.cube.faces.U[3] === 'w' && 
           this.cube.faces.U[5] === 'w' && 
           this.cube.faces.U[7] === 'w';
  }

  solveWhiteCorners() {
    const maxAttempts = 100;
    let attempts = 0;
    
    while (!this.areWhiteCornersSolved() && attempts < maxAttempts) {
      this.executeSequence(['R', 'U', "R'", "U'"]);
      attempts++;
    }
  }

  areWhiteCornersSolved() {
    return this.cube.faces.U[0] === 'w' && 
           this.cube.faces.U[2] === 'w' && 
           this.cube.faces.U[6] === 'w' && 
           this.cube.faces.U[8] === 'w';
  }

  solveMiddleLayer() {
    const maxAttempts = 100;
    let attempts = 0;
    
    while (!this.isMiddleLayerSolved() && attempts < maxAttempts) {
      this.executeSequence(['R', 'U', "R'", 'F', "R'", "F'", 'R']);
      attempts++;
    }
  }

  isMiddleLayerSolved() {
    return this.cube.faces.F[3] === 'r' && this.cube.faces.F[5] === 'r' &&
           this.cube.faces.R[3] === 'b' && this.cube.faces.R[5] === 'b' &&
           this.cube.faces.B[3] === 'o' && this.cube.faces.B[5] === 'o' &&
           this.cube.faces.L[3] === 'g' && this.cube.faces.L[5] === 'g';
  }

  solveYellowCross() {
    const maxAttempts = 20;
    let attempts = 0;
    
    while (!this.isYellowCrossSolved() && attempts < maxAttempts) {
      this.executeSequence(['F', 'R', 'U', "R'", "U'", "F'"]);
      attempts++;
    }
  }

  isYellowCrossSolved() {
    return this.cube.faces.D[1] === 'y' && 
           this.cube.faces.D[3] === 'y' && 
           this.cube.faces.D[5] === 'y' && 
           this.cube.faces.D[7] === 'y';
  }

  orientYellowCorners() {
    const maxAttempts = 50;
    let attempts = 0;
    
    while (!this.areYellowCornersOriented() && attempts < maxAttempts) {
      this.executeSequence(['R', 'U', "R'", 'U', 'R', 'U', 'U', "R'"]);
      attempts++;
    }
  }

  areYellowCornersOriented() {
    return this.cube.faces.D[0] === 'y' && 
           this.cube.faces.D[2] === 'y' && 
           this.cube.faces.D[6] === 'y' && 
           this.cube.faces.D[8] === 'y';
  }

  permuteYellowCorners() {
    const maxAttempts = 50;
    let attempts = 0;
    
    while (!this.areYellowCornersPermuted() && attempts < maxAttempts) {
      this.executeSequence(['R', "F'", "R'", 'B', 'B', 'R', "F'", "R'", 'B', 'B', 'R', 'R']);
      attempts++;
    }
  }

  areYellowCornersPermuted() {
    return this.cube.faces.F[6] === this.cube.faces.F[7] && 
           this.cube.faces.R[6] === this.cube.faces.R[7] && 
           this.cube.faces.B[6] === this.cube.faces.B[7] && 
           this.cube.faces.L[6] === this.cube.faces.L[7];
  }

  permuteYellowEdges() {
    const maxAttempts = 50;
    let attempts = 0;
    
    while (!this.cube.isSolved() && attempts < maxAttempts) {
      this.executeSequence(['R', 'U', "R'", 'F', "R'", "F'", 'R']);
      attempts++;
    }
  }
}