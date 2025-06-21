import { forwardRef, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Grid from './Grid';
import Shape from './Shape1';

const DrawingArea = forwardRef(({
  tool,
  shapes,
  selectedShape,
  showAnnotations,
  tempShape,
  isDrawing,
  onShapeCreate,
  onShapeSelect,
  onShapeUpdate,
  onShapeDelete,
  setTempShape,
  setIsDrawing
}, ref) => {
  const handleMouseDown = useCallback((e) => {
    if (tool === 'select') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    setIsDrawing(true);
    
    if (tool === 'line') {
      setTempShape({
        id: 'temp',
        type: 'line',
        x1: startX,
        y1: startY,
        x2: startX,
        y2: startY,
        stroke: '#3a86ff',
        strokeWidth: 2
      });
    } else if (tool === 'rectangle') {
      setTempShape({
        id: 'temp',
        type: 'rectangle',
        x: startX,
        y: startY,
        width: 0,
        height: 0,
        fill: 'rgba(58, 134, 255, 0.2)',
        stroke: '#3a86ff',
        strokeWidth: 2
      });
    } else if (tool === 'circle') {
      setTempShape({
        id: 'temp',
        type: 'circle',
        cx: startX,
        cy: startY,
        r: 0,
        fill: 'rgba(58, 134, 255, 0.2)',
        stroke: '#3a86ff',
        strokeWidth: 2
      });
    }
  }, [tool, setIsDrawing, setTempShape]);

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing || !tempShape) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    if (tool === 'line') {
      setTempShape({
        ...tempShape,
        x2: currentX,
        y2: currentY
      });
    } else if (tool === 'rectangle') {
      setTempShape({
        ...tempShape,
        width: currentX - tempShape.x,
        height: currentY - tempShape.y
      });
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(currentX - tempShape.cx, 2) + 
        Math.pow(currentY - tempShape.cy, 2)
      );
      setTempShape({
        ...tempShape,
        r: radius
      });
    }
  }, [isDrawing, tempShape, tool, setTempShape]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !tempShape) return;
    
    setIsDrawing(false);
    
    // Create the final shape
    const finalShape = { ...tempShape, id: uuidv4() };
    
    // Set default styles
    if (tool === 'line') {
      finalShape.stroke = '#333';
      finalShape.strokeWidth = 2;
    } else if (tool === 'rectangle' || tool === 'circle') {
      finalShape.fill = 'rgba(255, 255, 255, 0.1)';
      finalShape.stroke = '#333';
      finalShape.strokeWidth = 2;
    }
    
    onShapeCreate(finalShape);
    setTempShape(null);
  }, [isDrawing, tempShape, tool, setIsDrawing, onShapeCreate, setTempShape]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Delete' && selectedShape) {
      onShapeDelete(selectedShape.id);
    }
  }, [selectedShape, onShapeDelete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div 
      ref={ref}
      className="drawing-area"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      tabIndex={0}
    >
      <Grid />
      
      <svg className="drawing-canvas">
        {shapes.map(shape => (
          <Shape
            key={shape.id}
            shape={shape}
            isSelected={selectedShape?.id === shape.id}
            showAnnotations={showAnnotations}
            onClick={() => onShapeSelect(shape.id)}
            onUpdate={(updates) => onShapeUpdate(shape.id, updates)}
          />
        ))}
        {tempShape && (
          <Shape
            shape={tempShape}
            isSelected={false}
            showAnnotations={false}
          />
        )}
      </svg>
    </div>
  );
});

export default DrawingArea;