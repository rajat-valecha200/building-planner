import { forwardRef, useCallback, useEffect } from 'react';
import Grid from './Grid';
import Shape from './Shape';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9);

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
  const handlePointerDown = useCallback((e) => {
    // Prevent touch events from scrolling
    if (e.type === 'touchstart') {
      e.preventDefault();
    }
    
    if (tool === 'select') return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (!clientX || !clientY) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = clientX - rect.left;
    const startY = clientY - rect.top;
    
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
        strokeWidth: 2,
        rotation: 0
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
        strokeWidth: 2,
        rotation: 0
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
        strokeWidth: 2,
        rotation: 0
      });
    }
  }, [tool, setIsDrawing, setTempShape]);

  const handlePointerMove = useCallback((e) => {
    if (!isDrawing || !tempShape) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (!clientX || !clientY) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;
    
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

  const handlePointerUp = useCallback(() => {
    if (!isDrawing || !tempShape) return;
    
    setIsDrawing(false);
    
    // Create the final shape
    const finalShape = { ...tempShape, id: generateId() };
    
    // Set default styles
    if (tool === 'line') {
      finalShape.stroke = '#333';
      finalShape.strokeWidth = 2;
      finalShape.rotation = 0;
    } else if (tool === 'rectangle' || tool === 'circle') {
      finalShape.fill = 'rgba(255, 255, 255, 0.1)';
      finalShape.stroke = '#333';
      finalShape.strokeWidth = 2;
      finalShape.rotation = finalShape.rotation || 0;
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
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchCancel={handlePointerUp}
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