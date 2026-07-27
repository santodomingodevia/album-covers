const form = document.getElementById('cover-form');
const nameInput = document.getElementById('album-name');
const genreSelect = document.getElementById('genre-select');
const generateBtn = document.getElementById('generate-btn');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const coverImage = document.getElementById('cover-image');
const downloadLink = document.getElementById('download-link');

function setStatus(message, isError = false) {
  statusEl.hidden = !message;
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const genre = genreSelect.value;
  if (!name) return;

  generateBtn.disabled = true;
  resultEl.hidden = true;
  setStatus('Generando tapa...');

  try {
    const response = await fetch('/api/generate-cover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, genre }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error generando la tapa.');
    }

    const src = `data:${data.mimeType};base64,${data.data}`;
    coverImage.src = src;
    downloadLink.href = src;
    downloadLink.download = `tapa-${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`;
    resultEl.hidden = false;
    setStatus('');
  } catch (err) {
    setStatus(err.message, true);
  } finally {
    generateBtn.disabled = false;
  }
});
