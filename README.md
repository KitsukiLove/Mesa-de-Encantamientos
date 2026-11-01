# Mesa de Encantos

Test de personalidad: **¿qué encantamiento de Minecraft eres?** 70 preguntas, 14 resultados, escena 3D de una mesa de encantamientos con Kixki, barras de porcentaje y tarjeta descargable.
Hecho con cariño por KitsukiLove. Español. Sin dependencias ni CDN: todo es local.

## Publicar en GitHub Pages
1. Sube **todo el contenido de esta carpeta** a un repositorio nuevo (la raíz debe tener `index.html`).
2. Settings → Pages → *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
3. Copia tus fuentes a `fonts/` (ver `fonts/LEEME.txt`).

Para probar en tu PC: `python3 -m http.server` dentro de la carpeta y abre `http://localhost:8000`.

## Cómo funciona la puntuación
- Cada pregunta tiene 4 respuestas. Cada respuesta da **3 puntos** a su encantamiento principal y **1** a uno afín.
- Cada encantamiento es respuesta principal exactamente **20 veces** de 70: ninguno parte con ventaja.
- El ganador sale de los puntos **sobre lo esperado al azar** (así los pequeños desbalances no pesan). Con respuestas al azar, cada encantamiento gana entre 6 % y 8 % de las veces; con afinidad real por uno, lo acierta 84 % (afinidad 40 %) a 97 % (afinidad 55 %).
- El nivel (I a V) indica qué tan marcado es el rasgo. El orden de las preguntas dentro de cada bloque y el de las respuestas se mezcla en cada intento.
- Empates: más respuestas de 3 puntos, luego más puntos totales.

## Editar preguntas o resultados
- Preguntas: `data/preguntas_bloqueN.json` (7 bloques de 10). **No cambies el orden de los campos `enchant`**: deben coincidir con `data/matrix.json`.
- Resultados: `data/resultados.json`.
- Después ejecuta (necesita Python 3):
  ```
  python3 tools/merge_questions.py   # valida y une
  python3 tools/build_data.py        # genera js/data.js
  ```
- Íconos pixel: `tools/build_icons.py` (genera `js/icons.js`).
- Regenerar la matriz de puntos desde cero: `python3 tools/gen_matrix.py` (cambia qué respuesta da qué; tendrías que reescribir las preguntas).

## Archivos
```
index.html            página
css/style.css         estilo Pixel y Kixki XP, claro/oscuro
js/engine.js          motor 3D en WebGL (propio, sin Three.js)
js/scene.js           mesa, libro, cristales, runas, Kixki, cámara
js/fallback2d.js      escena 2D si el dispositivo no tiene WebGL
js/app.js             flujo del test, puntuación, pantallas, ajustes
js/card.js            tarjeta PNG para compartir
js/data.js, icons.js  generados por tools/ (no editar a mano)
data/                 preguntas, resultados, matriz y especificación
```

## Notas
- Respeta `prefers-reduced-motion`, pausa al cambiar de pestaña y baja la resolución sola si el equipo va lento.
- Teclas: `1–4` o `A–D` eligen, `←` o `Retroceso` vuelven.
- El progreso se guarda en el navegador (si está permitido); sin almacenamiento el test funciona igual.
- Es entretenimiento, no un diagnóstico psicológico.
