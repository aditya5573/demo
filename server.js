const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS)
app.use(express.static(__dirname));

// Folder directory path
const FOLDERS_DIR = path.join(__dirname, 'folders');

// Utility to get first 10 words of README.md
function getShortDescription(folderPath) {
  const readmePath = path.join(folderPath, 'README.md');
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf-8');
    const words = content.split(/\s+/).slice(0, 10).join(' ');
    return words + '...';
  }
  return 'No description available.';
}

// API: Get folder list with descriptions
app.get('/api/folders', (req, res) => {
  const folders = fs.readdirSync(FOLDERS_DIR).filter(name => 
    fs.statSync(path.join(FOLDERS_DIR, name)).isDirectory()
  );

  const folderData = folders.map(folder => {
    const folderPath = path.join(FOLDERS_DIR, folder);
    return {
      name: folder,
      description: getShortDescription(folderPath),
    };
  });

  res.json(folderData);
});

// API: Get README.md content for a folder
app.get('/api/readme', (req, res) => {
  const folderName = req.query.folder;
  const readmePath = path.join(FOLDERS_DIR, folderName, 'README.md');

  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf-8');
    res.send(content);
  } else {
    res.status(404).send('README.md not found.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
