import { useEffect, useRef, useState } from 'react';
import { calculateDimensions, formatDimension } from '../utils/dimensionUtils';

const Shape = ({ 
  shape, 
  isSelected, 
  showAnnotations, 
  onClick, 
  onUpdate 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isDraggingEndpoint, setIsDraggingEndpoint] = useState(null);
  const [initialRotation, setInitialRotation] = useState(0);
  const [initialAngle, setInitialAngle] = useState(0);
  const shapeRef = useRef(null);
  
  const { type, id } = shape;
  
  // Calculate dimensions for annotations
  const dimensions = calculateDimensions(shape);
  
  // Calculate rotation center
  const getRotationCenter = () => {
    if (type === 'line') {
      return {
        x: (shape.x1 + shape.x2) / 2,
        y: (shape.y1 + shape.y2) / 2
      };
    } else if (type === 'rectangle') {
      return {
        x: shape.x + shape.width / 2,
        y: shape.y + shape.height / 2
      };
    } else if (type === 'circle') {
      return { x: shape.cx, y: shape.cy };
    }
    return { x: 0, y: 0 };
  };

  // Handle pointer events (mouse and touch)
  useEffect(() => {
    if (!onUpdate || !isSelected) return;
    
    const handlePointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      
      if (!clientX || !clientY) return;
      
      if (isDraggingEndpoint) {
        const rect = shapeRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        if (isDraggingEndpoint === 'start') {
          onUpdate({ x1: x, y1: y });
        } else if (isDraggingEndpoint === 'end') {
          onUpdate({ x2: x, y2: y });
        }
        return;
      }
      
      if (isDragging) {
        const dx = e.movementX || (e.touches ? clientX - position.x : e.movementX);
        const dy = e.movementY || (e.touches ? clientY - position.y : e.movementY);
        
        setPosition({ x: clientX, y: clientY });
        
        const updates = {};
        if (type === 'line') {
          updates.x1 = shape.x1 + dx;
          updates.y1 = shape.y1 + dy;
          updates.x2 = shape.x2 + dx;
          updates.y2 = shape.y2 + dy;
        } else if (type === 'rectangle') {
          updates.x = shape.x + dx;
          updates.y = shape.y + dy;
        } else if (type === 'circle') {
          updates.cx = shape.cx + dx;
          updates.cy = shape.cy + dy;
        }
        
        onUpdate(updates);
      }
      
      if (isRotating) {
        const center = getRotationCenter();
        const rect = shapeRef.current.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        
        const newAngle = Math.atan2(mouseY - center.y, mouseX - center.x) * 180 / Math.PI;
        const rotation = initialRotation + (newAngle - initialAngle);
        onUpdate({ rotation });
      }
    };
    
    const handlePointerUp = () => {
      setIsDragging(false);
      setIsRotating(false);
      setIsDraggingEndpoint(null);
    };
    
    if (isDragging || isRotating || isDraggingEndpoint) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchend', handlePointerUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, isRotating, isDraggingEndpoint, shape, type, onUpdate, position, initialRotation, initialAngle]);
  
  const handlePointerDown = (e) => {
    if (e.ctrlKey && onClick) {
      onClick();
      return;
    }
    
    // Prevent touch events from scrolling
    if (e.type === 'touchstart') {
      e.preventDefault();
    }
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    setPosition({ x: clientX, y: clientY });
    
    if (isSelected && onUpdate) {
      e.stopPropagation();
      
      // Check if rotation handle was clicked
      if (e.target.classList.contains('rotation-handle')) {
        const center = getRotationCenter();
        const rect = shapeRef.current.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        const angle = Math.atan2(mouseY - center.y, mouseX - center.x) * 180 / Math.PI;
        
        setInitialRotation(shape.rotation || 0);
        setInitialAngle(angle);
        setIsRotating(true);
        return;
      }
      
      // Check if line endpoint was clicked
      if (type === 'line' && e.target.classList.contains('endpoint')) {
        const endpoint = e.target.getAttribute('data-endpoint');
        setIsDraggingEndpoint(endpoint);
        return;
      }
      
      // Otherwise, start dragging
      setIsDragging(true);
    } else if (onClick) {
      onClick();
    }
  };
  
  // Render rotation handle
  const renderRotationHandle = () => {
    if (!isSelected) return null;
    
    const center = getRotationCenter();
    const rotation = shape.rotation || 0;
    const size = 30;
    const handleX = center.x;
    const handleY = center.y - size - 20;
    
    return (
      <g transform={`rotate(${rotation} ${center.x} ${center.y})`}>
        <circle
          className="rotation-handle"
          cx={handleX}
          cy={handleY}
          r={8}
          fill="#ff006e"
          stroke="white"
          strokeWidth={2}
          cursor="grab"
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        />
        <line
          x1={center.x}
          y1={center.y}
          x2={handleX}
          y2={handleY}
          stroke="#ff006e"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
      </g>
    );
  };
  
  // Render line endpoints
  const renderLineEndpoints = () => {
    if (type !== 'line' || !isSelected) return null;
    
    return (
      <>
        <circle
          className="endpoint"
          data-endpoint="start"
          cx={shape.x1}
          cy={shape.y1}
          r={8}
          fill="#3a86ff"
          stroke="white"
          strokeWidth={2}
          cursor="move"
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        />
        <circle
          className="endpoint"
          data-endpoint="end"
          cx={shape.x2}
          cy={shape.y2}
          r={8}
          fill="#ff006e"
          stroke="white"
          strokeWidth={2}
          cursor="move"
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        />
      </>
    );
  };
  
  // Render the appropriate SVG element based on shape type
  const renderShape = () => {
    const commonProps = {
      ref: shapeRef,
      onMouseDown: handlePointerDown,
      onTouchStart: handlePointerDown,
      style: { cursor: isSelected ? 'move' : 'pointer' }
    };
    
    const styleProps = {
      stroke: isSelected ? '#ff006e' : shape.stroke || '#333',
      strokeWidth: shape.strokeWidth || 2,
      fill: shape.fill || 'none'
    };
    
    const rotation = shape.rotation || 0;
    const rotationCenter = getRotationCenter();
    
    switch (type) {
      case 'line':
        return (
          <g transform={`rotate(${rotation} ${rotationCenter.x} ${rotationCenter.y})`}>
            <line
              {...commonProps}
              x1={shape.x1}
              y1={shape.y1}
              x2={shape.x2}
              y2={shape.y2}
              {...styleProps}
            />
          </g>
        );
      case 'rectangle':
        return (
          <g transform={`rotate(${rotation} ${rotationCenter.x} ${rotationCenter.y})`}>
            <rect
              {...commonProps}
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              {...styleProps}
            />
          </g>
        );
      case 'circle':
        return (
          <g transform={`rotate(${rotation} ${rotationCenter.x} ${rotationCenter.y})`}>
            <circle
              {...commonProps}
              cx={shape.cx}
              cy={shape.cy}
              r={shape.r}
              {...styleProps}
            />
          </g>
        );
      default:
        return null;
    }
  };
  
  // Render annotations
  const renderAnnotations = () => {
    if (!showAnnotations || !dimensions) return null;
    
    return (
      <>
        {dimensions.map((dim, index) => (
          <text
            key={`${id}-dim-${index}`}
            x={dim.x}
            y={dim.y}
            textAnchor="middle"
            fill="#555"
            fontSize="10"
            fontWeight="bold"
            pointerEvents="none"
          >
            {formatDimension(dim.value)}
          </text>
        ))}
      </>
    );
  };
  
  return (
    <>
      {renderShape()}
      {renderAnnotations()}
      {renderLineEndpoints()}
      {renderRotationHandle()}
    </>
  );
};

export default Shape;