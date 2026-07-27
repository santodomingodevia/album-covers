# Generador de Tapas de Álbum

Web simple para generar tapas de álbum con IA a partir de un nombre y un género musical opcional.

**En producción:** https://covers.elsanto.com.ar
**Repo:** https://github.com/santodomingodevia/album-covers

## Cómo funciona

1. El usuario escribe el nombre del álbum y elige un género (opcional).
2. El backend arma un prompt (sin texto/letras, solo imagen) e incluye un estilo visual asociado al género.
3. Se genera la imagen con la API pública y gratuita de [Pollinations.ai](https://pollinations.ai) — no requiere API key ni billing.
4. La imagen se muestra en la página y se puede descargar como PNG/JPEG.

## Estructura del proyecto

```
├── public/              # Frontend estático (HTML/CSS/JS)
│   ├── index.html
│   ├── style.css
│   └── app.js
├── lib/
│   └── coverPrompt.js    # Lógica compartida: prompt, estilos por género, llamada a Pollinations
├── api/
│   └── generate-cover.js # Función serverless de Vercel (producción)
├── server.js             # Servidor Express (solo para desarrollo local)
└── vercel.json            # Fuerza framework: null (ver nota abajo)
```

## Desarrollo local

```bash
npm install
npm start
```

Abrir `http://localhost:3000`.

## Deploy (Vercel)

El proyecto está conectado a Vercel vía GitHub (`santodomingodevia/album-covers`, rama `main`). Cada push a `main` dispara un redeploy automático.

- URL de Vercel: https://album-covers-bice.vercel.app
- Dominio propio: `covers.elsanto.com.ar`, conectado por un registro **CNAME** en el panel DNS de **NIC Argentina** (registrador del dominio `elsanto.com.ar`).
- El dominio raíz `elsanto.com.ar` / `www.elsanto.com.ar` aloja otro sitio (personal) y no se ve afectado por este subdominio.

### Nota sobre `vercel.json`

Vercel auto-detecta este proyecto como una app "Express" (por tener `express` como dependencia y `server.js` con `app.listen`), y por defecto enruta **todo** —incluida la API— a través de `server.js`, ignorando la función serverless dedicada en `api/generate-cover.js` y su configuración de `maxDuration`. Esto causaba errores 404 en el home y timeouts en la API. `vercel.json` con `"framework": null` fuerza el modo "Other" (estático + funciones), que es el comportamiento correcto para este proyecto.

### Reintentos ante rate limit

La API gratuita de Pollinations limita a 1 request en cola por IP en el tier anónimo. Como las funciones de Vercel comparten IPs de salida entre muchos proyectos, esto se dispara más seguido en producción que en desarrollo local. `lib/coverPrompt.js` reintenta automáticamente (hasta 4 intentos, con backoff creciente) ante una respuesta 429 antes de fallar.

## Géneros / estilos disponibles

Rock, Metal, Electrónica, Hip-Hop/Rap, Pop, Jazz, Clásica, Reggae, Folk/Acústico, Ambient/Chill, Punk, Latina — cada uno mapea a un set de palabras clave visuales en `GENRE_STYLES` (`lib/coverPrompt.js`).
