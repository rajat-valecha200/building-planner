const Grid = () => {
  const size = 20; // Grid size in pixels
  const width = 800;
  const height = 600;
  
  const rows = Math.ceil(height / size);
  const cols = Math.ceil(width / size);
  
  return (
    <div className="grid">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        Array.from({ length: cols }).map((_, colIndex) => (
          <div 
            key={`${rowIndex}-${colIndex}`}
            className="grid-cell"
            style={{
              position: 'absolute',
              left: colIndex * size,
              top: rowIndex * size,
              width: size,
              height: size,
              borderRight: '1px solid rgba(0, 0, 0, 0.05)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
            }}
          />
        ))
      ))}
    </div>
  );
};

export default Grid;