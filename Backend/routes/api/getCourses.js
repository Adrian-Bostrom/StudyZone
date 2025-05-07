import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
  const coursesFilePath = path.join(__dirname, "../../database/af808abb-ebf9-4c70-bbbf-07d392b1c86f/course.json");

  fs.readFile(coursesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read courses data' });
    }

    try {
      const coursesData = JSON.parse(data);
      res.json(coursesData);
    } catch (parseError) {
      res.status(500).json({ error: 'Failed to parse courses data' });
    }
  });
});

export default router;
