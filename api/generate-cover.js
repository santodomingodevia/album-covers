import { validateAlbumName, fetchCoverImage } from '../lib/coverPrompt.js';

export const config = { maxDuration: 45 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const name = (req.body?.name || '').trim();
  const genre = (req.body?.genre || '').trim();

  const validationError = validateAlbumName(name);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const cover = await fetchCoverImage(name, genre);
    res.status(200).json(cover);
  } catch (err) {
    console.error(err);
    const message = err.status === 429
      ? 'El servicio de generación está saturado ahora mismo. Probá de nuevo en unos segundos.'
      : 'Error generando la imagen.';
    res.status(502).json({ error: message });
  }
}
