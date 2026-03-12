/**
 * Clase principal que gestiona la lógica, el estado y el renderizado del juego Snake.
 */
class JuegoSnake {
    constructor() {
        // Configuraciones base
        this.tamanoTablero = 20; 
        this.velocidadBase = 130; 
        this.velocidadActual = this.velocidadBase;
        
        // Elementos del DOM (Pantallas y textos)
        this.elementoTablero = document.getElementById('tablero-juego');
        this.elementoPuntaje = document.getElementById('puntaje');
        this.elementoPuntajeMaximo = document.getElementById('puntaje-maximo');
        this.pantallaInicio = document.getElementById('pantalla-inicio');
        this.pantallaFinJuego = document.getElementById('pantalla-fin-juego');
        this.pantallaPausa = document.getElementById('pantalla-pausa');
        this.elementoPuntajeFinal = document.getElementById('puntaje-final');
        
        // Elementos del DOM (Botones)
        this.btnPausa = document.getElementById('btn-pausa');
        this.btnReiniciar = document.getElementById('btn-reiniciar');

        // Variables de estado del juego
        this.serpiente = [];
        this.comida = {};
        this.direccion = { x: 0, y: 0 };
        this.proximaDireccion = { x: 0, y: 0 }; 
        this.puntaje = 0;
        this.puntajeMaximo = localStorage.getItem('puntajeMaximoSnakeNokia') || 0;
        this.cicloJuego = null;
        
        // Banderas de estado
        this.juegoEnEjecucion = false;
        this.juegoTerminado = false;
        this.estaPausado = false;

        this.inicializar();
    }

    /**
     * Configura el tablero y los eventos iniciales.
     */
    inicializar() {
        // Configurar la cuadrícula de CSS
        this.elementoTablero.style.gridTemplateColumns = `repeat(${this.tamanoTablero}, 1fr)`;
        this.elementoTablero.style.gridTemplateRows = `repeat(${this.tamanoTablero}, 1fr)`;
        this.elementoPuntajeMaximo.innerText = this.puntajeMaximo;

        // Escuchar teclado
        document.addEventListener('keydown', (evento) => this.manejarEntrada(evento));
        
        // Escuchar botón de pausa
        this.btnPausa.addEventListener('click', () => {
            if (this.juegoEnEjecucion && !this.juegoTerminado) {
                this.alternarPausa();
            }
            this.btnPausa.blur(); // Evita que quede seleccionado
        });

        // Escuchar botón de reiniciar
        this.btnReiniciar.addEventListener('click', () => {
            this.iniciarJuego();
            this.btnReiniciar.blur();
        });
    }

    /**
     * Resetea todas las variables y arranca una partida nueva.
     */
    iniciarJuego() {
        this.juegoEnEjecucion = true;
        this.juegoTerminado = false;
        this.estaPausado = false;
        this.btnPausa.innerText = '|| PAUSAR'; 
        
        // La serpiente inicia con 3 bloques
        this.serpiente = [
            { x: 10, y: 10 }, 
            { x: 10, y: 11 }, 
            { x: 10, y: 12 }  
        ];
        this.direccion = { x: 0, y: -1 }; 
        this.proximaDireccion = { x: 0, y: -1 };
        
        this.puntaje = 0;
        this.velocidadActual = this.velocidadBase;
        this.actualizarPuntaje();
        
        // Ocultar todas las pantallas superpuestas
        this.pantallaInicio.classList.add('oculto');
        this.pantallaFinJuego.classList.add('oculto');
        this.pantallaPausa.classList.add('oculto');
        
        this.generarComida();
        this.iniciarCiclo();
    }

    /**
     * Arranca o reanuda el intervalo de frames del juego.
     */
    iniciarCiclo() {
        if (this.cicloJuego) clearInterval(this.cicloJuego);
        this.cicloJuego = setInterval(() => this.actualizarLogica(), this.velocidadActual);
    }

    /**
     * Pausa o reanuda la partida actual.
     */
    alternarPausa() {
        this.estaPausado = !this.estaPausado;
        
        if (this.estaPausado) {
            clearInterval(this.cicloJuego); 
            this.pantallaPausa.classList.remove('oculto');
            this.btnPausa.innerText = '> JUGAR';
        } else {
            this.pantallaPausa.classList.add('oculto');
            this.iniciarCiclo(); 
            this.btnPausa.innerText = '|| PAUSAR';
        }
    }

