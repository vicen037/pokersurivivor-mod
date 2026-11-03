(() => {
  // 6. FUNCIONES DE COMBATE Y GUARDADO
  // ========================================================
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

  function getSaveContext() {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const m = k.match(/^ps\.cloud\.(.+)$/);
      if (m) return { uid: m[1], saveKey: k };
    }
    return null;
  }

  function commitSave(save, uid, saveKey, reload = true) {
    save.updated = Date.now();
    localStorage.setItem(saveKey, JSON.stringify(save));
    const revKey = `ps.rev.${uid}`;
    const rev = parseInt(localStorage.getItem(revKey) || "21", 10);
    localStorage.setItem(revKey, (rev + 10).toString());
    localStorage.setItem(`ps.cloudok.${uid}`, Date.now().toString());
    if (reload) location.reload();
  }

  // DESBLOQUEAR TODAS LAS SKINS DEL JUEGO (EVENTO HALLOWEEN / BRUJAS)
  function unlockAllSkins() {
    const ctx = getSaveContext();
    if (!ctx) return false;
    const save = JSON.parse(localStorage.getItem(ctx.saveKey));
    if (!save) return false;

    save.skins = save.skins || {};
    save.pskin = save.pskin || {};

    const ns = window._psGameNS;
    let skinList = ["bruja-gengar", "bruja-pikachu", "bruja-umbreon"];
    const skinMap = {
      "bruja-gengar": { dex: 94 },
      "bruja-pikachu": { dex: 25 },
      "bruja-umbreon": { dex: 197 }
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

    commitSave(save, ctx.uid, ctx.saveKey);
    return true;
  }

  // AÑADIR CARAMELOS A LA PARTIDA EN VIVO
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
    return false;
  }

  window._psSave = {
    nukeEnemies,
    getSaveContext,
    commitSave,
    unlockAllSkins,
    addCandiesToRun
  };
})();
