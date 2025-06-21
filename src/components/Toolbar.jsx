import { FaCircle, FaEye, FaEyeSlash, FaFileExport, FaFileImport, FaMobile, FaMousePointer, FaPencilRuler, FaTrash, FaVectorSquare } from 'react-icons/fa';

const Toolbar = ({ 
  currentTool, 
  onToolChange, 
  showAnnotations, 
  setShowAnnotations,
  onClearAll,
  onExport,
  onImport
}) => {
  const tools = [
    { id: 'select', label: 'Select', icon: <FaMousePointer /> },
    { id: 'line', label: 'Line', icon: <FaPencilRuler /> },
    { id: 'rectangle', label: 'Rectangle', icon: <FaVectorSquare /> },
    { id: 'circle', label: 'Circle', icon: <FaCircle /> },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedShapes = JSON.parse(event.target.result);
          onImport(importedShapes);
        } catch (error) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="toolbar">
      <div className="tool-section">
        <h3>Drawing Tools</h3>
        <div className="tools">
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`tool-btn ${currentTool === tool.id ? 'active' : ''}`}
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
            >
              {tool.icon}
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tool-section">
        <h3>View Options</h3>
        <button
          className={`tool-btn ${!showAnnotations ? 'active' : ''}`}
          onClick={() => setShowAnnotations(!showAnnotations)}
          title={showAnnotations ? "Hide Annotations" : "Show Annotations"}
        >
          {showAnnotations ? <FaEyeSlash /> : <FaEye />}
          <span>{showAnnotations ? "Hide Dimensions" : "Show Dimensions"}</span>
        </button>
      </div>

      <div className="tool-section">
        <h3>Project</h3>
        <button className="tool-btn" onClick={onClearAll} title="Clear All">
          <FaTrash />
          <span>Clear All</span>
        </button>
        
        <button className="tool-btn" onClick={onExport} title="Export">
          <FaFileExport />
          <span>Export</span>
        </button>
        
        <label className="tool-btn import-btn" title="Import">
          <FaFileImport />
          <span>Import</span>
          <input 
            type="file" 
            accept=".json" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
        </label>
      </div>
      
      <div className="mobile-notice">
        <FaMobile />
        <p>Drag endpoints to edit lines. Drag rotation handles to rotate shapes.</p>
      </div>
    </div>
  );
};

export default Toolbar;