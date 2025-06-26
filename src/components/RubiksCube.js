export class RubiksCube {
  constructor() {
    this.initializeCube();
  }

  initializeCube() {
    this.faces = {
      F: Array(9).fill('r'), // Front - Red
      B: Array(9).fill('o'), // Back - Orange  
      L: Array(9).fill('g'), // Left - Green
      R: Array(9).fill('b'), // Right - Blue
      U: Array(9).fill('w'), // Up - White
      D: Array(9).fill('y')  // Down - Yellow
    };
  }

  getCubeString() {
    return Object.values(this.faces).flat().join('');
  }

  clone() {
    const newCube = new RubiksCube();
    newCube.faces = {
      F: [...this.faces.F],
      B: [...this.faces.B],
      L: [...this.faces.L],
      R: [...this.faces.R],
      U: [...this.faces.U],
      D: [...this.faces.D]
    };
    return newCube;
  }

  rotateFace(face) {
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

  F() {
    this.rotateFace('F');
    
    const temp = [
      this.faces.U[6], this.faces.U[7], this.faces.U[8]
    ];
    
    this.faces.U[6] = this.faces.L[8];
    this.faces.U[7] = this.faces.L[5];
    this.faces.U[8] = this.faces.L[2];
    
    this.faces.L[2] = this.faces.D[0];
    this.faces.L[5] = this.faces.D[1];
    this.faces.L[8] = this.faces.D[2];
    
    this.faces.D[0] = this.faces.R[6];
    this.faces.D[1] = this.faces.R[3];
    this.faces.D[2] = this.faces.R[0];
    
    this.faces.R[0] = temp[0];
    this.faces.R[3] = temp[1];
    this.faces.R[6] = temp[2];
  }

  FPrime() {
    this.F();
    this.F();
    this.F();
  }

  R() {
    this.rotateFace('R');
    
    const temp = [
      this.faces.U[2], this.faces.U[5], this.faces.U[8]
    ];
    
    this.faces.U[2] = this.faces.F[2];
    this.faces.U[5] = this.faces.F[5];
    this.faces.U[8] = this.faces.F[8];
    
    this.faces.F[2] = this.faces.D[2];
    this.faces.F[5] = this.faces.D[5];
    this.faces.F[8] = this.faces.D[8];
    
    this.faces.D[2] = this.faces.B[6];
    this.faces.D[5] = this.faces.B[3];
    this.faces.D[8] = this.faces.B[0];
    
    this.faces.B[0] = temp[2];
    this.faces.B[3] = temp[1];
    this.faces.B[6] = temp[0];
  }

  RPrime() {
    this.R();
    this.R();
    this.R();
  }

  U() {
    this.rotateFace('U');
    
    const temp = [
      this.faces.F[0], this.faces.F[1], this.faces.F[2]
    ];
    
    this.faces.F[0] = this.faces.R[0];
    this.faces.F[1] = this.faces.R[1];
    this.faces.F[2] = this.faces.R[2];
    
    this.faces.R[0] = this.faces.B[0];
    this.faces.R[1] = this.faces.B[1];
    this.faces.R[2] = this.faces.B[2];
    
    this.faces.B[0] = this.faces.L[0];
    this.faces.B[1] = this.faces.L[1];
    this.faces.B[2] = this.faces.L[2];
    
    this.faces.L[0] = temp[0];
    this.faces.L[1] = temp[1];
    this.faces.L[2] = temp[2];
  }

  UPrime() {
    this.U();
    this.U();
    this.U();
  }

  D() {
    this.rotateFace('D');
    
    const temp = [
      this.faces.F[6], this.faces.F[7], this.faces.F[8]
    ];
    
    this.faces.F[6] = this.faces.L[6];
    this.faces.F[7] = this.faces.L[7];
    this.faces.F[8] = this.faces.L[8];
    
    this.faces.L[6] = this.faces.B[6];
    this.faces.L[7] = this.faces.B[7];
    this.faces.L[8] = this.faces.B[8];
    
    this.faces.B[6] = this.faces.R[6];
    this.faces.B[7] = this.faces.R[7];
    this.faces.B[8] = this.faces.R[8];
    
    this.faces.R[6] = temp[0];
    this.faces.R[7] = temp[1];
    this.faces.R[8] = temp[2];
  }

  DPrime() {
    this.D();
    this.D();
    this.D();
  }

  L() {
    this.rotateFace('L');
    
    const temp = [
      this.faces.U[0], this.faces.U[3], this.faces.U[6]
    ];
    
    this.faces.U[0] = this.faces.B[8];
    this.faces.U[3] = this.faces.B[5];
    this.faces.U[6] = this.faces.B[2];
    
    this.faces.B[2] = this.faces.D[6];
    this.faces.B[5] = this.faces.D[3];
    this.faces.B[8] = this.faces.D[0];
    
    this.faces.D[0] = this.faces.F[0];
    this.faces.D[3] = this.faces.F[3];
    this.faces.D[6] = this.faces.F[6];
    
    this.faces.F[0] = temp[0];
    this.faces.F[3] = temp[1];
    this.faces.F[6] = temp[2];
  }

  LPrime() {
    this.L();
    this.L();
    this.L();
  }

  B() {
    this.rotateFace('B');
    
    const temp = [
      this.faces.U[0], this.faces.U[1], this.faces.U[2]
    ];
    
    this.faces.U[0] = this.faces.R[2];
    this.faces.U[1] = this.faces.R[5];
    this.faces.U[2] = this.faces.R[8];
    
    this.faces.R[2] = this.faces.D[8];
    this.faces.R[5] = this.faces.D[7];
    this.faces.R[8] = this.faces.D[6];
    
    this.faces.D[6] = this.faces.L[0];
    this.faces.D[7] = this.faces.L[3];
    this.faces.D[8] = this.faces.L[6];
    
    this.faces.L[0] = temp[2];
    this.faces.L[3] = temp[1];
    this.faces.L[6] = temp[0];
  }

  BPrime() {
    this.B();
    this.B();
    this.B();
  }

  executeMove(move) {
    switch(move) {
      case 'F': this.F(); break;
      case "F'": this.FPrime(); break;
      case 'R': this.R(); break;
      case "R'": this.RPrime(); break;
      case 'U': this.U(); break;
      case "U'": this.UPrime(); break;
      case 'D': this.D(); break;
      case "D'": this.DPrime(); break;
      case 'L': this.L(); break;
      case "L'": this.LPrime(); break;
      case 'B': this.B(); break;
      case "B'": this.BPrime(); break;
    }
  }

  isSolved() {
    return Object.values(this.faces).every(face => 
      face.every(square => square === face[0])
    );
  }

  scramble(moves = 20) {
    const possibleMoves = ['F', "F'", 'R', "R'", 'U', "U'", 'D', "D'", 'L', "L'", 'B', "B'"];
    const scrambleMoves = [];
    
    for (let i = 0; i < moves; i++) {
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      scrambleMoves.push(randomMove);
      this.executeMove(randomMove);
    }
    
    return scrambleMoves;
  }
}