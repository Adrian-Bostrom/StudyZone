const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/deadlines', (req, res) => {
  console.log("Received deadlines:", req.body);
  res.sendStatus(200);
});

app.post('/scripts', (req, res) => {
  const favoritedOnly = req.body.filter(entry => entry.isFavorited === true);

  const filteredCourses = favoritedOnly.map(entry => ({
    shortName: entry.shortName,
    id: entry.id,
    enrollmentState: entry.enrollmentState
  }));

  console.log("Received script JSON data:", filteredCourses);
  res.sendStatus(200);
});

app.post('/favorites', (req, res) => {
  console.log("Received favorite course URLs:", req.body);
  res.sendStatus(200);
});

// New /log route to handle assignment logs
app.post('/log', (req, res) => {
  console.log("Received assignment log:", req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
