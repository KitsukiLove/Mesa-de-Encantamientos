# Mesa de Encantos

Test de personalidad: **¿qué encantamiento de Minecraft eres?**
50 preguntas dentro de un libro flotante sobre una mesa de encantamientos 3D (WebGL propio, sin librerías). Estilo KixKi Store (Pixel / Encantado).

Sitio estático: sin build, sin dependencias. Funciona en GitHub Pages.

## Publicar
1. Sube todo el contenido de esta carpeta a la raíz de un repo.
2. Settings → Pages → Deploy from branch → `main` / `(root)`.

Prueba local: `python3 -m http.server` y abre `http://localhost:8000`.

## Estructura
```
index.html
css/style.css
js/mesa_encantos.js   ← EL TEST (preguntas, encantamientos, calibración, calcularResultado)
js/app.js             ← lógica, adaptador de datos, resultado
js/scene.js           ← escena 3D (mesa, libro, columnas, KixKi)
js/engine.js          ← motor WebGL
js/fallback2d.js      ← versión 2D si no hay WebGL
js/audio.js           ← música y efectos sintetizados (Web Audio)
js/card.js            ← tarjeta PNG para compartir
js/icons.js           ← iconos pixel de los 8 encantamientos
fonts/                ← Pixelify Sans, Jersey 10
```

## Editar el test
Todo el contenido vive en `js/mesa_encantos.js`. Para cambiar preguntas, textos o puntuación, reemplaza ese archivo; no hay que tocar nada más.

- **8 encantamientos:** reparacion, irrompibilidad, fortuna, eficiencia, filo, proteccion, toque_de_seda, espinas.
- **Si añades un encantamiento nuevo** (id nuevo) necesita: un icono en `js/icons.js` y un color en `COLORS` al inicio de `js/app.js`.
- Tipos de pregunta: `Escenario`, `A o B`, `Elige un objeto`, `Escala de orbes`.
- El orden de las preguntas es el del archivo; solo se mezclan las opciones.

## Resultado interactivo
En el resultado puedes tocar los iconos flotantes, las columnas 3D o las barras de la pestaña «Todos» para ver cualquier otro encantamiento (sin rasgos). El libro gira y cambia de emblema. «Volver a mi resultado» o la tecla Esc regresan al tuyo.

## Calidad 3D
Ajustes → Calidad 3D: **Pixel grueso** (el original, más ligero), **Pixel fino** (predeterminado: más resolución, brillo suave, haces de luz, niebla baja y polvo) y **Nítido** (resolución completa y bordes suaves). Si el equipo va lento, la escena baja sola de nivel. Los parámetros están en `QUAL` al inicio de `js/scene.js`.

## KixKi
KixKi es la oveja con sombrero de mago. Mira hacia el cursor, camina por la sala, salta (con «boing») y se pone a dormir con «Zzz» si no haces nada un rato. Tócala para despertarla. En el resultado se pone un accesorio según el encantamiento que estés viendo (yunque, escudo, trébol, pico, espada, escudo azul, seda, cactus) y dice una frase distinta. Con «Movimiento reducido» solo se queda quieta y se alegra. Su lógica está en `stepKixki` y `drawKixki` de `js/scene.js` y sus frases en `KX` de `js/app.js`.

## La oveja escondida
En cada partida aparece una ovejita diminuta y casi transparente en una página, en una pregunta al azar. Si la tocas, KixKi lo celebra y en el resultado (pestaña «Todos», debajo de los rasgos) aparece **Curiosidad +1**. Va aparte y no cambia el ranking ni la puntuación. Se guarda en la partida (`run.egg`).

## Puntuación
`calcularResultado(respuestas)` suma puntos por rasgo (C, O, E, A, F, K, R), los normaliza con z-scores (`calibracion`), aplica el `ajuste` de cada encantamiento y devuelve principal, secundario, `casiEmpate`, rasgos y ranking. Las orbes valen `pesoOrbes` veces; las `invertida` puntúan al revés.

## Guardado
El progreso se guarda en `localStorage` (prefijo `mesa3.`). Nada sale del navegador.
