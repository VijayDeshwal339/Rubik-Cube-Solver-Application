export function getCubeSvg(cubeString) {
  
  const colorMap = {
    'w': '#FFFFFF', // White
    'r': '#FF0000', // Red
    'b': '#0000FF', // Blue
    'o': '#FFA500', // Orange
    'g': '#00FF00', // Green
    'y': '#FFFF00'  // Yellow
  };

  const faces = {
    F: cubeString.slice(0, 9),   // Front
    B: cubeString.slice(9, 18),  // Back
    L: cubeString.slice(18, 27), // Left
    R: cubeString.slice(27, 36), // Right
    U: cubeString.slice(36, 45), // Up
    D: cubeString.slice(45, 54)  // Down
  };

  const svgWidth = 400;
  const svgHeight = 300;
  const faceSize = 60;
  const squareSize = 18;
  const gap = 2;

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
  
  svg += `<rect width="${svgWidth}" height="${svgHeight}" fill="#f0f0f0"/>`;

  function drawFace(face, x, y, colors) {
    let faceElements = '';
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const squareX = x + col * (squareSize + gap);
      const squareY = y + row * (squareSize + gap);
      const color = colorMap[colors[i]] || '#CCCCCC';
      
      faceElements += `<rect x="${squareX}" y="${squareY}" width="${squareSize}" height="${squareSize}" 
                       fill="${color}" stroke="#333" stroke-width="1"/>`;
    }
    return faceElements;
  }

  svg += drawFace('U', 120, 20, faces.U);
  
  svg += drawFace('L', 20, 80, faces.L);
  svg += drawFace('F', 120, 80, faces.F);
  svg += drawFace('R', 220, 80, faces.R);
  svg += drawFace('B', 320, 80, faces.B);
  
  svg += drawFace('D', 120, 140, faces.D);

  svg += `<text x="150" y="15" text-anchor="middle" font-size="12" font-weight="bold">U</text>`;
  svg += `<text x="50" y="75" text-anchor="middle" font-size="12" font-weight="bold">L</text>`;
  svg += `<text x="150" y="75" text-anchor="middle" font-size="12" font-weight="bold">F</text>`;
  svg += `<text x="250" y="75" text-anchor="middle" font-size="12" font-weight="bold">R</text>`;
  svg += `<text x="350" y="75" text-anchor="middle" font-size="12" font-weight="bold">B</text>`;
  svg += `<text x="150" y="195" text-anchor="middle" font-size="12" font-weight="bold">D</text>`;

  svg += '</svg>';
  
  return svg;
}