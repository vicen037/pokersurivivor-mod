(() => {
  // 6. GESTOR DE GUARDADO, INYECCIÓN DE RECURSOS Y PROGRESO UNIVERSAL
  // ========================================================

  function getActiveSave() {
    const ns = window._psGameNS;
    // 1. Acceso directo al motor DB en vivo del juego (autoritativo y en memoria)
    if (ns && ns.DB && ns.DB.save) {
      return {
        save: ns.DB.save,
        isLive: true,
        uid: (ns.DB.user && ns.DB.user.uid) || ns.DB.user || "local",
        commit: () => {
          try {
            if (typeof ns.DB.commit === "function") ns.DB.commit();
            if (typeof ns.DB.saveNow === "function") ns.DB.saveNow();
            if (ns.UI && typeof ns.UI.refreshCoins === "function") ns.UI.refreshCoins();
            // Actualizar textos del topbar directamente
            const coinsEl = document.getElementById("coins");
            if (coinsEl && ns.DB.save.coins !== undefined) {
              coinsEl.textContent = (+ns.DB.save.coins).toLocaleString();
            }
          } catch (e) {
            console.warn("[PokéSurvivor Mod] Error al sincronizar DB:", e);
          }
        }
      };
    }

    // 2. Fallback a localStorage si aún no se ha inicializado el motor DB
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith("ps.cloud.") || k.startsWith("ps.save.")) {
        try {
          const raw = localStorage.getItem(k);
          if (raw && raw.startsWith("{")) {
            const saveObj = JSON.parse(raw);
            return {
              save: saveObj,
              isLive: false,
              uid: k.replace(/^ps\.(cloud|save)\./, ""),
              saveKey: k,
              commit: () => {
                saveObj.updated = Date.now();
                localStorage.setItem(k, JSON.stringify(saveObj));
              }
            };
          }
        } catch (e) {}
      }
    }

    return null;
  }

  function getAllDexIds() {
    const ns = window._psGameNS;
    if (ns && Array.isArray(ns.DEX) && ns.DEX.length > 0) {
      return ns.DEX.map(p => (p && (p.dex !== undefined ? p.dex : p.id))).filter(Boolean);
    }
    if (ns && ns.DEX_BY && Object.keys(ns.DEX_BY).length > 0) {
      return Object.keys(ns.DEX_BY).map(k => parseInt(k, 10) || k);
    }
    return Array.from({ length: 1025 }, (_, i) => i + 1);
  }

  // INYECCIÓN DE MONEDAS, TICKETS Y CARAMELOS
  function injectCurrencies(coins, t1, t10, candy) {
    const active = getActiveSave();
    if (!active) return { ok: false, error: "not_ready" };
    const save = active.save;

    if (coins !== undefined && coins !== null) {
      save.coins = Math.max(0, parseInt(coins, 10) || 0);
    }

    save.tickets = save.tickets || { t1: 0, t10: 0 };
    if (t1 !== undefined && t1 !== null) {
      save.tickets.t1 = Math.max(0, parseInt(t1, 10) || 0);
    }
    if (t10 !== undefined && t10 !== null) {
      save.tickets.t10 = Math.max(0, parseInt(t10, 10) || 0);
    }

    if (candy !== undefined && candy !== null) {
      const c = Math.max(0, parseInt(candy, 10) || 0);
      save.bag = save.bag || {};
      save.bag.candy = c;
      save.candy = c;
    }

    active.commit();
    return { ok: true, coins: save.coins, tickets: save.tickets, candy: save.candy };
  }

  // DESBLOQUEAR TODA LA POKÉDEX
  function unlockAllPokemon() {
    const active = getActiveSave();
    if (!active) return { ok: false, error: "not_ready" };
    const save = active.save;

    save.owned = save.owned || {};
    const ids = getAllDexIds();
    ids.forEach(id => {
      save.owned[id] = { at: Date.now(), runs: 1, kills: 150, from: "gacha" };
    });

    active.commit();
    return { ok: true, count: ids.length };
  }

  // DESBLOQUEAR TODOS LOS SHINIES
  function unlockAllShinies() {
    const active = getActiveSave();
    if (!active) return { ok: false, error: "not_ready" };
    const save = active.save;

    save.owned = save.owned || {};
    save.shiny = save.shiny || {};
    const ids = getAllDexIds();
    ids.forEach(id => {
      save.owned[id] = save.owned[id] || { at: Date.now(), runs: 1, kills: 150, from: "gacha" };
      save.shiny[id] = { at: Date.now(), from: "gacha" };
    });

    active.commit();
    return { ok: true, count: ids.length };
  }

  // MAXEAR TODOS LOS STATS DE POKÉMON
  function maxAllStats() {
    const active = getActiveSave();
    if (!active) return { ok: false, error: "not_ready" };
    const save = active.save;

    save.pupg = save.pupg || {};
    const ids = Object.keys(save.owned || {});
    if (ids.length === 0) {
      getAllDexIds().forEach(id => { ids.push(id.toString()); });
    }
    ids.forEach(id => {
      save.pupg[id] = { hp: 10, atk: 10, spd: 10, crit: 10, pickup: 10, exp: 10 };
    });

    active.commit();
    return { ok: true, count: ids.length };
  }

  // DESBLOQUEAR TODAS LAS ARENAS / BIOMAS
  function unlockAllArenas() {
    const active = getActiveSave();
    if (!active) return { ok: false, error: "not_ready" };
    const save = active.save;

    save.arenas = save.arenas || {};
    const biomes = ["fire", "ghost", "flying", "steel", "ice", "electric", "poison", "ground", "rock", "bug", "dragon", "dark", "water", "grass", "psychic", "fairy", "fighting", "normal"];
    biomes.forEach(b => { save.arenas[b] = Date.now(); });

    active.commit();
    return { ok: true };
  }

  // DESBLOQUEAR TODAS LAS SKINS (HALLOWEEN Y TEMÁTICAS)
  function unlockAllSkins() {
    const active = getActiveSave();
    if (!active) return false;
    const save = active.save;

    save.skins = save.skins || {};
    save.pskin = save.pskin || {};

    const ns = window._psGameNS;
    let skinList = ["bruja-gengar", "bruja-pikachu", "bruja-umbreon", "bruja-mimikyu", "bruja-gardevoir"];
    const skinMap = {
      "bruja-gengar": { dex: 94 },
      "bruja-pikachu": { dex: 25 },
      "bruja-umbreon": { dex: 197 },
      "bruja-mimikyu": { dex: 778 },
      "bruja-gardevoir": { dex: 282 }
    };

    if (ns && ns.Skins) {
      if (ns.Skins.SKINS && typeof ns.Skins.SKINS === "object") {
        skinList = Object.keys(ns.Skins.SKINS);
        for (const [k, v] of Object.entries(ns.Skins.SKINS)) {
          skinMap[k] = v;
        }
      } else if (Array.isArray(ns.Skins.LIST)) {
        skinList = ns.Skins.LIST;
      }
    }

    skinList.forEach(id => {
      save.skins[id] = Date.now();
      const meta = skinMap[id];
      if (meta && meta.dex) {
        save.pskin[meta.dex] = [id, Date.now()];
      }
    });

    active.commit();
    return true;
  }

  // AÑADIR CARAMELOS A LA PARTIDA EN VIVO (RUN)
  function addCandiesToRun(amount = 1000) {
    const ns = window._psGameNS;
    if (ns && ns.Game && typeof ns.Game.addCandy === "function") {
      try {
        ns.Game.addCandy(amount);
        return true;
      } catch (e) {
        console.warn("[PokéSurvivor Mod] Error en Game.addCandy:", e);
      }
    }
    // Si no está dentro de la run, sumarlos a la bolsa del guardado
    const active = getActiveSave();
    if (active && active.save) {
      active.save.bag = active.save.bag || {};
      active.save.bag.candy = (active.save.bag.candy || 0) + amount;
      active.save.candy = (active.save.candy || 0) + amount;
      active.commit();
      return true;
    }
    return false;
  }

  // ELIMINAR A TODOS LOS ENEMIGOS EN PANTALLA
  function nukeEnemies() {
    const ns = window._psGameNS;
    let totalKilled = 0;
    if (ns && ns.EnemyMgr) {
      if (typeof ns.EnemyMgr.all === "function") {
        const list = ns.EnemyMgr.all();
        if (Array.isArray(list)) {
          list.forEach(e => {
            if (e && typeof e.hurt === "function") { e.hurt(9999999); totalKilled++; }
            else if (e && "hp" in e) { e.hp = 0; totalKilled++; }
          });
        }
      }
      for (let k in ns.EnemyMgr) {
        const item = ns.EnemyMgr[k];
        if (Array.isArray(item)) {
          item.forEach(e => {
            if (e && typeof e.hurt === "function") { e.hurt(9999999); totalKilled++; }
            else if (e && "hp" in e) { e.hp = 0; totalKilled++; }
          });
        }
      }
    }
    return totalKilled;
  }

  // Compatibilidad con funciones previas
  function getSaveContext() {
    const active = getActiveSave();
    if (!active) return null;
    return { uid: active.uid || "local", saveKey: active.saveKey || "ps.live", isLive: active.isLive };
  }

  function commitSave(save, uid, saveKey, reload = false) {
    const active = getActiveSave();
    if (active && active.isLive) {
      active.commit();
    } else if (saveKey) {
      localStorage.setItem(saveKey, JSON.stringify(save));
    }
    if (reload) location.reload();
  }

  window._psSave = {
    getActiveSave,
    getAllDexIds,
    injectCurrencies,
    unlockAllPokemon,
    unlockAllShinies,
    maxAllStats,
    unlockAllArenas,
    unlockAllSkins,
    addCandiesToRun,
    nukeEnemies,
    getSaveContext,
    commitSave
  };
})();
