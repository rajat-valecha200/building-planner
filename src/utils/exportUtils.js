export const exportToJSON = (shapes) => {
  const dataStr = JSON.stringify(shapes, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileDefaultName = 'building-plan.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedShapes = JSON.parse(event.target.result);
        resolve(importedShapes);
      } catch (error) {
        reject('Invalid file format');
      }
    };
    reader.onerror = () => reject('Error reading file');
    reader.readAsText(file);
  });
};