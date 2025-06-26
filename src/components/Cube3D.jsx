import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, RotateCcw, Move3D } from 'lucide-react';

const Cube3D = ({ cubeString, className = "" }) => {
  const [rotation, setRotation] = useState({ x: -15, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const cubeRef = useRef(null);

  const colorMap = {
    'w': '#FFFFFF', // White
    'r': '#FF0000', // Red
    'b': '#0000FF', // Blue
    'o': '#FFA500', // Orange
    'g': '#00FF00', // Green
    'y': '#FFFF00'  // Yellow
  };

  const faces = {
    F: cubeString.slice(0, 9),   // Front - Red
    B: cubeString.slice(9, 18),  // Back - Orange
    L: cubeString.slice(18, 27), // Left - Green
    R: cubeString.slice(27, 36), // Right - Blue
    U: cubeString.slice(36, 45), // Up - White
    D: cubeString.slice(45, 54)  // Down - Yellow
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, lastMousePos]);

  const renderFace = (faceColors, transform, faceClass = "") => {
    return (
      <div 
        className={`absolute w-48 h-48 grid grid-cols-3 gap-1 p-2 ${faceClass}`}
        style={{ transform }}
      >
        {faceColors.split('').map((color, index) => (
          <div
            key={index}
            className="aspect-square border-2 border-gray-800 rounded-sm shadow-inner"
            style={{ 
              backgroundColor: colorMap[color] || '#CCCCCC',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)'
            }}
          />
        ))}
      </div>
    );
  };

  const resetView = () => {
    setRotation({ x: -15, y: 45 });
  };

  const rotateLeft = () => {
    setRotation(prev => ({ ...prev, y: prev.y - 90 }));
  };

  const rotateRight = () => {
    setRotation(prev => ({ ...prev, y: prev.y + 90 }));
  };

  const rotateUp = () => {
    setRotation(prev => ({ ...prev, x: Math.max(-90, prev.x - 90) }));
  };

  const rotateDown = () => {
    setRotation(prev => ({ ...prev, x: Math.min(90, prev.x + 90) }));
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* 3D Cube Container */}
      <div className="relative mb-6">
        <div 
          ref={cubeRef}
          className="relative w-48 h-48 cursor-grab active:cursor-grabbing select-none"
          style={{
            perspective: '800px',
            transformStyle: 'preserve-3d'
          }}
          onMouseDown={handleMouseDown}
        >
          <div
            className="relative w-full h-full transition-transform duration-300 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
            }}
          >
            {/* Front Face - Red */}
            {renderFace(faces.F, 'translateZ(96px)', 'bg-red-100')}
            
            {/* Back Face - Orange */}
            {renderFace(faces.B, 'translateZ(-96px) rotateY(180deg)', 'bg-orange-100')}
            
            {/* Right Face - Blue */}
            {renderFace(faces.R, 'rotateY(90deg) translateZ(96px)', 'bg-blue-100')}
            
            {/* Left Face - Green */}
            {renderFace(faces.L, 'rotateY(-90deg) translateZ(96px)', 'bg-green-100')}
            
            {/* Top Face - White */}
            {renderFace(faces.U, 'rotateX(90deg) translateZ(96px)', 'bg-gray-100')}
            
            {/* Bottom Face - Yellow */}
            {renderFace(faces.D, 'rotateX(-90deg) translateZ(96px)', 'bg-yellow-100')}
          </div>
        </div>
      </div>

      {/* Rotation Controls */}
      <div className="flex flex-col items-center space-y-3">
        <div className="text-sm text-gray-600 text-center">
          <p className="font-medium">Interactive 3D Cube</p>
          <p>Drag to rotate • Use controls below</p>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {/* Top row */}
          <div></div>
          <button
            onClick={rotateUp}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            title="Rotate Up"
          >
            <RotateCw className="w-4 h-4 transform -rotate-90" />
          </button>
          <div></div>
          
          {/* Middle row */}
          <button
            onClick={rotateLeft}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            title="Rotate Left"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-xs font-medium"
            title="Reset View"
          >
            <Move3D className="w-4 h-4" />
          </button>
          <button
            onClick={rotateRight}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            title="Rotate Right"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          
          {/* Bottom row */}
          <div></div>
          <button
            onClick={rotateDown}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            title="Rotate Down"
          >
            <RotateCw className="w-4 h-4 transform rotate-90" />
          </button>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Cube3D;