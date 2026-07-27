export const GENRE_STYLES = {
  rock: 'gritty high-contrast lighting, raw energetic composition, denim and leather textures, guitar and stage imagery',
  metal: 'dark, dramatic, gothic imagery, intense shadows, molten metal and fire textures',
  electronic: 'neon colors, futuristic, glitch and circuit patterns, synthwave aesthetics',
  hiphop: 'urban environment, bold graphic shapes, streetwear aesthetic, gold and concrete textures',
  pop: 'vibrant saturated colors, glossy modern design, playful shapes',
  jazz: 'vintage smoky atmosphere, warm sepia and amber tones, retro poster style',
  classical: 'elegant minimalist fine art painting style, soft classical lighting, marble and velvet textures',
  reggae: 'warm tropical colors, sun-drenched natural imagery, relaxed island atmosphere',
  folk: 'rustic, nature imagery, earthy tones, hand-crafted textures, wood and linen',
  ambient: 'dreamy ethereal atmosphere, soft abstract clouds and light, pastel tones',
  punk: 'raw, chaotic collage style, high contrast black and white, torn paper textures',
  latin: 'vivid warm colors, festive energetic patterns, tropical and floral motifs',
};

export function validateAlbumName(name) {
  if (!name) return 'Falta el nombre del álbum.';
  if (name.length > 200) return 'El nombre es demasiado largo.';
  return null;
}

export function buildCoverImageUrl(name, genre) {
  const genreStyle = GENRE_STYLES[genre];

  const prompt = `Abstract symbolic artwork evoking the concept of ${name}, ` +
    `professional album cover art, painterly or photographic style, square format, purely visual imagery` +
    (genreStyle ? `, ${genreStyle}` : '') + '.';
  const negativePrompt = 'text, words, letters, numbers, typography, title, caption, logo, watermark, signature';

  const seed = Math.floor(Math.random() * 1_000_000_000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=1024&height=1024&nologo=true&seed=${seed}&negative_prompt=${encodeURIComponent(negativePrompt)}`;
}

export async function fetchCoverImage(name, genre) {
  const imageUrl = buildCoverImageUrl(name, genre);
  const response = await fetch(imageUrl);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Pollinations API error: ${response.status} ${errText}`);
  }

  const mimeType = response.headers.get('content-type') || 'image/jpeg';
  const buffer = Buffer.from(await response.arrayBuffer());
  return { mimeType, data: buffer.toString('base64') };
}
