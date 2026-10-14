
"use strict";

const cartasOriginales = [
    "El Gallo", "El Diablito", "La Dama", "El Catrín",
    "El Paraguas", "La Sirena", "La Escalera", "La Botella",
    "El Barril", "El Árbol", "El Melón", "El Valiente",
    "El Gorrito", "La Muerte", "La Pera", "La Bandera",
    "El Bandolón", "El Violoncello", "La Garza", "El Pájaro",
    "La Mano", "La Bota", "La Luna", "El Cotorro",
    "El Borracho", "El Negrito", "El Corazón", "La Sandía",
    "El Tambor", "El Camarón", "Las Jaras", "El Músico",
    "La Araña", "El Soldado", "La Estrella", "El Cazo",
    "El Mundo", "El Apache", "El Nopal", "El Alacrán",
    "La Rosa", "La Calavera", "La Campana", "El Cantarito",
    "El Venado", "El Sol", "La Corona", "La Chalupa",
    "El Pino", "El Pescado", "La Palma", "La Maceta",
    "El Arpa", "La Rana"
];

const archivosCartas = {
    "El Gallo": "gallo.jpg",
    "El Diablito": "diablito.jpg",
    "La Dama": "dama.jpg",
    "El Catrín": "catrin.jpg",
    "El Paraguas": "paraguas.jpg",
    "La Sirena": "sirena.jpg",
    "La Escalera": "escalera.jpg",
    "La Botella": "botella.jpg",
    "El Barril": "barril.jpg",
    "El Árbol": "arbol.jpg",
    "El Melón": "melon.jpg",
    "El Valiente": "valiente.jpg",
    "El Gorrito": "gorrito.jpg",
    "La Muerte": "muerte.jpg",
    "La Pera": "pera.jpg",
    "La Bandera": "bandera.jpg",
    "El Bandolón": "bandolon.jpg",
    "El Violoncello": "violoncello.jpg",
    "La Garza": "garza.jpg",
    "El Pájaro": "pajaro.jpg",
    "La Mano": "mano.jpg",
    "La Bota": "bota.jpg",
    "La Luna": "luna.jpg",
    "El Cotorro": "cotorro.jpg",
    "El Borracho": "borracho.jpg",
    "El Negrito": "negrito.jpg",
    "El Corazón": "corazon.jpg",
    "La Sandía": "sandia.jpg",
    "El Tambor": "tambor.jpg",
    "El Camarón": "camaron.jpg",
    "Las Jaras": "jaras.jpg",
    "El Músico": "musico.jpg",
    "La Araña": "arana.jpg",
    "El Soldado": "soldado.jpg",
    "La Estrella": "estrella.jpg",
    "El Cazo": "cazo.jpg",
    "El Mundo": "mundo.jpg",
    "El Apache": "apache.jpg",
    "El Nopal": "nopal.jpg",
    "El Alacrán": "alacran.jpg",
    "La Rosa": "rosa.jpg",
    "La Calavera": "calavera.jpg",
    "La Campana": "campana.jpg",
    "El Cantarito": "cantarito.jpg",
    "El Venado": "venado.jpg",
    "El Sol": "sol.jpg",
    "La Corona": "corona.jpg",
    "La Chalupa": "chalupa.jpg",
    "El Pino": "pino.jpg",
    "El Pescado": "pescado.jpg",
    "La Palma": "palma.jpg",
    "La Maceta": "maceta.jpg",
    "El Arpa": "arpa.jpg",
    "La Rana": "rana.jpg"
};


const imagenCarta = document.getElementById("imagenCarta");
const placeholder = document.getElementById("placeholder");
const arteCarta = document.getElementById("arteCarta");
const numeroArte = document.getElementById("numeroArte");
const simboloArte = document.getElementById("simboloArte");
const nombreCarta = document.getElementById("nombreCarta");
const mensaje = document.getElementById("mensaje");

const iniciar = document.getElementById("iniciar");
const pausar = document.getElementById("pausar");
const siguiente = document.getElementById("siguiente");
const reiniciar = document.getElementById("reiniciar");

const velocidad = document.getElementById("velocidad");
const velocidadTexto = document.getElementById("velocidadTexto");
const estado = document.getElementById("estado");
const contador = document.getElementById("contador");

const historialElemento = document.getElementById("historial");
const totalHistorial = document.getElementById("totalHistorial");
const verResumen = document.getElementById("verResumen");

