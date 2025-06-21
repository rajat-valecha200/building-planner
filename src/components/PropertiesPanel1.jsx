
const PropertiesPanel = ({ shape, onUpdate, onDelete }) => {
  if (!shape) return null;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this shape?')) {
      onDelete(shape.id);
    }
  };
  
  return (
    <div className="properties-panel">
      <h3>Shape Properties</h3>
      
      <div className="property-group">
        <label>Type</label>
        <div className="shape-type">{shape.type}</div>
      </div>
      
      {shape.type === 'line' && (
        <>
          <div className="property-group">
            <label>Start X</label>
            <input
              type="number"
              name="x1"
              value={shape.x1}
              onChange={handleChange}
            />
          </div>
          <div className="property-group">
            <label>Start Y</label>
            <input
              type="number"
              name="y1"
              value={shape.y1}
              onChange={handleChange}
            />
          </div>
          <div className="property-group">
            <label>End X</label>
            <input
              type="number"
              name="x2"
              value={shape.x2}
              onChange={handleChange}
            />
          </div>
          <div className="property-group">
            <label>End Y</label>
            <input
              type="number"
              name="y2"
              value={shape.y2}
              onChange={handleChange}
            />
          </div>
        </>
      )}
      
      {shape.type === 'rectangle' && (
        <>
          <div className="property-group">
            <label>X Position</label>
            <input
              type="number"
              name="x"
              value={shape.x}
              onChange={handleChange}
            />
          </div>
          <div className="property-group">
            <label>Y Position</label>
            <input
              type="number"
              name="y"
              value={shape.y}
              onChange={handleChange}
            />
          </div>
          <div className="property-group">
            <label>Width</label>
            <input
              type="number"
              name="width"
              value={shape.width}
              onChange={handleChange}
              min="1"
            />
          </div>
          <div className="property-group">
            <label>Height</label>
            <input
              type="number"
              name="height"
              value={shape.height}
              onChange={handleChange}
              min="1"
            />
          </div>
        </>
      )}
      
      {shape.type === 'circle' && (
        <>
          <div className="property-group">
            <label>Center X</label>
            <input
              type="number"
              name="cx"
              value={shape.cx}
              onChange={handleChange}
            />
          </div>
          <div className="property-group">
            <label>Center Y</label>
            <input
              type="number"
              name="cy"
              value={shape.cy}
              onChange={handleChange}
            />
          </div>
          <div className="property-group">
            <label>Radius</label>
            <input
              type="number"
              name="r"
              value={shape.r}
              onChange={handleChange}
              min="1"
            />
          </div>
        </>
      )}
      
      <div className="property-group">
        <label>Stroke Color</label>
        <input
          type="color"
          name="stroke"
          value={shape.stroke || '#333333'}
          onChange={handleChange}
        />
      </div>
      
      <div className="property-group">
        <label>Stroke Width</label>
        <input
          type="range"
          name="strokeWidth"
          value={shape.strokeWidth || 2}
          min="1"
          max="10"
          onChange={handleChange}
        />
      </div>
      
      <div className="property-actions">
        <button className="delete-btn" onClick={handleDelete}>
          Delete Shape
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;