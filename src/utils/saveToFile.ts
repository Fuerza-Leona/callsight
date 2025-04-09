export const saveToFile = (data: string) => {
  // Retrieve any previous entries from localStorage
  const previousData = localStorage.getItem('videosSubidos') || '';

  // Append new data
  const updatedData = previousData + data + '\n';

  // Save updated data to localStorage (optional for persistence)
  localStorage.setItem('videosSubidos', updatedData);

  // Create a Blob (binary large object) from the text data
  const blob = new Blob([updatedData], { type: 'text/plain' });

  // Create a downloadable link
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'videosSubidos.txt'; // Filename
  a.click();

  // Clean up the object URL to free memory
  URL.revokeObjectURL(a.href);
};
