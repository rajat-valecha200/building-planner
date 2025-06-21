import { useRef, useState } from 'react';
import './App.css';
import DrawingArea from './components/DrawingArea1';
import HelpButton from './components/HelpButton';
import PropertiesPanel from './components/PropertiesPanel1';
import Toolbar from './components/Toolbar1';
import { exportToJSON } from './utils/exportUtils';

function App() {
  const [tool, setTool] = useState('select');
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [tempShape, setTempShape] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const drawingAreaRef = useRef(null);

  const handleToolChange = (newTool) => {
    setTool(newTool);
    setSelectedShape(null);
  };

  const handleShapeCreate = (shape) => {
    setShapes([...shapes, shape]);
  };

  const handleShapeSelect = (id) => {
    setSelectedShape(shapes.find(shape => shape.id === id));
  };

  const handleShapeUpdate = (id, updates) => {
    setShapes(shapes.map(shape => 
      shape.id === id ? { ...shape, ...updates } : shape
    ));
    setSelectedShape(prev => prev && prev.id === id ? { ...prev, ...updates } : prev);
  };

  const handleShapeDelete = (id) => {
    setShapes(shapes.filter(shape => shape.id !== id));
    if (selectedShape && selectedShape.id === id) {
      setSelectedShape(null);
    }
  };

  const handleClearAll = () => {
    setShapes([]);
    setSelectedShape(null);
  };

  const handleExport = () => {
    exportToJSON(shapes);
  };

  const handleImport = (importedShapes) => {
    setShapes(importedShapes);
    setSelectedShape(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Building Planner</h1>
            <p>Design your building plans with precision</p>
          </div>
          <HelpButton />
        </div>
      </header>
      
      <div className="app-container">
        <Toolbar 
          currentTool={tool} 
          onToolChange={handleToolChange}
          showAnnotations={showAnnotations}
          setShowAnnotations={setShowAnnotations}
          onClearAll={handleClearAll}
          onExport={handleExport}
          onImport={handleImport}
        />
        
        <div className="main-content">
          <DrawingArea 
            ref={drawingAreaRef}
            tool={tool}
            shapes={shapes}
            selectedShape={selectedShape}
            showAnnotations={showAnnotations}
            tempShape={tempShape}
            isDrawing={isDrawing}
            onShapeCreate={handleShapeCreate}
            onShapeSelect={handleShapeSelect}
            onShapeUpdate={handleShapeUpdate}
            onShapeDelete={handleShapeDelete}
            setTempShape={setTempShape}
            setIsDrawing={setIsDrawing}
          />
          
          {selectedShape && (
            <PropertiesPanel 
              shape={selectedShape}
              onUpdate={handleShapeUpdate}
              onDelete={handleShapeDelete}
            />
          )}
        </div>
      </div>
      
      <footer className="app-footer">
        <p>© 2025 Building Planner by Rajat Valecha </p>
      </footer>
    </div>
  );
}

export default App;