const dialogoResumen = document.getElementById("dialogoResumen");
const tituloResumen = document.getElementById("tituloResumen");
const cerrar = document.getElementById("cerrar");
const listaResumen = document.getElementById("listaResumen");
const copiar = document.getElementById("copiar");
const listo = document.getElementById("listo");

let mazo = [];
let historial = [];
let temporizador = null;
let partidaActiva = false;
let indiceCarta = 0;
let idPartida = 0;
let ultimaCartaAnunciada = "";


function cargarImagen(nombre) {
    return new Promise((resolve) => {
        if (!imagenCarta) {
            resolve(false);
            return;
        }

        const archivo = archivosCartas[nombre];

        if (!archivo) {
            console.error("No existe un archivo configurado para:", nombre);
            imagenCarta.style.display = "none";

            if (placeholder) {
                placeholder.style.display = "flex";
            }

            resolve(false);
            return;
        }

        const ruta = `cards/${archivo}`;

        imagenCarta.onload = () => {
            imagenCarta.style.display = "block";

            if (placeholder) {
                placeholder.style.display = "none";
            }

            resolve(true);
        };

        imagenCarta.onerror = () => {
            imagenCarta.style.display = "none";

            if (placeholder) {
                placeholder.style.display = "flex";
            }

            console.error("No se pudo cargar la imagen:", ruta);
            resolve(false);
        };

        imagenCarta.src = ruta;
    });
}


function prepararVoz() {
    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.getVoices();
}

function activarVozDesdeUsuario() {
    if (!("speechSynthesis" in window)) {
        if (mensaje) {
            mensaje.textContent =
                "Este navegador no admite la lectura automática.";
        }
        return;
    }

    
    window.speechSynthesis.getVoices();
}

function anunciarCarta(nombre) {
    if (
        !("speechSynthesis" in window) ||
        typeof SpeechSynthesisUtterance === "undefined"
    ) {
        if (mensaje) {
            mensaje.textContent =
                "La lectura de voz no está disponible en este navegador.";
        }
        return;
    }

    const sintetizador = window.speechSynthesis;

    ultimaCartaAnunciada = nombre;
    sintetizador.cancel();

    function reproducir() {
        // Evitar anunciar una carta antigua.
        if (ultimaCartaAnunciada !== nombre) {
            return;
        }

        const anuncio = new SpeechSynthesisUtterance(nombre);

        anuncio.lang = "es-MX";
        anuncio.rate = 0.9;
        anuncio.pitch = 1;
        anuncio.volume = 1;

        const voces = sintetizador.getVoices();

        const vozEspanol =
            voces.find(v => v.lang?.toLowerCase() === "es-mx") ||
            voces.find(v => v.lang?.toLowerCase() === "es-us") ||
            voces.find(v => v.lang?.toLowerCase() === "es-es") ||
            voces.find(v => v.lang?.toLowerCase().startsWith("es"));

        if (vozEspanol) {
            anuncio.voice = vozEspanol;
        }

        anuncio.onerror = (evento) => {
            console.warn("Error al reproducir la voz:", evento.error);
        };

        sintetizador.speak(anuncio);
    }

    if (sintetizador.getVoices().length > 0) {
        reproducir();
        return;
    }

    let resuelto = false;

    const alCargarVoces = () => {
        if (resuelto) return;
        resuelto = true;

        sintetizador.removeEventListener(
            "voiceschanged",
            alCargarVoces
        );

        reproducir();
    };

    sintetizador.addEventListener(
        "voiceschanged",
        alCargarVoces
    );

    setTimeout(() => {
        if (!resuelto) {
            resuelto = true;

            sintetizador.removeEventListener(
                "voiceschanged",
                alCargarVoces
            );

            reproducir();
        }
    }, 700);
}

prepararVoz();


function mezclarCartas(cartas) {
    const resultado = [...cartas];

    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [resultado[i], resultado[j]] =
            [resultado[j], resultado[i]];
    }

    return resultado;
}


function actualizarContador() {
    if (contador) {
        contador.textContent =
            `${historial.length} / ${cartasOriginales.length}`;
    }

    if (totalHistorial) {
        totalHistorial.textContent = `${historial.length} cartas`;
    }
}

function actualizarEstado(texto) {
    if (estado) {
        estado.textContent = texto;
    }
}

function actualizarVelocidad() {
    if (!velocidad) return;

    const segundos = Number(velocidad.value);

    if (velocidadTexto) {
        velocidadTexto.textContent = `${segundos} segundos`;
    }

    if (partidaActiva) {
        iniciarTemporizador();
    }
}


