// Mesa de Encantos v2 · datos y cálculo del resultado
// Uso:  const r = calcularResultado(respuestas);
//   respuestas[i] = para preguntas con opciones: índice de la opción elegida (0 = A, 1 = B, ...)
//                   para escalas de orbes: número de 1 a 5
// Devuelve: { principal, secundario, casiEmpate, rasgos:{C:{z,porcentaje},...}, ranking:[...] }

const MESA_ENCANTOS = {
 "version": 2,
 "rasgos": [
  {
   "id": "C",
   "nombre": "Constancia",
   "definicion": "Persistir y terminar lo que empiezas. Orden, cumplimiento, rutinas."
  },
  {
   "id": "O",
   "nombre": "Curiosidad",
   "definicion": "Ganas de explorar, probar cosas nuevas y combinar ideas."
  },
  {
   "id": "E",
   "nombre": "Energía",
   "definicion": "Impulso y entusiasmo. Gusto por la acción y por la gente."
  },
  {
   "id": "A",
   "nombre": "Cuidado",
   "definicion": "Atender a los demás. Empatía, ayuda y cooperación."
  },
  {
   "id": "F",
   "nombre": "Firmeza",
   "definicion": "Decir lo que piensas, poner límites y decidir sin rodeos."
  },
  {
   "id": "K",
   "nombre": "Calma",
   "definicion": "Estabilidad emocional. Recuperarte pronto y no alterarte de más."
  },
  {
   "id": "R",
   "nombre": "Reserva",
   "definicion": "Prudencia y discreción. Anticipar riesgos y guardarte lo tuyo."
  }
 ],
 "preguntas": [
  {
   "n": 1,
   "tipo": "Escenario",
   "texto": "Sábado, 11 de la mañana, cero planes. ¿Qué haces primero?",
   "opciones": [
    {
     "texto": "Lavo unos trastes y cuando me doy cuenta ya reordené el clóset",
     "puntos": {
      "C": 2,
      "R": 1
     }
    },
    {
     "texto": "Salgo sin rumbo y regreso con algo que no pensaba comprar",
     "puntos": {
      "E": 2,
      "O": 1
     }
    },
    {
     "texto": "Sigo en la cama, pero ahora con el celular",
     "puntos": {
      "K": 2,
      "O": 1
     }
    },
    {
     "texto": "Le mando un «¿todo bien?» a alguien que anda raro",
     "puntos": {
      "A": 2,
      "E": 1
     }
    }
   ]
  },
  {
   "n": 2,
   "tipo": "Escala de orbes",
   "texto": "Me agarra la duda de cómo funciona algo y me pongo a investigarlo, aunque nadie me lo haya pedido.",
   "rasgo": "O",
   "invertida": false
  },
  {
   "n": 3,
   "tipo": "A o B",
   "texto": "Tarde de lluvia. ¿Qué prefieres?",
   "opciones": [
    {
     "texto": "Armar algo con las manos sin seguir el instructivo",
     "puntos": {
      "O": 2,
      "C": 1
     }
    },
    {
     "texto": "Una película o un libro, con la puerta cerrada",
     "puntos": {
      "R": 2,
      "K": 1
     }
    }
   ]
  },
  {
   "n": 4,
   "tipo": "Escala de orbes",
   "texto": "Hay días que me levanto con ganas de hacer mil cosas sin que haya pasado nada especial.",
   "rasgo": "E",
   "invertida": false
  },
  {
   "n": 5,
   "tipo": "Escenario",
   "texto": "Se va la luz en toda la cuadra. ¿Qué haces?",
   "opciones": [
    {
     "texto": "Toco puertas para ver que los vecinos estén bien",
     "puntos": {
      "A": 2,
      "C": 1
     }
    },
    {
     "texto": "Salgo a la banqueta a ver qué pasó",
     "puntos": {
      "O": 2,
      "E": 1
     }
    },
    {
     "texto": "Saco la lámpara que dejé lista desde la última vez",
     "puntos": {
      "C": 2,
      "R": 1
     }
    },
    {
     "texto": "Le marco a la CFE hasta que me den una hora de regreso",
     "puntos": {
      "F": 2,
      "C": 1
     }
    }
   ]
  },
  {
   "n": 6,
   "tipo": "Elige un objeto",
   "texto": "Te vas a una isla desierta y solo cabe una cosa en la mochila.",
   "opciones": [
    {
     "texto": "Una navaja multiusos",
     "puntos": {
      "R": 2,
      "C": 1
     }
    },
    {
     "texto": "Una libreta y tres lápices",
     "puntos": {
      "O": 2,
      "R": 1
     }
    },
    {
     "texto": "Una guitarra, aunque la toques mal",
     "puntos": {
      "E": 2,
      "A": 1
     }
    },
    {
     "texto": "Una cobija enorme",
     "puntos": {
      "K": 2,
      "A": 1
     }
    }
   ]
  },
  {
   "n": 7,
   "tipo": "Escala de orbes",
   "texto": "Si empiezo algo, lo termino, aunque ya no me emocione tanto.",
   "rasgo": "C",
   "invertida": false
  },
  {
   "n": 8,
   "tipo": "A o B",
   "texto": "Te traen algo distinto a lo que pediste.",
   "opciones": [
    {
     "texto": "Lo digo ahí mismo, con buena cara",
     "puntos": {
      "F": 2,
      "A": 1
     }
    },
    {
     "texto": "Me lo como; tampoco estaba feo",
     "puntos": {
      "K": 2,
      "A": 1
     }
    }
   ]
  },
  {
   "n": 9,
   "tipo": "Escenario",
   "texto": "Una amiga te cuenta que algo en su vida va mal, pero se nota que no quiere hablar de eso. ¿Qué haces?",
   "opciones": [
    {
     "texto": "Cambio de tema y la llevo a comer algo, sin preguntar",
     "puntos": {
      "A": 2,
      "K": 1
     }
    },
    {
     "texto": "Le digo que cuando quiera hablar, aquí estoy, y me quedo cerca",
     "puntos": {
      "A": 2,
      "R": 1
     }
    },
    {
     "texto": "Le pregunto directo qué pasa; si no dice, insisto otro día",
     "puntos": {
      "F": 2,
      "A": 1
     }
    },
    {
     "texto": "Le dejo espacio; ya llegará ella sola",
     "puntos": {
      "R": 2,
      "K": 1
     }
    }
   ]
  },
  {
   "n": 10,
   "tipo": "Escenario",
   "texto": "Rompes algo que le importaba mucho a alguien.",
   "opciones": [
    {
     "texto": "Lo arreglo yo, aunque me lleve días",
     "puntos": {
      "A": 2,
      "C": 1
     }
    },
    {
     "texto": "Se lo digo antes de que lo descubra",
     "puntos": {
      "F": 2,
      "K": 1
     }
    },
    {
     "texto": "Busco uno igual y lo repongo antes de decir nada",
     "puntos": {
      "R": 2,
      "F": 1
     }
    },
    {
     "texto": "Llego con los pedazos en la mano y un chiste para aflojar el momento",
     "puntos": {
      "E": 2,
      "K": 1
     }
    }
   ]
  },
  {
   "n": 11,
   "tipo": "Escala de orbes",
   "texto": "Antes de decir que sí a un plan, pienso en lo que podría salir mal.",
   "rasgo": "R",
   "invertida": false
  },
  {
   "n": 12,
   "tipo": "Escenario",
   "texto": "Llevas una hora peleándote con un problema y no sale.",
   "opciones": [
    {
     "texto": "Me paro a caminar hasta que se me prenda el foco",
     "puntos": {
      "O": 2,
      "K": 1
     }
    },
    {
     "texto": "Sigo hasta que salga, aunque ya sea de madrugada",
     "puntos": {
      "C": 2,
      "F": 1
     }
    },
    {
     "texto": "Se lo platico a alguien; hablarlo ayuda",
     "puntos": {
      "A": 2,
      "E": 1
     }
    },
    {
     "texto": "Lo dejo para mañana",
     "puntos": {
      "K": 2,
      "R": 1
     }
    }
   ]
  },
  {
   "n": 13,
   "tipo": "Escenario",
   "texto": "En Minecraft, un creeper te vuela media casa.",
   "opciones": [
    {
     "texto": "La reconstruyo igualita, con los planos que ya tenía",
     "puntos": {
      "C": 2,
      "R": 1
     }
    },
    {
     "texto": "La reconstruyo más grande y con otra forma",
     "puntos": {
      "O": 2,
      "E": 1
     }
    },
    {
     "texto": "Salgo a buscar a ese creeper, ya es personal",
     "puntos": {
      "F": 2,
      "E": 1
     }
    },
    {
     "texto": "Miro el hueco y pienso: aquí cabe una alberca",
     "puntos": {
      "K": 2,
      "O": 1
     }
    }
   ]
  },
  {
   "n": 14,
   "tipo": "Escala de orbes",
   "texto": "Cuando fallo, lo primero que pienso es cómo arreglarlo, no lo mal que quedé.",
   "rasgo": "K",
   "invertida": false
  },
  {
   "n": 15,
   "tipo": "A o B",
   "texto": "Prefieres ser alguien que…",
   "opciones": [
    {
     "texto": "siempre cumple lo que prometió",
     "puntos": {
      "C": 2,
      "F": 1
     }
    },
    {
     "texto": "siempre llega cuando se le necesita",
     "puntos": {
      "A": 2,
      "E": 1
     }
    }
   ]
  },
  {
   "n": 16,
   "tipo": "Escala de orbes",
   "texto": "Si algo no me parece, lo digo, aunque incomode.",
   "rasgo": "F",
   "invertida": false
  },
  {
   "n": 17,
   "tipo": "Escenario",
   "texto": "Alguien te cuenta un plan que te parece mala idea.",
   "opciones": [
    {
     "texto": "Le digo lo que pienso desde el primer minuto",
     "puntos": {
      "F": 2,
      "A": 1
     }
    },
    {
     "texto": "Le hago preguntas hasta que se dé cuenta de los huecos",
     "puntos": {
      "R": 2,
      "K": 1
     }
    },
    {
     "texto": "Lo apoyo; quizá yo no veo lo que esa persona sí",
     "puntos": {
      "K": 2,
      "O": 1
     }
    },
    {
     "texto": "Le propongo una versión mejor",
     "puntos": {
      "O": 2,
      "E": 1
     }
    }
   ]
  },
  {
   "n": 18,
   "tipo": "Escala de orbes",
   "texto": "Tengo varios proyectos empezados que ni yo sé en qué quedaron.",
   "rasgo": "C",
   "invertida": true
  },
  {
   "n": 19,
   "tipo": "Escenario",
   "texto": "Tienes una entrega mañana y todavía no abres el archivo.",
   "opciones": [
    {
     "texto": "Me encierro y no paro hasta terminar",
     "puntos": {
      "E": 2,
      "F": 1
     }
    },
    {
     "texto": "Hago una lista y la voy tachando",
     "puntos": {
      "C": 2,
      "R": 1
     }
    },
    {
     "texto": "Respiro, pongo música y confío en que la presión me funciona",
     "puntos": {
      "K": 2,
      "E": 1
     }
    },
    {
     "texto": "Pido más tiempo y explico por qué lo necesito",
     "puntos": {
      "F": 2,
      "A": 1
     }
    }
   ]
  },
  {
   "n": 20,
   "tipo": "A o B",
   "texto": "Algo te sale mal frente a otras personas.",
   "opciones": [
    {
     "texto": "Me río y sigo",
     "puntos": {
      "K": 2,
      "E": 1
     }
    },
    {
     "texto": "Lo apunto para que no me vuelva a pasar",
     "puntos": {
      "C": 2,
      "R": 1
     }
    }
   ]
  },
  {
   "n": 21,
   "tipo": "Escala de orbes",
   "texto": "Se me ocurren ideas en los momentos menos convenientes: la regadera, el camión, a punto de dormir.",
   "rasgo": "O",
   "invertida": false
  },
  {
   "n": 22,
   "tipo": "Escenario",
   "texto": "Descubres una puerta en tu escuela o trabajo que nunca habías visto.",
   "opciones": [
    {
     "texto": "Entro",
     "puntos": {
      "E": 2,
      "O": 1
     }
    },
    {
     "texto": "Primero averiguo qué hay detrás",
     "puntos": {
      "O": 2,
      "R": 1
     }
    },
    {
     "texto": "La anoto mentalmente por si algún día hace falta",
     "puntos": {
      "C": 2,
      "O": 1
     }
    },
    {
     "texto": "La ignoro; tengo cosas que hacer",
     "puntos": {
      "F": 2,
      "C": 1
     }
    }
   ]
  },
  {
   "n": 23,
   "tipo": "Escala de orbes",
   "texto": "Cuando algo me emociona, se me nota desde lejos.",
   "rasgo": "E",
   "invertida": false
  },
  {
   "n": 24,
   "tipo": "Escenario",
   "texto": "Te invitan a una fiesta donde casi no conoces a nadie.",
   "opciones": [
    {
     "texto": "Voy y termino platicando con medio salón",
     "puntos": {
      "E": 2,
      "O": 1
     }
    },
    {
     "texto": "Voy una hora, con la salida ubicada desde que llego",
     "puntos": {
      "R": 2,
      "K": 1
     }
    },
    {
     "texto": "Voy solo si va alguien conocido",
     "puntos": {
      "A": 2,
      "R": 1
     }
    },
    {
     "texto": "No voy; mi tiempo lo decido yo",
     "puntos": {
      "F": 2,
      "R": 1
     }
    }
   ]
  },
  {
   "n": 25,
   "tipo": "Escala de orbes",
   "texto": "Se me pasa preguntarle a la gente cómo está cuando traigo la cabeza en lo mío.",
   "rasgo": "A",
   "invertida": true
  },
  {
   "n": 26,
   "tipo": "A o B",
   "texto": "Tu mascota ideal en Minecraft:",
   "opciones": [
    {
     "texto": "Un lobo que me sigue a todos lados",
     "puntos": {
      "A": 2,
      "E": 1
     }
    },
    {
     "texto": "Un gato que va y viene cuando quiere",
     "puntos": {
      "R": 2,
      "O": 1
     }
    }
   ]
  },
  {
   "n": 27,
   "tipo": "Escenario",
   "texto": "En Minecraft te dan un mundo vacío y todo el tiempo que quieras.",
   "opciones": [
    {
     "texto": "Camino sin parar para ver qué hay después de la siguiente montaña",
     "puntos": {
      "O": 2,
      "E": 1
     }
    },
    {
     "texto": "Dibujo el plano de una base enorme antes de poner un solo bloque",
     "puntos": {
      "C": 2,
      "F": 1
     }
    },
    {
     "texto": "Hago una casita bonita, de a poquito",
     "puntos": {
      "K": 2,
      "A": 1
     }
    },
    {
     "texto": "Cavo hondo y me hago un escondite",
     "puntos": {
      "R": 2,
      "C": 1
     }
    }
   ]
  },
  {
   "n": 28,
   "tipo": "Escala de orbes",
   "texto": "Una mala noticia me pega, pero me recupero rápido.",
   "rasgo": "K",
   "invertida": false
  },
  {
   "n": 29,
   "tipo": "Escenario",
   "texto": "Te dan un superpoder inútil, pero real.",
   "opciones": [
    {
     "texto": "Saber la hora exacta sin reloj",
     "puntos": {
      "C": 2,
      "K": 1
     }
    },
    {
     "texto": "Entender a los animales",
     "puntos": {
      "O": 2,
      "A": 1
     }
    },
    {
     "texto": "Ganar siempre en piedra, papel o tijera",
     "puntos": {
      "F": 2,
      "O": 1
     }
    },
    {
     "texto": "Volverme invisible, pero solo cuando nadie me está viendo",
     "puntos": {
      "R": 2,
      "K": 1
     }
    }
   ]
  },
  {
   "n": 30,
   "tipo": "Escala de orbes",
   "texto": "Decir «no» me sale fácil, sin tener que dar una explicación larga.",
   "rasgo": "F",
   "invertida": false
  },
  {
   "n": 31,
   "tipo": "A o B",
   "texto": "Alguien te pide un favor grande.",
   "opciones": [
    {
     "texto": "Digo que sí y veo cómo me organizo",
     "puntos": {
      "A": 2,
      "C": 1
     }
    },
    {
     "texto": "Digo que no, o que solo si me alcanza el tiempo",
     "puntos": {
      "F": 2,
      "R": 1
     }
    }
   ]
  },
  {
   "n": 32,
   "tipo": "Escala de orbes",
   "texto": "Hay cosas mías que no le cuento ni a mis amistades más cercanas.",
   "rasgo": "R",
   "invertida": false
  },
  {
   "n": 33,
   "tipo": "Escenario",
   "texto": "En un servidor, un grupo empieza a molestar a una persona nueva y ella no responde.",
   "opciones": [
    {
     "texto": "Me meto y les digo que paren",
     "puntos": {
      "F": 2,
      "A": 1
     }
    },
    {
     "texto": "Me quedo a su lado en el chat para que no se sienta sola",
     "puntos": {
      "A": 2,
      "K": 1
     }
    },
    {
     "texto": "Suelto un meme para cambiar el ambiente",
     "puntos": {
      "E": 2,
      "K": 1
     }
    },
    {
     "texto": "Aviso a quien administra y vigilo que lo cumplan",
     "puntos": {
      "R": 2,
      "F": 1
     }
    }
   ]
  },
  {
   "n": 34,
   "tipo": "Escenario",
   "texto": "Una persona te cae mal sin razón clara.",
   "opciones": [
    {
     "texto": "La evito sin hacer drama",
     "puntos": {
      "R": 2,
      "K": 1
     }
    },
    {
     "texto": "Le doy otra oportunidad, a ver si me equivoqué",
     "puntos": {
      "O": 2,
      "A": 1
     }
    },
    {
     "texto": "Si me molesta de verdad, se lo digo",
     "puntos": {
      "F": 2,
      "A": 1
     }
    },
    {
     "texto": "Lo dejo pasar; hay cosas mejores en qué pensar",
     "puntos": {
      "K": 2,
      "F": 1
     }
    }
   ]
  },
  {
   "n": 35,
   "tipo": "Escala de orbes",
   "texto": "Prefiero los planes chicos y tranquilos a los grandes y ruidosos.",
   "rasgo": "E",
   "invertida": true
  },
  {
   "n": 36,
   "tipo": "A o B",
   "texto": "Te regalan un boleto sorpresa para mañana.",
   "opciones": [
    {
     "texto": "Me voy sin preguntar adónde",
     "puntos": {
      "O": 2,
      "E": 1
     }
    },
    {
     "texto": "Pregunto todos los detalles antes de aceptar",
     "puntos": {
      "R": 2,
      "C": 1
     }
    }
   ]
  },
  {
   "n": 37,
   "tipo": "Escala de orbes",
   "texto": "Si algo ya funciona, no le veo caso a cambiarlo.",
   "rasgo": "O",
   "invertida": true
  },
  {
   "n": 38,
   "tipo": "Escenario",
   "texto": "Te hacen un elogio frente a todos.",
   "opciones": [
    {
     "texto": "Lo disfruto y lo agradezco con sonrisota",
     "puntos": {
      "E": 2,
      "K": 1
     }
    },
    {
     "texto": "Me da pena y cambio de tema",
     "puntos": {
      "R": 2,
      "K": 1
     }
    },
    {
     "texto": "Aclaro que fue trabajo de varias personas",
     "puntos": {
      "A": 2,
      "C": 1
     }
    },
    {
     "texto": "Ya estoy pensando en lo que sigue",
     "puntos": {
      "C": 2,
      "F": 1
     }
    }
   ]
  },
  {
   "n": 39,
   "tipo": "Escala de orbes",
   "texto": "Tengo una libreta, una lista o una app donde apunto lo pendiente, y sí la uso.",
   "rasgo": "C",
   "invertida": false
  },
  {
   "n": 40,
   "tipo": "Escenario",
   "texto": "Te ofrecen un trabajo soñado en otra ciudad. ¿Qué piensas primero?",
   "opciones": [
    {
     "texto": "¿Cuándo empiezo?",
     "puntos": {
      "E": 2,
      "O": 1
     }
    },
    {
     "texto": "¿Y todo lo que dejo aquí?",
     "puntos": {
      "A": 2,
      "R": 1
     }
    },
    {
     "texto": "¿Cuánto pagan y en qué condiciones?",
     "puntos": {
      "C": 2,
      "F": 1
     }
    },
    {
     "texto": "Suena bien; ya veré cómo me acomodo",
     "puntos": {
      "O": 2,
      "K": 1
     }
    }
   ]
  },
  {
   "n": 41,
   "tipo": "A o B",
   "texto": "En un trabajo en equipo prefieres ser quien…",
   "opciones": [
    {
     "texto": "reparte tareas y pone fechas",
     "puntos": {
      "F": 2,
      "C": 1
     }
    },
    {
     "texto": "propone ideas locas y le sube el ánimo al grupo",
     "puntos": {
      "E": 2,
      "O": 1
     }
    }
   ]
  },
  {
   "n": 42,
   "tipo": "Escala de orbes",
   "texto": "Me puedo pasar horas dándole vueltas a algo que dije o hice.",
   "rasgo": "K",
   "invertida": true
  },
  {
   "n": 43,
   "tipo": "Escenario",
   "texto": "En Minecraft, estás en una cueva profunda y se te acaban las antorchas.",
   "opciones": [
    {
     "texto": "Regreso por donde vine, sin discutir con la cueva",
     "puntos": {
      "R": 2,
      "C": 1
     }
    },
    {
     "texto": "Sigo; algo bueno debe haber más abajo",
     "puntos": {
      "E": 2,
      "O": 1
     }
    },
    {
     "texto": "Pico hacia arriba en línea recta hasta ver el cielo",
     "puntos": {
      "C": 2,
      "F": 1
     }
    },
    {
     "texto": "Me siento un momento y pienso cómo salir",
     "puntos": {
      "K": 2,
      "R": 1
     }
    }
   ]
  },
  {
   "n": 44,
   "tipo": "Escala de orbes",
   "texto": "Si alguien me pide ayuda, dejo lo mío para otro rato.",
   "rasgo": "A",
   "invertida": false
  },
  {
   "n": 45,
   "tipo": "Elige un objeto",
   "texto": "En Minecraft te dan una sola herramienta de diamante.",
   "opciones": [
    {
     "texto": "Un pico",
     "puntos": {
      "C": 2,
      "O": 1
     }
    },
    {
     "texto": "Una espada",
     "puntos": {
      "E": 2,
      "F": 1
     }
    },
    {
     "texto": "Una azada",
     "puntos": {
      "A": 2,
      "C": 1
     }
    },
    {
     "texto": "Una caña de pescar",
     "puntos": {
      "K": 2,
      "A": 1
     }
    }
   ]
  },
  {
   "n": 46,
   "tipo": "Escala de orbes",
   "texto": "Prefiero darle la razón a alguien que ponerme a discutir.",
   "rasgo": "F",
   "invertida": true
  },
  {
   "n": 47,
   "tipo": "A o B",
   "texto": "Fila larga en el banco.",
   "opciones": [
    {
     "texto": "Me pongo a platicar con quien tenga al lado",
     "puntos": {
      "E": 2,
      "A": 1
     }
    },
    {
     "texto": "Me quedo con mis audífonos y mis pensamientos",
     "puntos": {
      "K": 2,
      "O": 1
     }
    }
   ]
  },
  {
   "n": 48,
   "tipo": "Escenario",
   "texto": "En Minecraft, es de noche y unos zombis rodean una aldea que pide ayuda.",
   "opciones": [
    {
     "texto": "Corro con lo que tenga en el inventario",
     "puntos": {
      "A": 2,
      "E": 1
     }
    },
    {
     "texto": "Primero armo una defensa en forma",
     "puntos": {
      "R": 2,
      "C": 1
     }
    },
    {
     "texto": "Doy órdenes: tú aquí, tú allá",
     "puntos": {
      "F": 2,
      "E": 1
     }
    },
    {
     "texto": "Esos zombis a veces sueltan hierro; voy por él",
     "puntos": {
      "O": 2,
      "F": 1
     }
    }
   ]
  },
  {
   "n": 49,
   "tipo": "Escala de orbes",
   "texto": "Suelo soltar lo primero que pienso y ver qué pasa.",
   "rasgo": "R",
   "invertida": true
  },
  {
   "n": 50,
   "tipo": "Elige un objeto",
   "texto": "Elige dónde vivir.",
   "opciones": [
    {
     "texto": "Una torre alta con vista a todo",
     "puntos": {
      "O": 2,
      "F": 1
     }
    },
    {
     "texto": "Una cabaña en el bosque, sin señal",
     "puntos": {
      "K": 2,
      "R": 1
     }
    },
    {
     "texto": "Una casa grande, con muchos cuartos y visitas",
     "puntos": {
      "E": 2,
      "A": 1
     }
    },
    {
     "texto": "Un faro frente al mar, para que nadie llegue a oscuras",
     "puntos": {
      "A": 2,
      "F": 1
     }
    }
   ]
  }
 ],
 "encantamientos": [
  {
   "id": "reparacion",
   "nombre": "Reparación",
   "rasgos": [
    "A",
    "K"
   ],
   "ajuste": -0.1711,
   "subtitulo": "Quien se queda a recoger los pedazos.",
   "retrato": "Cuando algo se rompe (una amistad, un plan, una silla), tú ya estás buscando el pegamento. No lo haces para que te lo agradezcan, simplemente te sale. La gente te cuenta cosas a medianoche sin saber bien por qué, y tú escuchas con esa calma tuya, como quien ya vio algo peor.",
   "ladoB": "Tienes mil cosas por reparar y cero tiempo para ti. Tu propio inventario lleva meses con la durabilidad en rojo.",
   "minecraft": "Sin que nadie te lo pida, rellenas los cofres de comida y dejas camas en las bases del grupo.",
   "frase": "Si se rompe, lo arreglamos. Y si no se puede, nos sentamos a verlo juntos.",
   "matiz": "cuidas sin avisar, y casi siempre a tiempo",
   "combinaCon": {
    "id": "espinas",
    "texto": "Espinas pone los límites que a ti te cuesta poner."
   },
   "chocaCon": {
    "id": "eficiencia",
    "texto": "Para Eficiencia, arreglar despacio es perder la tarde."
   }
  },
  {
   "id": "irrompibilidad",
   "nombre": "Irrompibilidad",
   "rasgos": [
    "C",
    "K"
   ],
   "ajuste": 0.0726,
   "subtitulo": "Lo que no se acaba.",
   "retrato": "Llegas al kilómetro 40 con la misma cara con la que saliste. Mientras los demás cambian de proyecto, tú sigues en el primero, ya casi terminándolo. Tus rutinas se ven aburridas desde fuera, y por dentro son lo que te sostiene.",
   "ladoB": "Cambiar de plan te cuesta lo que le cuesta a una roca. Y cuando algo ya no sirve, lo sueltas tarde porque «ya llevo mucho invertido».",
   "minecraft": "Tu mundo lleva cuatro años y sigue en pie. Tienes un cofre solo para picos de repuesto.",
   "frase": "Llego despacio, pero llego.",
   "matiz": "sigues hasta terminar, aunque nadie aplauda",
   "combinaCon": {
    "id": "fortuna",
    "texto": "Fortuna trae las ideas y tú las haces durar."
   },
   "chocaCon": {
    "id": "filo",
    "texto": "Filo lo quiere resuelto hoy; tú lo quieres resuelto bien."
   }
  },
  {
   "id": "fortuna",
   "nombre": "Fortuna",
   "rasgos": [
    "O",
    "E"
   ],
   "ajuste": -0.4806,
   "subtitulo": "Le pasan cosas buenas porque va a buscarlas.",
   "retrato": "Tienes la manía de abrir puertas que no son tuyas. Pruebas el platillo raro, tomas el camión que no conoces, preguntas «¿y esto qué hace?» hasta que alguien te lo explica o te lo quita. Dices que tienes suerte. La verdad es que estás en más lugares que los demás.",
   "ladoB": "Tienes ocho proyectos empezados y el noveno ya te está llamando. Tus amistades dejaron de preguntar por el curso de cerámica.",
   "minecraft": "Cavas sin plan, caes en una cueva llena de diamantes y dices que todo estaba calculado.",
   "frase": "No tengo suerte, tengo más intentos.",
   "matiz": "sales a buscar la aventura sin saber bien dónde queda",
   "combinaCon": {
    "id": "irrompibilidad",
    "texto": "Irrompibilidad convierte tus ideas en cosas que sí se terminan."
   },
   "chocaCon": {
    "id": "proteccion",
    "texto": "Protección ve el hoyo; tú ya estás brincando."
   }
  },
  {
   "id": "eficiencia",
   "nombre": "Eficiencia",
   "rasgos": [
    "C",
    "E"
   ],
   "ajuste": 0.4108,
   "subtitulo": "Ya lo hice. ¿Qué sigue?",
   "retrato": "Haces en una hora lo que a otros les lleva la tarde, y todavía te sobra pila. Tachar cosas de la lista te hace feliz de una manera que te da pena explicar. En equipo, casi siempre acabas con la lista en las manos.",
   "ladoB": "Descansar sin sentir que pierdes el tiempo es tu reto más difícil. Más de un domingo se te ha ido organizando cosas que podían esperar.",
   "minecraft": "Tu granja de trigo está automatizada y los cofres tienen letrero. Tus amigos dicen que tu base parece fábrica.",
   "frase": "Dame la lista y dame cinco minutos.",
   "matiz": "haces que las cosas pasen, y a tiempo",
   "combinaCon": {
    "id": "toque_de_seda",
    "texto": "Toque de seda te frena justo antes de que rompas algo por la prisa."
   },
   "chocaCon": {
    "id": "reparacion",
    "texto": "Reparación va a su ritmo, y para ti ese ritmo es eterno."
   }
  },
  {
   "id": "filo",
   "nombre": "Filo",
   "rasgos": [
    "F",
    "E"
   ],
   "ajuste": -0.0156,
   "subtitulo": "Lo dice y lo dice bien.",
   "retrato": "No das vueltas. Si algo te parece mal, lo dices de frente, con tanta claridad que nadie puede hacerse el confundido. Decides rápido y asumes las consecuencias. En un grupo eres quien termina la discusión de dos horas con una sola frase.",
   "ladoB": "A veces esa frase corta duele más de lo que querías. Y hay gente que solo necesitaba que la escucharas, no que le resolvieras la vida.",
   "minecraft": "Eres quien dice «vámonos al Nether» mientras los demás siguen preguntando si hay suficiente comida.",
   "frase": "Prefiero incomodar tres minutos que fingir tres meses.",
   "matiz": "dices lo que otros solo piensan",
   "combinaCon": {
    "id": "proteccion",
    "texto": "Protección te cubre la espalda mientras tú avanzas."
   },
   "chocaCon": {
    "id": "irrompibilidad",
    "texto": "Irrompibilidad quiere hacerlo bien; tú quieres hacerlo ya."
   }
  },
  {
   "id": "proteccion",
   "nombre": "Protección",
   "rasgos": [
    "A",
    "R"
   ],
   "ajuste": 0.0821,
   "subtitulo": "Quien cuida la puerta.",
   "retrato": "Revisas que la puerta esté cerrada, que tu gente llegó bien a su casa y que nadie se quede fuera del grupo. Piensas en lo que puede salir mal antes que los demás, y no por pesimismo: alguien tiene que hacerlo. Tus personas favoritas son pocas, y las cuidas como si fueran de cristal.",
   "ladoB": "Cargas riesgos que nadie te pidió cargar. A veces tu mejor plan consiste en imaginar lo peor y no soltar el escudo en toda la tarde.",
   "minecraft": "Tu base tiene dos puertas, trampas y un cuarto secreto con comida de sobra, por si acaso.",
   "frase": "Yo cuido la entrada; tú pasa y disfruta.",
   "matiz": "cuidas a tu gente y cubres espaldas en silencio",
   "combinaCon": {
    "id": "filo",
    "texto": "Filo da la cara y tú cubres la espalda."
   },
   "chocaCon": {
    "id": "fortuna",
    "texto": "Fortuna brinca al hoyo; tú preguntas quién lo cavó."
   }
  },
  {
   "id": "toque_de_seda",
   "nombre": "Toque de seda",
   "rasgos": [
    "O",
    "R"
   ],
   "ajuste": 0.1935,
   "subtitulo": "Se lleva las cosas enteras.",
   "retrato": "Te fijas en lo que otros pasan de largo: la nota al margen, el sonido raro de fondo, el detalle de la foto. Investigas antes de opinar, y cuando por fin opinas casi siempre aciertas. Coleccionas cosas, datos o canciones, y las cuidas como si fueran frágiles (a veces lo son).",
   "ladoB": "Observar es cómodo. Hay ideas y personas que llevas semanas viendo de lejos porque «primero quiero entender».",
   "minecraft": "Tienes una bodega llena de cosas que jamás vas a usar, pero tampoco te animas a perder.",
   "frase": "Dame un minuto: estoy viendo algo que tú no.",
   "matiz": "miras con calma antes de tocar nada",
   "combinaCon": {
    "id": "eficiencia",
    "texto": "Eficiencia pone la velocidad y tú pones el detalle."
   },
   "chocaCon": {
    "id": "espinas",
    "texto": "Espinas cierra la puerta; tú quieres ver qué hay detrás."
   }
  },
  {
   "id": "espinas",
   "nombre": "Espinas",
   "rasgos": [
    "F",
    "R"
   ],
   "ajuste": -0.0916,
   "subtitulo": "Amable hasta que alguien se pasa.",
   "retrato": "No le caes bien a todo el mundo ni tienes que fingir que todo el mundo te cae bien. Tu espacio, tu tiempo y tus decisiones son tuyos, y eso queda claro sin que subas la voz. Casi nunca das el primer golpe. Quien se pasa de listo recibe respuesta.",
   "ladoB": "A veces levantas la guardia por si acaso, y alguien que venía con buena onda se queda afuera. Tu «estoy bien» lleva rato funcionando como letrero de «no pasar».",
   "minecraft": "Tu casa tiene muros, pinchos y un letrero que dice «no pasar». Lo escribiste con mucho cariño.",
   "frase": "Toca la puerta. Solo no la tires.",
   "matiz": "pones límites claros y los sostienes",
   "combinaCon": {
    "id": "reparacion",
    "texto": "Reparación tiene la paciencia que tú racionas."
   },
   "chocaCon": {
    "id": "toque_de_seda",
    "texto": "Toque de seda quiere asomarse a todo; tú prefieres que no se asomen."
   }
  }
 ],
 "calibracion": {
  "pesoOrbes": 2,
  "umbralEmpate": 0.2526,
  "medias": {
   "C": 18.5023,
   "O": 18.2827,
   "E": 18.7347,
   "A": 18.616,
   "F": 18.1525,
   "K": 18.1198,
   "R": 18.5977
  },
  "desviaciones": {
   "C": 9.1064,
   "O": 9.3643,
   "E": 10.1116,
   "A": 9.2235,
   "F": 9.4661,
   "K": 9.1407,
   "R": 10.1578
  }
 }
};