    /**
     * Motor principal: calcula posiciones, colisiones y alimentación en cada frame.
     */
    actualizarLogica() {
        this.direccion = this.proximaDireccion;

        let nuevaCabeza = {
            x: this.serpiente[0].x + this.direccion.x,
            y: this.serpiente[0].y + this.direccion.y
        };

        // Lógica Pac-Man: Atravesar las paredes
        if (nuevaCabeza.x > this.tamanoTablero) nuevaCabeza.x = 1;
        else if (nuevaCabeza.x < 1) nuevaCabeza.x = this.tamanoTablero;

        if (nuevaCabeza.y > this.tamanoTablero) nuevaCabeza.y = 1;
        else if (nuevaCabeza.y < 1) nuevaCabeza.y = this.tamanoTablero;

        // Verificar si choca consigo misma
        if (this.verificarColision(nuevaCabeza)) {
            return this.finDelJuego();
        }

        // Mover serpiente
        this.serpiente.unshift(nuevaCabeza);

        // Lógica de alimentación
        if (nuevaCabeza.x === this.comida.x && nuevaCabeza.y === this.comida.y) {
            this.puntaje += 10;
            this.actualizarPuntaje();
            this.generarComida();
            
            // Aumentar dificultad progresivamente
            if (this.puntaje % 50 === 0 && this.velocidadActual > 60) {
                this.velocidadActual -= 5; 
                this.iniciarCiclo(); 
            }
        } else {
            // Si no come, avanza eliminando la cola
            this.serpiente.pop(); 
        }

        this.dibujar();
    }

    /**
     * Revisa si la coordenada dada colisiona con el cuerpo de la serpiente.
     */
    verificarColision(cabeza) {
        return this.serpiente.some(segmento => segmento.x === cabeza.x && segmento.y === cabeza.y);
    }

    /**
     * Crea una nueva comida en una ubicación aleatoria vacía.
     */
    generarComida() {
        let nuevaPosicionComida;
        while (true) {
            nuevaPosicionComida = {
                x: Math.floor(Math.random() * this.tamanoTablero) + 1,
                y: Math.floor(Math.random() * this.tamanoTablero) + 1
            };
            const estaSobreSerpiente = this.serpiente.some(segmento => segmento.x === nuevaPosicionComida.x && segmento.y === nuevaPosicionComida.y);
            if (!estaSobreSerpiente) break;
        }
        this.comida = nuevaPosicionComida;
    }

    /**
     * Procesa los eventos del teclado.
     */
    manejarEntrada(evento) {
        // Prevenir scroll
        if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight", " "].indexOf(evento.key) > -1) {
            evento.preventDefault();
        }

        // Acciones globales
        if (this.juegoEnEjecucion && !this.juegoTerminado && (evento.key === 'p' || evento.key === 'P' || evento.key === 'Escape')) {
            this.alternarPausa();
            return;
        }

        if (!this.juegoEnEjecucion && !this.juegoTerminado) {
            this.iniciarJuego();
            return; 
        }

        if (this.juegoTerminado && (evento.key === 'Enter' || evento.key === ' ')) {
            this.iniciarJuego();
            return;
        }

        // Controles de movimiento
        if (this.juegoEnEjecucion && !this.estaPausado) {
            switch (evento.key) {
                case 'ArrowUp': case 'w': case 'W':
                    if (this.direccion.y !== 1) this.proximaDireccion = { x: 0, y: -1 };
                    break;
                case 'ArrowDown': case 's': case 'S':
                    if (this.direccion.y !== -1) this.proximaDireccion = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft': case 'a': case 'A':
                    if (this.direccion.x !== 1) this.proximaDireccion = { x: -1, y: 0 };
                    break;
                case 'ArrowRight': case 'd': case 'D':
                    if (this.direccion.x !== -1) this.proximaDireccion = { x: 1, y: 0 };
                    break;
            }
        }
    }

    /**
     * Actualiza el puntaje actual y el máximo histórico en pantalla y en memoria.
     */
    actualizarPuntaje() {
        this.elementoPuntaje.innerText = this.puntaje;
        if (this.puntaje > this.puntajeMaximo) {
            this.puntajeMaximo = this.puntaje;
            this.elementoPuntajeMaximo.innerText = this.puntajeMaximo;
            localStorage.setItem('puntajeMaximoSnakeNokia', this.puntajeMaximo);
        }
    }

    /**
     * Limpia y vuelve a pintar todos los elementos en la cuadrícula CSS.
     */
    dibujar() {
        this.elementoTablero.innerHTML = ''; 

        // Dibujar serpiente
        this.serpiente.forEach((segmento) => {
            const elSerpiente = document.createElement('div');
            elSerpiente.style.gridColumnStart = segmento.x;
            elSerpiente.style.gridRowStart = segmento.y;
            elSerpiente.classList.add('parte-serpiente');
            this.elementoTablero.appendChild(elSerpiente);
        });

        // Dibujar comida
        const elComida = document.createElement('div');
        elComida.style.gridColumnStart = this.comida.x;
        elComida.style.gridRowStart = this.comida.y;
        elComida.classList.add('comida');
        this.elementoTablero.appendChild(elComida);
    }

    /**
     * Detiene el juego y muestra la pantalla final.
     */
    finDelJuego() {
        clearInterval(this.cicloJuego);
        this.juegoEnEjecucion = false;
        this.juegoTerminado = true;
        this.elementoPuntajeFinal.innerText = this.puntaje;
        this.pantallaFinJuego.classList.remove('oculto');
    }
}

// Iniciar la clase cuando el HTML cargue
document.addEventListener('DOMContentLoaded', () => {
    new JuegoSnake();
});