async function mostrarCarta(nombre, numero, partidaActual) {
    if (nombreCarta) {
        nombreCarta.textContent = nombre;
    }

    if (numeroArte) {
        numeroArte.textContent = String(numero).padStart(2, "0");
    }

    if (simboloArte) {
        simboloArte.textContent = "";
        simboloArte.style.display = "none";
    }

    if (arteCarta) {
        arteCarta.style.display = "block";
    }

    if (mensaje) {
        mensaje.textContent = `Carta ${numero}: ${nombre}`;
    }
    anunciarCarta(nombre);

    await cargarImagen(nombre);
    if (partidaActual !== idPartida) {
        return;
    }
}


function actualizarHistorial() {
    if (!historialElemento) {
        actualizarContador();
        return;
    }

    historialElemento.innerHTML = "";

    historial.forEach((carta, indice) => {
        const elemento = document.createElement("div");
        elemento.className = "mini-carta";

        const numero = document.createElement("span");
        numero.className = "mini-numero";
        numero.textContent = String(indice + 1).padStart(2, "0");

        const nombre = document.createElement("span");
        nombre.className = "mini-nombre";
        nombre.textContent = carta;

        elemento.appendChild(numero);
        elemento.appendChild(nombre);

        historialElemento.appendChild(elemento);
    });

    actualizarContador();
}


async function sacarCarta() {
    if (historial.length >= cartasOriginales.length) {
        finalizarPartida();
        return;
    }

    if (temporizador) {
        clearTimeout(temporizador);
        temporizador = null;
    }

    const partidaActual = idPartida;
    const carta = mazo[indiceCarta];

    if (!carta) {
        finalizarPartida();
        return;
    }

    indiceCarta++;
    historial.push(carta);

    actualizarHistorial();

    if (siguiente) {
        siguiente.disabled = true;
    }

    await mostrarCarta(
        carta,
        historial.length,
        partidaActual
    );

    if (partidaActual !== idPartida) {
        return;
    }

    if (siguiente) {
        siguiente.disabled = false;
    }

    if (historial.length >= cartasOriginales.length) {
        finalizarPartida();
        return;
    }

    if (partidaActiva) {
        iniciarTemporizador();
    }
}

function iniciarTemporizador() {
    if (temporizador) {
        clearTimeout(temporizador);
        temporizador = null;
    }

    if (!partidaActiva) return;

    const segundos = velocidad
        ? Number(velocidad.value)
        : 5;

    temporizador = setTimeout(() => {
        sacarCarta();
    }, segundos * 1000);
}

function iniciarPartida() {
    activarVozDesdeUsuario();

    if (partidaActiva) return;

    if (historial.length >= cartasOriginales.length) return;

    partidaActiva = true;

    if (iniciar) iniciar.disabled = true;
    if (pausar) pausar.disabled = false;
    if (siguiente) siguiente.disabled = false;

    actualizarEstado("Partida en curso");

    if (historial.length === 0) {
        sacarCarta();
    } else {
        iniciarTemporizador();
    }
}


function pausarPartida() {
    partidaActiva = false;

    if (temporizador) {
        clearTimeout(temporizador);
        temporizador = null;
    }

    if (iniciar) iniciar.disabled = false;
    if (pausar) pausar.disabled = true;

    actualizarEstado("Partida pausada");
}

function siguienteManual() {
    activarVozDesdeUsuario();

    if (historial.length >= cartasOriginales.length) {
        finalizarPartida();
        return;
    }

    if (temporizador) {
        clearTimeout(temporizador);
        temporizador = null;
    }

    sacarCarta();
}

function nuevaPartida() {
    idPartida++;

    if (temporizador) {
        clearTimeout(temporizador);
        temporizador = null;
    }

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    partidaActiva = false;
    indiceCarta = 0;
    historial = [];
    mazo = mezclarCartas(cartasOriginales);
    ultimaCartaAnunciada = "";

    if (imagenCarta) {
        imagenCarta.removeAttribute("src");
        imagenCarta.style.display = "none";
    }

    if (placeholder) {
        placeholder.style.display = "flex";
    }

    if (nombreCarta) {
        nombreCarta.textContent = "Preparados para jugar";
    }

    if (numeroArte) {
        numeroArte.textContent = "00";
    }

    if (simboloArte) {
        simboloArte.textContent = "";
        simboloArte.style.display = "none";
    }

    if (arteCarta) {
        arteCarta.style.display = "block";
    }

    if (mensaje) {
        mensaje.textContent =
            "Presiona Iniciar para comenzar la lotería.";
    }

    if (iniciar) iniciar.disabled = false;
    if (pausar) pausar.disabled = true;
    if (siguiente) siguiente.disabled = false;

    actualizarEstado("Listo para jugar");
    actualizarHistorial();
}


