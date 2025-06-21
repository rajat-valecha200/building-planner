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
  const shapeRef = useRef(null);
  
  const { type, id } = shape;
  
  // Calculate dimensions for annotations
  const dimensions = calculateDimensions(shape);
  
  // Handle dragging
  useEffect(() => {
    if (!onUpdate || !isSelected) return;
    
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      setPosition(prev => {
        const dx = e.movementX;
        const dy = e.movementY;
        
        const newPosition = { 
          x: prev.x + dx, 
          y: prev.y + dy 
        };
        
        // Update the shape position
        if (type === 'line') {
          onUpdate({
            x1: shape.x1 + dx,
            y1: shape.y1 + dy,
            x2: shape.x2 + dx,
            y2: shape.y2 + dy
          });
        } else if (type === 'rectangle') {
          onUpdate({
            x: shape.x + dx,
            y: shape.y + dy
          });
        } else if (type === 'circle') {
          onUpdate({
            cx: shape.cx + dx,
            cy: shape.cy + dy
          });
        }
        
        return newPosition;
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, shape, type, onUpdate]);
  
  const handleMouseDown = (e) => {
    if (e.ctrlKey && onClick) {
      onClick();
      return;
    }
    
    if (isSelected && onUpdate) {
      e.stopPropagation();
      setIsDragging(true);
    } else if (onClick) {
      onClick();
    }
  };
  
  // Render the appropriate SVG element based on shape type
  const renderShape = () => {
    const commonProps = {
      ref: shapeRef,
      onMouseDown: handleMouseDown,
      style: { cursor: isSelected ? 'move' : 'pointer' }
    };
    
    const styleProps = {
      stroke: isSelected ? '#ff006e' : shape.stroke || '#333',
      strokeWidth: shape.strokeWidth || 2,
      fill: shape.fill || 'none'
    };
    
    switch (type) {
      case 'line':
        return (
          <line
            {...commonProps}
            x1={shape.x1}
            y1={shape.y1}
            x2={shape.x2}
            y2={shape.y2}
            {...styleProps}
          />
        );
      case 'rectangle':
        return (
          <rect
            {...commonProps}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            {...styleProps}
          />
        );
      case 'circle':
        return (
          <circle
            {...commonProps}
            cx={shape.cx}
            cy={shape.cy}
            r={shape.r}
            {...styleProps}
          />
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
    </>
  );
};

export default Shape;