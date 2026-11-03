# PokéSurvivor Ultimate Suite (v3.5)

Suite avanzada de modificación, control de tiempo, inyección de ataques, skins y blindaje contra detección para **[PokéSurvivor](https://pokesurvivor.com/)**.

Diseñada como extensión de navegador **Manifest V3** autónoma, sin dependencias externas ni compiladores requeridos.

---

## ⚡ Características Principales

### ⚔️ Combate y Supervivencia
* **Multiplicadores de Estadísticas:** Daño (x1 a x100+ o slider continuo), Multiplicador de EXP, Velocidad de movimiento y Rango de recolección de orbes.
* **Modo Dios (Invulnerabilidad):** Bloqueo total de daño recibido.
* **100% Golpes Críticos & Suerte Máxima:** Fuerza probabilidad crítica y rolls de gacha óptimos.
* **Aura Letal (Touch of Death):** Erradica instantáneamente a cualquier enemigo que entre en tu radio de proximidad.
* **Congelar Enemigos:** Detiene las velocidades y vectores de movimiento de toda la horda.
* **Auto-Skip de Subida de Nivel:** Cierra automáticamente la pantalla de level-up aplicando selecciones inmediatas.
* **Sin Tiempo de Recarga (No CD):** Cadencia instantánea en ataques y habilidades.

### 🌀 Manipulación Temporal (Speedhack & Salto de Reloj)
* **Speedhack Nativo:** Conexión directa a `Game.debugSpeed` combinada con sincronización de relojes virtuales (`performance.now` y `Date.now`). Acelera el juego de 1x hasta 10x fluidamente.
* **Salto de Cronómetro:** Adelanta el tiempo de la run (+30s, +1m, +5m) sin acelerar la simulación física.

### 🎯 Catálogo e Inyección de Ataques
* **Explorador por Tipos Elementales:** Filtra todos los ataques del juego clasificados por su tipo (Fuego, Agua, Dragón, Psíquico, Acero, etc.).
* **Blindaje Anti-Crash:** Sanitiza y encapsula en bloques `try/catch` los ataques inyectados que no corresponden a la especie del Pokémon activo, evitando que la partida se congele o termine abruptamente.
* **Auto-Maxear y Auto-Fusionar en Vivo:** Sube automáticamente los ataques a nivel máximo y combina recetas compatibles en tiempo real.

### 🧙‍♀️ Evento de Halloween, Skins y Progreso
* **Inyección de Caramelos:** Suma caramelos de evento en tiempo real a tu run para canjear en la tienda temática.
* **Desbloqueo de Todas las Skins:** Inyecta en tu guardado local todas las skins del juego (Bruja Gengar, Bruja Pikachu, Bruja Umbreon, etc.) de forma segura.
* **Pokedex Completa & Shiny:** Desbloqueo íntegro de Pokémon y variantes variocolor.
* **Monedas y Consumibles:** Inyección de PokéMonedas, Tickets de Gacha, Comodines de Evolución y Fragmentos de Grieta.

### 🔄 Reset a Valores Por Defecto
* Botón **"Desactivar Todo (Por Defecto)"** que restablece al instante todos los modificadores de daño, velocidad, críticos y modos a 1x (vanilla), sin tocar tus monedas, progreso ni skins.

### 🛡️ Blindaje Stealth Anti-Detección
PokéSurvivor implementa un módulo interno ofuscado (`Hz`) que rastrea polución de prototipos, variables en `window` y elementos DOM de mods. Esta suite incluye contramedidas integradas:
* **Captura vía `Object.create(null)`:** Conexión al namespace central sin contaminar `Object.prototype`.
* **Neutralización de `Hz`:** Desactiva la comprobación y el bloqueo de sincronización en la nube.
* **Escudo de Prototipos (`Object.getOwnPropertyNames`):** Oculta cualquier propiedad no estándar ante escaneos de integridad.
* **Escudo DOM (`Node.prototype.appendChild` & `querySelector`):** Intercepta e impide el montaje de pantallas de advertencia o incompatibilidad.

---

## 🚀 Guía de Instalación y Despliegue

La extensión funciona en cualquier navegador basado en **Chromium** (Google Chrome, Brave, Microsoft Edge, Opera, Vivaldi) en Windows, macOS o Linux.

### 1. Descargar el repositorio
Puedes clonar el repositorio mediante Git:
```bash
git clone https://github.com/vicen037/pokersurivivor-mod.git
```
O pulsar en **Code > Download ZIP** en GitHub y descomprimir el archivo en una carpeta de tu ordenador.

### 2. Cargar en el Navegador
1. Abre tu navegador y accede a la sección de extensiones:
   * **Chrome / Brave:** `chrome://extensions`
   * **Edge:** `edge://extensions`
   * **Opera:** `opera://extensions`
2. Activa la casilla o interruptor **Modo de desarrollador** (Developer Mode) en la esquina superior derecha.
3. Haz clic en el botón **Cargar descomprimida** (Load unpacked).
4. Selecciona la carpeta que contiene los archivos del proyecto (donde reside `manifest.json`).

### 3. Jugar
1. Dirígete a **[pokesurvivor.com](https://pokesurvivor.com/)**.
2. Verás aparecer un botón rojo flotante **MOD MENU** en la esquina superior derecha de la pantalla.
3. Haz clic en él o presiona la tecla **M** para desplegar la suite.

---

## ⌨️ Atajos de Teclado (Hotkeys)

| Tecla | Acción |
| :---: | :--- |
| **M** | Abrir / Cerrar el Mod Menu |
| **G** | Alternar Modo Dios (Invencible) |
| **K** | Ejecutar Nuke Letal (Eliminar a todos los enemigos en pantalla) |
| **C** | Alternar 100% Golpes Críticos |
| **L** | Alternar Suerte Máxima (Gacha / Drops) |
| **F** | Alternar Congelar Enemigos |
| **1 - 5** | Velocidad del juego (1x, 2x, 3x, 5x, 10x) |

---

## 📁 Estructura del Proyecto

```text
├── manifest.json       # Manifiesto V3 de la extensión de Chrome
├── state.js            # Estado global, persistencia en localStorage y escudos iniciales
├── engine.js           # Ganchos del motor, speedhack, control de cámara y stealth capture
├── moves.js            # Catálogo elemental, recetas de fusión y blindaje anticrash
├── save.js             # Manipulación de partidas, guardado en nube, skins y caramelos
├── time.js             # Manipulación de relojes virtuales y avance de cronómetro
├── ui.js               # Interfaz gráfica interactiva (tabs, inputs, sliders y botones)
└── style.css           # Estilos visuales con estética cyberpunk / dark neon
```

---

## ⚠️ Consideraciones de Uso

* Esta herramienta está diseñada para partidas individuales, pruebas y disfrute personal.
* Si el juego lanza un parche que modifique la estructura interna, mantén actualizada la extensión recargándola desde `chrome://extensions`.

