# 🐍 **Snake Clásico** – Estilo Nokia 3310

[![JavaScript](https://img.shields.io/badge/JS-ES6+-yellow?logo=javascript)](https://developer.mozilla.org/docs/Web/JavaScript) [![HTML5](https://img.shields.io/badge/HTML5-orange?logo=html5)](https://developer.mozilla.org/docs/Web/HTML) [![CSS3](https://img.shields.io/badge/CSS3-blue?logo=css3)](https://developer.mozilla.org/docs/Web/CSS) [![Live Demo](https://img.shields.io/badge/🕹️-Live%20Game-blue)](https://michelmassaad.github.io/juego-snake/)

---

## 🚀 Elevator Pitch

Clon ejecutable del mítico *Snake* de los Nokia 3310. Implementado **sin frameworks**, el proyecto muestra cómo aplicar buenas prácticas de ingeniería de software en un “toy‑app” ligero: diseño orientado a objetos, separación de responsabilidades y código limpio.  
Juega directamente en tu navegador: **[🎮 Demo en vivo](https://michelmassaad.github.io/juego-snake/)**.

---

## 🏗️ Arquitectura y decisiones técnicas

- **POO como columna vertebral**  
  La clase `JuegoSnake` actúa como *estado único* del juego; controla velocidad, posiciones, colisiones y la lógica de crecimiento. Esta encapsulación permite instanciar el motor sin depender del DOM, lo cual facilita pruebas unitarias o reutilización.

- **Separation of Concerns (SoC)**  
  - **Modelo**: coordenadas de la serpiente, manzana, puntuación y persistencia (`localStorage`).  
  - **Vista**: renderizado del tablero con CSS Grid y actualización declarativa del DOM.  
  - **Controlador**: intérprete de eventos (teclado/controles táctiles) y gestor de lazo de juego (`requestAnimationFrame`).

- **Clean Code**  
  - Nombres auto‑explicativos (`direccionActual`, `colisionaConCuerpo`).  
  - Constantes configurables (`TAM_TABLERO`, `VELOCIDAD_INICIAL`) definidas en la parte superior.  
  - Evitación de «magia» y comentarios redundantes; la lógica se expresa a través de funciones pequeñas y puras.

- **Render optimizado**  
  Sólo se actualiza la celda del tablero que cambia; el bucle de juego calcula diferencias y modifica el DOM de forma mínima, evitando repintados innecesarios.

- **Escalabilidad**  
  - Mecanismo de **wrap‑around** configurable: fácil de desactivar o convertir en colisión frontal.  
  - Velocidad progresiva controlada por un método `ajustarVelocidad()` desacoplado del ciclo principal.

- **Persistencia ligera**  
  El `localStorage` guarda el **High Score** con un adaptador sencillo (`StorageManager`), permitiendo cambiarlo por IndexedDB o servidor si se desea.

---

## ✨ Características principales

- 🎨 *Estética retro* con tipografía `Press Start 2P` y colores estilo LCD.  
- 🕹️ Controles flexibles: teclado (Flechas/WASD), botones táctiles, pausa (`P`) y reinicio (`R`).  
- ↩️ Mecánica “Pac‑Man”: la serpiente reaparece en el lado opuesto.  
- 📈 Dificultad aumenta con el puntaje.  
- 💾 High score persistente en `localStorage`.  
- ⚙️ Código modular y libre de dependencias externas.

---

## 🧰 Stack tecnológico

| Capa        | Tecnologías / Herramientas          |
|-------------|-------------------------------------|
| Frontend    | HTML5, CSS3 (Grid, Flexbox, keyframes), JavaScript ES6+ |
| Persistencia| `localStorage`                      |
| Herramientas| VS Code, Live Server (para desarrollo local)             |

---

## 💻 Instalación y ejecución local

Clonar, abrir y jugar. No hay dependencias.

```bash
# clonar el repositorio
git clone https://github.com/michelmassaad/juego-snake.git
cd juego-snake
```

1. Abre `index.html` con tu navegador.  
   - O bien levanta un servidor local (`python -m http.server`, Live Server de VS Code) para evitar restricciones CORS.  
2. Usa las **flechas** o **WASD** para mover; pulsa `P` para pausar y `R` para reiniciar.  
3. El high‑score se guarda automáticamente en tu navegador.

> ⚠️ No se requiere `npm`, compiladores ni librerías; código “vanilla” listo para producción.

---

## 🤝 Contribuciones

1. Abre un *issue* detallando tu idea o bug.  
2. Haz un *fork* y envía un *pull request*.  
3. Sigue las convenciones de estilo y añade pruebas si es posible.

---

## 👤 Autor

**Michel Massaad** – Software Developer  
- GitHub: [@michelmassaad](https://github.com/michelmassaad)  
- LinkedIn: *(aquí tu enlace)*

---

Gracias por explorar el código. Este proyecto es una demostración de cómo una aplicación sencilla puede mantenerse limpia y extensible mediante principios sólidos de ingeniería. ¡Disfruta el juego y siéntete libre de mejorar o reutilizar cualquier parte!