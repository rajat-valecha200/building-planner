export const calculateDimensions = (shape) => {
  if (!shape) return [];
  
  switch (shape.type) {
    case 'line':
      const length = Math.sqrt(
        Math.pow(shape.x2 - shape.x1, 2) + 
        Math.pow(shape.y2 - shape.y1, 2)
      );
      return [{
        x: (shape.x1 + shape.x2) / 2,
        y: (shape.y1 + shape.y2) / 2 - 10,
        value: length
      }];
      
    case 'rectangle':
      return [
        {
          x: shape.x + shape.width / 2,
          y: shape.y - 10,
          value: shape.width
        },
        {
          x: shape.x - 10,
          y: shape.y + shape.height / 2,
          value: shape.height
        }
      ];
      
    case 'circle':
      return [
        {
          x: shape.cx,
          y: shape.cy - shape.r - 10,
          value: shape.r * 2
        }
      ];
      
    default:
      return [];
  }
};

export const formatDimension = (value) => {
  return `${Math.round(value)}px`;
};