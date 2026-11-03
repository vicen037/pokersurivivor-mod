(() => {
  // ESCUDOS STEALTH ANTI-DETECCIÓN Y NEUTRALIZACIÓN DE TRAMPAS
  // ========================================================
  try {
    delete window.__psmod;
    delete window.__psmodNS;
    delete window.__sobrevidaPiloto;
  } catch (e) {}

  // 1. Escudo para Object.getOwnPropertyNames (previene detección en Object.prototype)
  const _origGetOwnPropertyNames = Object.getOwnPropertyNames;
  Object.getOwnPropertyNames = function(target) {
    const list = _origGetOwnPropertyNames.apply(this, arguments);
    if (target === Object.prototype) {
      const allowed = [
        'constructor', '__defineGetter__', '__defineSetter__', 'hasOwnProperty',
        '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable',
        'toString', 'valueOf', '__proto__', 'toLocaleString'
      ];
      return list.filter(k => allowed.includes(k));
    }
    return list;
  };

  // 2. Escudo para Document.prototype.querySelector (anula búsqueda de selectores de mods)
  const _origQuerySelector = Document.prototype.querySelector;
  Document.prototype.querySelector = function(selector) {
    if (typeof selector === 'string' && (selector.includes('psmod-') || selector.includes('sobrevida'))) {
      return null;
    }
    return _origQuerySelector.apply(this, arguments);
  };

  // 3. Escudo para Node.prototype.appendChild (bloquea la inyección de pantalla de incompatibilidad)
  const _origAppendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function(child) {
    if (child && child.nodeType === 1) {
      const txt = (child.textContent || '') + (child.innerHTML || '');
      if (txt.includes('Una extensión del navegador no es compatible') || txt.includes('chrome://extensions')) {
        console.warn("🛡️ [PokéSurvivor Mod Suite] Bloqueada pantalla trampa de incompatibilidad.");
        return child;
      }
    }
    return _origAppendChild.apply(this, arguments);
  };

  const DEFAULT_GAMEPLAY = {
    dmgMult: 1,
    expMult: 1,
    hpMult: 1,
    spdMult: 1,
    pickupMult: 1,
    godMode: false,
    autoSkip: false,
    noCd: false,
    autoFuse: false,
    autoMaxMoves: false,
    timeScale: 1,
    customMovesEnabled: false,
    alwaysCrit: false,
    maxLuck: false,
    deathAura: false,
    freezeEnemies: false,
    infRerolls: false,
    camZoom: 1,
    customItemsEnabled: false
  };

  window._psDefaults = DEFAULT_GAMEPLAY;

  window._psState = {
    dmgMult: parseFloat(localStorage.getItem("ps_dmg") || "1"),
    expMult: parseFloat(localStorage.getItem("ps_exp") || "1"),
    hpMult: parseFloat(localStorage.getItem("ps_hp") || "1"),
    spdMult: parseFloat(localStorage.getItem("ps_spd") || "1"),
    pickupMult: parseFloat(localStorage.getItem("ps_pickup") || "1"),
    godMode: localStorage.getItem("ps_god") === "true",
    autoSkip: localStorage.getItem("ps_skip") === "true",
    noCd: localStorage.getItem("ps_nocd") === "true",
    autoFuse: localStorage.getItem("ps_autofuse") === "true",
    autoMaxMoves: localStorage.getItem("ps_automax") === "true",
    timeScale: parseFloat(localStorage.getItem("ps_timescale") || "1"),
    customMovesEnabled: localStorage.getItem("ps_moves_enabled") === "true",
    customMoves: JSON.parse(localStorage.getItem("ps_custom_moves") || '["meteor-mash", "flamethrower", "psychic", "seed-bomb"]'),
    moveClickAction: localStorage.getItem("ps_move_action") || "inject",
    // NUEVAS MEJORAS GOD-TIER
    alwaysCrit: localStorage.getItem("ps_crit") === "true",
    maxLuck: localStorage.getItem("ps_luck") === "true",
    deathAura: localStorage.getItem("ps_aura") === "true",
    freezeEnemies: localStorage.getItem("ps_freeze") === "true",
    infRerolls: localStorage.getItem("ps_inf_rerolls") === "true",
    camZoom: parseFloat(localStorage.getItem("ps_cam_zoom") || "1"),
    customItemsEnabled: localStorage.getItem("ps_items_enabled") === "true",
    customItems: JSON.parse(localStorage.getItem("ps_custom_items") || '["leftovers", "magnet", "scope-lens", "choice-band"]')
  };

  window._psResetGameplay = function() {
    // 1. Asignar valores por defecto en memoria (sin tocar progreso de guardado ni monedas)
    for (const [k, v] of Object.entries(DEFAULT_GAMEPLAY)) {
      window._psState[k] = v;
    }

    // 2. Persistir en localStorage
    localStorage.setItem("ps_dmg", "1");
    localStorage.setItem("ps_exp", "1");
    localStorage.setItem("ps_hp", "1");
    localStorage.setItem("ps_spd", "1");
    localStorage.setItem("ps_pickup", "1");
    localStorage.setItem("ps_god", "false");
    localStorage.setItem("ps_skip", "false");
    localStorage.setItem("ps_nocd", "false");
    localStorage.setItem("ps_autofuse", "false");
    localStorage.setItem("ps_automax", "false");
    localStorage.setItem("ps_timescale", "1");
    localStorage.setItem("ps_moves_enabled", "false");
    localStorage.setItem("ps_crit", "false");
    localStorage.setItem("ps_luck", "false");
    localStorage.setItem("ps_aura", "false");
    localStorage.setItem("ps_freeze", "false");
    localStorage.setItem("ps_inf_rerolls", "false");
    localStorage.setItem("ps_cam_zoom", "1");
    localStorage.setItem("ps_items_enabled", "false");

    // 3. Revertir motor en vivo
    if (window._psEngine && typeof window._psEngine.restoreDefaultStats === "function") {
      window._psEngine.restoreDefaultStats();
    }
    if (window._psTime && typeof window._psTime.setTimeScale === "function") {
      window._psTime.setTimeScale(1);
    }
    if (window._psEngine && typeof window._psEngine.setCameraZoom === "function") {
      window._psEngine.setCameraZoom(1);
    }

    // 4. Sincronizar todos los elementos de la interfaz gráfica
    if (window._psUI && typeof window._psUI.syncUIFromState === "function") {
      window._psUI.syncUIFromState();
    }
  };

  window._psPlayerInstance = null;
})();
