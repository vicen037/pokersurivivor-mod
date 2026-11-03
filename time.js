(() => {
  // 1. MOTOR DE RELOJ VIRTUAL Y SPEEDHACK (ACELERADOR DE TIEMPO)
  // ========================================================
  let timeScale = parseFloat(localStorage.getItem("ps_timescale") || "1");
  let realPerfAnchor = 0;
  let virtualPerfAnchor = 0;
  let realDateAnchor = 0;
  let virtualDateAnchor = 0;
  let timeHooksInstalled = false;

  const origPerfNow = window.performance.now.bind(window.performance);
  const origDateNow = Date.now.bind(Date);

  function initTimeHooks() {
    if (timeHooksInstalled) return;
    timeHooksInstalled = true;

    realPerfAnchor = origPerfNow();
    virtualPerfAnchor = realPerfAnchor;
    realDateAnchor = origDateNow();
    virtualDateAnchor = realDateAnchor;

    // Interceptar performance.now para acelerar el delta time (dt) del motor
    window.performance.now = function() {
      const now = origPerfNow();
      return virtualPerfAnchor + (now - realPerfAnchor) * timeScale;
    };

    // Interceptar Date.now para acelerar cronómetros basados en timestamp
    Date.now = function() {
      const now = origDateNow();
      return Math.floor(virtualDateAnchor + (now - realDateAnchor) * timeScale);
    };
  }

  function setTimeScale(newScale) {
    const scale = Math.max(0.1, parseFloat(newScale) || 1);
    timeScale = scale;
    if (window._psState) window._psState.timeScale = scale;
    localStorage.setItem("ps_timescale", scale.toString());

    // 1. Invocar el speedhack nativo del motor si el namespace está capturado
    const ns = window._psGameNS;
    if (ns && ns.Game && typeof ns.Game.debugSpeed === "function") {
      try {
        ns.Game.debugSpeed(scale);
        console.log(`⚡ [PokéSurvivor Mod] Motor acelerado a ${scale}x vía Game.debugSpeed`);
      } catch (e) {
        console.warn("Error en debugSpeed:", e);
      }
    }

    // 2. Interceptar relojes virtuales
    initTimeHooks();
    const currentPerf = origPerfNow();
    virtualPerfAnchor = virtualPerfAnchor + (currentPerf - realPerfAnchor) * timeScale;
    realPerfAnchor = currentPerf;

    const currentDate = origDateNow();
    virtualDateAnchor = virtualDateAnchor + (currentDate - realDateAnchor) * timeScale;
    realDateAnchor = currentDate;

    return timeScale;
  }

  function advanceVirtualClock(ms) {
    initTimeHooks();
    virtualPerfAnchor += ms;
    virtualDateAnchor += ms;
  }

  // 2. ADELANTAR EL TIEMPO DIRECTO DE LA PARTIDA (SALTO DE CRONÓMETRO)
  // ========================================================
  function advanceGameTime(seconds) {
    const sec = parseFloat(seconds) || 0;
    if (sec <= 0) return { seconds: 0, newTime: 0 };

    const ns = window._psGameNS;
    let targetTime = 0;

    // 1. Si estamos en Game, usar la API nativa del desarrollador debugTime
    if (ns && ns.Game && typeof ns.Game.debugTime === "function") {
      try {
        const currentTime = (ns.Game.st && typeof ns.Game.st.time === "number")
          ? ns.Game.st.time
          : (typeof ns.Game.time === "number") ? ns.Game.time : 0;

        targetTime = currentTime + sec;
        ns.Game.debugTime(targetTime);
        console.log(`⏩ [PokéSurvivor Mod] Tiempo de partida saltó de ${currentTime.toFixed(1)}s a ${targetTime.toFixed(1)}s (+${sec}s)`);
      } catch (err) {
        console.warn("Error invocando Game.debugTime:", err);
      }
    }

    // 2. Adelantar los relojes virtuales globales para sincronizar timestamps
    advanceVirtualClock(sec * 1000);

    return { seconds: sec, newTime: targetTime };
  }

  // Si ya existía un multiplicador previo guardado diferente de 1, arrancar hooks
  if (timeScale !== 1) {
    initTimeHooks();
  }

  // 3. MOTOR DE AUTO-SKIP RECURSIVO Y CONTINUO
  // ========================================================
  let autoSkipTimer = null;
  let autoSkipRemaining = 0;

  function sendAutoPickEvents() {
    const canvas = document.querySelector("canvas");

    // Señal de teclado (tecla 1)
    const kDown = new KeyboardEvent("keydown", { key: "1", code: "Digit1", keyCode: 49, which: 49, bubbles: true, cancelable: true });
    const kUp = new KeyboardEvent("keyup", { key: "1", code: "Digit1", keyCode: 49, which: 49, bubbles: true, cancelable: true });

    [canvas, window, document, document.body].forEach(target => {
      if (target) {
        try { target.dispatchEvent(kDown); target.dispatchEvent(kUp); } catch (e) {}
      }
    });

    // Señal de puntero/ratón sobre la primera carta
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const opts = {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height * 0.42,
        button: 0
      };
      try {
        canvas.dispatchEvent(new MouseEvent("mousedown", opts));
        canvas.dispatchEvent(new MouseEvent("click", opts));
        canvas.dispatchEvent(new MouseEvent("mouseup", opts));
      } catch (e) {}
    }
  }

  function triggerRecursiveAutoSkip(ticks = 90) {
    if (!window._psState.autoSkip) return;
    autoSkipRemaining = Math.max(autoSkipRemaining, ticks);
    if (autoSkipTimer) return;

    autoSkipTimer = setInterval(() => {
      if (!window._psState.autoSkip || autoSkipRemaining <= 0) {
        clearInterval(autoSkipTimer);
        autoSkipTimer = null;
        autoSkipRemaining = 0;
        return;
      }
      sendAutoPickEvents();
      autoSkipRemaining--;
    }, 60);
  }

  window._psTime = {
    setTimeScale,
    getTimeScale: () => timeScale,
    advanceGameTime,
    advanceVirtualClock,
    initTimeHooks,
    triggerRecursiveAutoSkip,
    sendAutoPickEvents
  };
})();