function finalizarPartida() {
    partidaActiva = false;

    if (temporizador) {
        clearTimeout(temporizador);
        temporizador = null;
    }

    if (iniciar) iniciar.disabled = true;
    if (pausar) pausar.disabled = true;
    if (siguiente) siguiente.disabled = true;

    actualizarEstado("Partida finalizada");

    if (mensaje) {
        mensaje.textContent =
            "¡Se han anunciado todas las cartas!";
    }
}

function abrirResumen() {
    if (!dialogoResumen || !listaResumen) {
        console.error(
            "Faltan dialogoResumen o listaResumen en el HTML."
        );
        return;
    }

    if (historial.length === 0) {
        if (mensaje) {
            mensaje.textContent =
                "Todavía no hay cartas para mostrar en el resumen.";
        }
        return;
    }

    listaResumen.innerHTML = "";

    if (tituloResumen) {
        tituloResumen.textContent =
            `Resumen de la partida (${historial.length} cartas)`;
    }

    historial.forEach((carta, indice) => {
        const elemento = document.createElement("div");
        elemento.className = "resumen-item";

        const numero = document.createElement("span");
        numero.className = "mini-numero";
        numero.textContent = String(indice + 1).padStart(2, "0");

        const nombre = document.createElement("span");
        nombre.className = "mini-nombre";
        nombre.textContent = carta;

        elemento.appendChild(numero);
        elemento.appendChild(nombre);

        listaResumen.appendChild(elemento);
    });

    if (typeof dialogoResumen.showModal === "function") {
        if (!dialogoResumen.open) {
            dialogoResumen.showModal();
        }
    } else {
        dialogoResumen.setAttribute("open", "");
    }
}



function cerrarResumen() {
    if (!dialogoResumen) return;

    if (typeof dialogoResumen.close === "function") {
        dialogoResumen.close();
    } else {
        dialogoResumen.removeAttribute("open");
    }
}


async function copiarResumen() {
    if (historial.length === 0) {
        if (mensaje) {
            mensaje.textContent =
                "No hay cartas para copiar todavía.";
        }
        return;
    }

    const texto = historial
        .map((carta, indice) =>
            `${String(indice + 1).padStart(2, "0")}. ${carta}`
        )
        .join("\n");

    try {
        if (
            navigator.clipboard &&
            typeof navigator.clipboard.writeText === "function" &&
            window.isSecureContext
        ) {
            await navigator.clipboard.writeText(texto);
        } else {
            const campo = document.createElement("textarea");

            campo.value = texto;
            campo.setAttribute("readonly", "");
            campo.style.position = "fixed";
            campo.style.opacity = "0";
            campo.style.pointerEvents = "none";

            document.body.appendChild(campo);
            campo.select();
            campo.setSelectionRange(0, campo.value.length);

            const copiado = document.execCommand("copy");
            campo.remove();

            if (!copiado) {
                throw new Error("No se pudo copiar el resumen.");
            }
        }

        if (mensaje) {
            mensaje.textContent = "Resumen copiado correctamente.";
        }
    } catch (error) {
        console.error("Error al copiar:", error);

        if (mensaje) {
            mensaje.textContent =
                "No se pudo copiar automáticamente. Intenta nuevamente.";
        }
    }
}

if (iniciar) {
    iniciar.addEventListener("click", iniciarPartida);
}

if (pausar) {
    pausar.addEventListener("click", pausarPartida);
}

if (siguiente) {
    siguiente.addEventListener("click", siguienteManual);
}

if (reiniciar) {
    reiniciar.addEventListener("click", nuevaPartida);
}

if (velocidad) {
    velocidad.addEventListener("input", actualizarVelocidad);
}

if (verResumen) {
    verResumen.addEventListener("click", abrirResumen);
}

if (cerrar) {
    cerrar.addEventListener("click", cerrarResumen);
}

if (listo) {
    listo.addEventListener("click", cerrarResumen);
}

if (copiar) {
    copiar.addEventListener("click", copiarResumen);
}

nuevaPartida();