function _normalCDF(z) {
  // Aproximación de Abramowitz-Stegun para la función de distribución normal
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

function calcularResultado(respuestas) {
  const M = MESA_ENCANTOS, cal = M.calibracion;
  if (!Array.isArray(respuestas) || respuestas.length !== M.preguntas.length) {
    throw new Error('Se esperaban ' + M.preguntas.length + ' respuestas.');
  }
  const S = {};
  M.rasgos.forEach(r => { S[r.id] = 0; });
  M.preguntas.forEach((q, i) => {
    const r = respuestas[i];
    if (q.tipo === 'Escala de orbes') {
      const p = q.invertida ? (5 - r) / 2 : (r - 1) / 2;
      S[q.rasgo] += cal.pesoOrbes * p;
    } else {
      const pts = q.opciones[r].puntos;
      for (const t in pts) S[t] += pts[t];
    }
  });
  const rasgos = {};
  M.rasgos.forEach(r => {
    const z = (S[r.id] - cal.medias[r.id]) / cal.desviaciones[r.id];
    rasgos[r.id] = { nombre: r.nombre, z: z, porcentaje: Math.round(100 * _normalCDF(z)) };
  });
  const ranking = M.encantamientos.map((e, k) => ({
    encantamiento: e,
    puntos: rasgos[e.rasgos[0]].z + rasgos[e.rasgos[1]].z + e.ajuste,
    orden: k
  })).sort((x, y) => (y.puntos - x.puntos) || (x.orden - y.orden));
  const diferencia = ranking[0].puntos - ranking[1].puntos;
  return {
    principal: ranking[0].encantamiento,
    secundario: ranking[1].encantamiento,
    casiEmpate: diferencia < cal.umbralEmpate,
    rasgos: rasgos,
    ranking: ranking.map(x => ({ id: x.encantamiento.id, puntos: x.puntos }))
  };
}

if (typeof module !== 'undefined') module.exports = { MESA_ENCANTOS, calcularResultado };
