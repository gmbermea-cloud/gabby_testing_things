const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'snapshots.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all data
app.get('/api/data', (req, res) => {
  res.json(readData());
});

// POST new snapshot
app.post('/api/snapshots', (req, res) => {
  const { date, label, followers, engagement, likes, comments } = req.body;

  if (!date || !followers) {
    return res.status(400).json({ error: 'date and followers are required' });
  }

  const data = readData();
  const id = `snapshot_${Date.now()}`;

  const snapshot = {
    id,
    date,
    label: label || '',
    followers,
    engagement: engagement || {},
    likes: likes || {},
    comments: comments || {}
  };

  data.snapshots.push(snapshot);
  data.snapshots.sort((a, b) => new Date(a.date) - new Date(b.date));

  writeData(data);
  res.json({ success: true, snapshot });
});

// DELETE snapshot
app.delete('/api/snapshots/:id', (req, res) => {
  const data = readData();
  const before = data.snapshots.length;
  data.snapshots = data.snapshots.filter(s => s.id !== req.params.id);

  if (data.snapshots.length === before) {
    return res.status(404).json({ error: 'Snapshot not found' });
  }

  writeData(data);
  res.json({ success: true });
});

// PUT update platform goals
app.put('/api/platforms', (req, res) => {
  const data = readData();
  data.platforms = req.body.platforms;
  writeData(data);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Social Media Tracker running at http://localhost:${PORT}`);
});
