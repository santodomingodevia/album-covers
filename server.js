import express from 'express';
import { validateAlbumName, fetchCoverImage } from './lib/coverPrompt.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/generate-cover', async (req, res) => {
  const name = (req.body?.name || '').trim();
  const genre = (req.body?.genre || '').trim();

  const validationError = validateAlbumName(name);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const cover = await fetchCoverImage(name, genre);
    res.json(cover);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Error generando la imagen.' });
  }
});

app.listen(PORT, () => {
  console.log(`Album cover generator corriendo en http://localhost:${PORT}`);
});
