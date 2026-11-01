# Mesa de Encantos

Test de personalidad: **¿qué encantamiento de Minecraft eres?** 50 preguntas dentro de un libro flotante sobre una mesa de encantamientos 3D, 14 resultados, columnas de luz con tu porcentaje y tarjeta descargable.
Hecho con cariño por KitsukiLove. Español. Sin dependencias ni CDN: todo es local (música y sonidos se sintetizan en el navegador).

## Publicar en GitHub Pages
1. Sube **todo el contenido de esta carpeta** a un repositorio nuevo (la raíz debe tener `index.html`).
2. Settings → Pages → *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
3. Las fuentes ya están en `fonts/`.

Para probar en tu PC: `python3 -m http.server` dentro de la carpeta y abre `http://localhost:8000`.

## Cómo se juega
1. Toca el libro que flota sobre la mesa. La cámara se acerca, el libro se abre y las preguntas aparecen en sus páginas.
2. Hay 4 formatos mezclados: escenario (4 opciones), A o B, elegir un objeto y escala de orbes (qué tanto te describe).
3. Al terminar, el libro se cierra, hace el ritual de encantamiento y queda girando con tu encantamiento en la portada. Las 14 columnas muestran tu afinidad (la más alta es tu resultado). El panel de pergamino tiene Tú / Fortalezas / Combina / Todos.

## Cómo funciona la puntuación
- Siete rasgos inspirados en el Big Five: **C** constancia, **O** curiosidad, **E** energía, **A** cuidado, **F** firmeza, **K** calma, **R** reserva.
- Cada respuesta da 2 puntos a un rasgo y 1 a otro; cada orbe da 0 a 2 puntos a su rasgo (algunas preguntas van invertidas).
- Cada encantamiento es la mezcla de dos rasgos (`tools/build_data.py`, tabla `PROF`). Los puntos se pasan a z-score y se suman; un pequeño ajuste por encantamiento (calibrado por simulación) hace que cada uno salga ~7 % de las veces.
- El nivel (I a V) sale de qué tan marcada es tu afinidad respecto a miles de respuestas simuladas.

## Editar preguntas o resultados
- Preguntas: `data/preguntas50.json`. Cada respuesta es `["texto","XY"]`: 2 puntos al rasgo X y 1 al Y. Las orbes llevan `"t"` (rasgo) y opcional `"rev":true`.
- Resultados: `data/resultados.json`.
- Después ejecuta (necesita Python 3 y numpy): `python3 tools/build_data.py` — recalcula la calibración y genera `js/data.js`.
- Íconos pixel: `tools/build_icons.py` (genera `js/icons.js`). La versión anterior (70 preguntas) quedó en `data/_v1/`.

## Archivos
```
index.html            página (sin ventanas: HUD, páginas del libro, panel de resultado)
css/style.css         estilo Pixel y Kixki XP, claro/oscuro
js/engine.js          motor 3D en WebGL (propio, sin Three.js)
js/scene.js           mesa, libro, ritual, columnas, Kixki, cámara y proyección de las páginas
js/audio.js           música "vacío" y efectos sintetizados (Web Audio)
js/fallback2d.js      escena 2D si el dispositivo no tiene WebGL
js/app.js             flujo, puntuación, páginas, resultado, ajustes
js/card.js            tarjeta PNG para compartir
js/data.js, icons.js  generados por tools/ (no editar a mano)
```

## Notas
- Sonido: empieza con el primer toque; botón de silencio y ajustes de volumen. Se pausa al cambiar de pestaña.
- Respeta `prefers-reduced-motion` y baja la resolución sola si el equipo va lento.
- Teclas: `1–5` eligen (según el formato), `←` o `Retroceso` vuelven.
- El progreso se guarda en el navegador (si está permitido); sin almacenamiento el test funciona igual.
- Es entretenimiento, no un diagnóstico psicológico.
