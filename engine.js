(() => {
  // 5. GANCHOS (HOOKS) Y BLINDAJE ANTICRASH EN EL PROTOTIPO DEL MOTOR
  // ========================================================
  let hooksApplied = false;

  // CONTROL DE CÁMARA Y ZOOM (Full Vision)
  function setCameraZoom(zoom) {
    const z = Math.max(0.2, Math.min(3, parseFloat(zoom) || 1));
    window._psState.camZoom = z;
    localStorage.setItem("ps_cam_zoom", z.toString());

    // 1. Intentar vía player.scene
    const p = window._psPlayerInstance;
    if (p && p.scene && p.scene.cameras && p.scene.cameras.main) {
      try {
        p.scene.cameras.main.setZoom(z);
        return z;
      } catch (e) {}
    }

    // 2. Intentar vía ns.Game
    const ns = window._psGameNS;
    if (ns && ns.Game) {
      if (ns.Game.scene && ns.Game.scene.cameras && ns.Game.scene.cameras.main) {
        try {
          ns.Game.scene.cameras.main.setZoom(z);
          return z;
        } catch (e) {}
      }
    }
    return z;
  }

  // SANITIZACIÓN Y BLINDAJE DE ATAQUES
  function shieldMoveObject(m) {
    if (!m || typeof m !== "object" || m._psShielded) return;
    m._psShielded = true;

    if (typeof m.update === "function") {
      const origUpd = m.update;
      m.update = function(...args) {
        try {
          return origUpd.apply(this, args);
        } catch (eUpd) {}
      };
    }

    ["fire", "shoot", "attack", "trigger", "cast", "tick", "spawn"].forEach(fnName => {
      if (typeof m[fnName] === "function") {
        const origFn = m[fnName];
        m[fnName] = function(...args) {
          try {
            return origFn.apply(this, args);
          } catch (eFn) {}
        };
      }
    });
  }

  function sanitizeAndShieldMoves(player) {
    if (!player || !player.moves) return;

    if (Array.isArray(player.moves)) {
      for (let i = player.moves.length - 1; i >= 0; i--) {
        const m = player.moves[i];
        if (!m || typeof m !== "object" || (!m.def && !m.name && !m.key && !m.id) || m.name === "undefined" || (m.def === undefined && !m.stats && !m.execute)) {
          console.warn("[PokéSurvivor Mod] Ataque corrupto / inexistente eliminado:", m);
          player.moves.splice(i, 1);
          continue;
        }
        shieldMoveObject(m);
      }
    } else if (typeof player.moves === "object") {
      for (let k in player.moves) {
        const m = player.moves[k];
        if (!m || typeof m !== "object" || (!m.def && !m.name && !m.key && !m.id) || m.name === "undefined" || (m.def === undefined && !m.stats && !m.execute)) {
          console.warn("[PokéSurvivor Mod] Ataque corrupto / inexistente eliminado:", k, m);
          delete player.moves[k];
          continue;
        }
        shieldMoveObject(m);
      }
    }
  }

  function syncPlayer(player) {
    if (!player) return;
    window._psPlayerInstance = player;

    // Limpiar ataques corruptos y proteger los válidos
    sanitizeAndShieldMoves(player);

    // Inyección inicial segura al arrancar la partida
    if (!player._customMovesInjected && window._psState.customMovesEnabled) {
      player._customMovesInjected = true;
      setTimeout(() => {
        try {
          if (window._psMoves) {
            window._psMoves.injectCustomMoves(player);
            if (window._psState.customItemsEnabled && typeof window._psMoves.injectCustomItems === "function") {
              window._psMoves.injectCustomItems(player);
            }
            sanitizeAndShieldMoves(player);
            if (window._psState.autoFuse) {
              window._psMoves.triggerMoveFusions(player);
              sanitizeAndShieldMoves(player);
            }
          }
        } catch (eInj) {
          console.warn("[PokéSurvivor Mod] Error en inyección inicial:", eInj);
        }
      }, 250);
    }

    // Auto-maximizador periódico de ataques y pasivas
    if (window._psState.autoMaxMoves && (!player._lastMaxCheck || Date.now() - player._lastMaxCheck > 1000)) {
      player._lastMaxCheck = Date.now();
      try {
        if (window._psMoves) {
          window._psMoves.maxOutAllMoves(player);
          if (typeof window._psMoves.maxOutAllItems === "function") {
            window._psMoves.maxOutAllItems(player);
          }
          sanitizeAndShieldMoves(player);
        }
      } catch (eMax) {
        console.warn("[PokéSurvivor Mod] Error en auto-max:", eMax);
      }
    }

    // Auto-fusión periódica segura
    if (window._psState.autoFuse && (!player._lastFuseCheck || Date.now() - player._lastFuseCheck > 1500)) {
      player._lastFuseCheck = Date.now();
      try {
        if (window._psMoves) {
          window._psMoves.triggerMoveFusions(player);
          sanitizeAndShieldMoves(player);
        }
      } catch (eFuse) {
        console.warn("[PokéSurvivor Mod] Error en auto-fusión:", eFuse);
      }
    }

    // Escalar Vida Máxima
    try {
      const maxProp = ("maxHp" in player) ? "maxHp" : ("mhp" in player) ? "mhp" : null;
      if (maxProp && typeof player[maxProp] === "number") {
        if (!player._origMaxHp) player._origMaxHp = player[maxProp];
        const mult = window._psState.hpMult || 1;
        player[maxProp] = player._origMaxHp * mult;
        if (window._psState.godMode) {
          player.hp = player[maxProp];
        } else if (player.hp > player[maxProp]) {
          player.hp = player[maxProp];
        }
      }
    } catch (eHp) {}

    // Sin Enfriamiento (No Cooldown)
    try {
      if (window._psState.noCd && player.moves) {
        for (let k in player.moves) {
          const m = player.moves[k];
          if (m && typeof m === "object") {
            if ("cd" in m && m.cd > 0) m.cd = 0;
            if ("timer" in m && m.timer > 0) m.timer = 0;
          }
        }
      }
    } catch (eCd) {}

    // 100% Probabilidad de Crítico
    try {
      if (window._psState.alwaysCrit) {
        if ("crit" in player) {
          if (player._origCrit === undefined) player._origCrit = player.crit;
          player.crit = 100;
        }
        if ("critRate" in player) {
          if (player._origCritRate === undefined) player._origCritRate = player.critRate;
          player.critRate = 100;
        }
        if ("critChance" in player) {
          if (player._origCritChance === undefined) player._origCritChance = player.critChance;
          player.critChance = 100;
        }
      } else {
        if (player._origCrit !== undefined) { player.crit = player._origCrit; delete player._origCrit; }
        if (player._origCritRate !== undefined) { player.critRate = player._origCritRate; delete player._origCritRate; }
        if (player._origCritChance !== undefined) { player.critChance = player._origCritChance; delete player._origCritChance; }
      }
    } catch (eCrit) {}

    // Suerte Máxima (Drops y Shinies)
    try {
      if (window._psState.maxLuck) {
        if ("luck" in player) {
          if (player._origLuck === undefined) player._origLuck = player.luck;
          player.luck = 9999;
        }
      } else {
        if (player._origLuck !== undefined) { player.luck = player._origLuck; delete player._origLuck; }
      }
    } catch (eLuck) {}

    // Sincronizar Zoom de Cámara si está personalizado
    try {
      if (window._psState.camZoom && window._psState.camZoom !== 1) {
        if (player.scene && player.scene.cameras && player.scene.cameras.main) {
          player.scene.cameras.main.setZoom(window._psState.camZoom);
        }
      }
    } catch (eCam) {}

    // Aura de Muerte / Escudo Letal (Touch of Death)
    if (window._psState.deathAura && (!player._lastAuraCheck || Date.now() - player._lastAuraCheck > 120)) {
      player._lastAuraCheck = Date.now();
      try {
        const ns = window._psGameNS;
        if (ns && ns.EnemyMgr) {
          const enemies = (typeof ns.EnemyMgr.all === "function") ? ns.EnemyMgr.all() : (ns.EnemyMgr.enemies || []);
          if (Array.isArray(enemies)) {
            const px = player.x || 0;
            const py = player.y || 0;
            const auraDistSq = 180 * 180;
            enemies.forEach(e => {
              if (e && (e.active !== false) && typeof e.hurt === "function") {
                const dx = (e.x || 0) - px;
                const dy = (e.y || 0) - py;
                if (dx * dx + dy * dy <= auraDistSq) {
                  e.hurt(999999999);
                }
              }
            });
          }
        }
      } catch (eAura) {}
    }

    // Congelar Enemigos
    if (window._psState.freezeEnemies) {
      try {
        const ns = window._psGameNS;
        if (ns && ns.EnemyMgr) {
          const enemies = (typeof ns.EnemyMgr.all === "function") ? ns.EnemyMgr.all() : (ns.EnemyMgr.enemies || []);
          if (Array.isArray(enemies)) {
            enemies.forEach(e => {
              if (e) {
                if (e.body && e.body.velocity) {
                  e.body.velocity.x = 0;
                  e.body.velocity.y = 0;
                }
                if ("spd" in e) {
                  if (e._origSpd === undefined && e.spd > 0) e._origSpd = e.spd;
                  e.spd = 0;
                }
                if ("speed" in e) {
                  if (e._origSpeed === undefined && e.speed > 0) e._origSpeed = e.speed;
                  e.speed = 0;
                }
              }
            });
          }
        }
      } catch (eFreeze) {}
    } else {
      try {
        const ns = window._psGameNS;
        if (ns && ns.EnemyMgr) {
          const enemies = (typeof ns.EnemyMgr.all === "function") ? ns.EnemyMgr.all() : (ns.EnemyMgr.enemies || []);
          if (Array.isArray(enemies)) {
            enemies.forEach(e => {
              if (e) {
                if (e._origSpd !== undefined) { e.spd = e._origSpd; delete e._origSpd; }
                if (e._origSpeed !== undefined) { e.speed = e._origSpeed; delete e._origSpeed; }
              }
            });
          }
        }
      } catch (eRestore) {}
    }
  }

  function installEngineHooks(ns) {
    if (hooksApplied || !ns || !ns.Player || !ns.Player.prototype) return;
    const proto = ns.Player.prototype;

    try {
      // 1. Gancho de Experiencia
      const descXp = Object.getOwnPropertyDescriptor(proto, "gainXp");
      if (descXp && typeof descXp.value === "function") {
        const origXp = descXp.value;
        proto.gainXp = function(amount, ...args) {
          try { syncPlayer(this); } catch (e) {}
          const numAmount = typeof amount === "number" && !isNaN(amount) ? amount : 0;
          const mult = window._psState.expMult || 1;
          const res = origXp.call(this, numAmount * mult, ...args);
          if (window._psState.autoSkip) window._psTime.triggerRecursiveAutoSkip(90);
          return res;
        };
      }

      // 2. Gancho de Daño Base (Getter atk)
      const descAtk = Object.getOwnPropertyDescriptor(proto, "atk");
      if (descAtk && descAtk.get) {
        const origAtk = descAtk.get;
        Object.defineProperty(proto, "atk", {
          get() {
            try { syncPlayer(this); } catch (e) {}
            const base = origAtk.call(this);
            const mult = window._psState.dmgMult || 1;
            return (typeof base === "number" && !isNaN(base)) ? base * mult : base;
          },
          set: descAtk.set,
          configurable: true,
          enumerable: descAtk.enumerable
        });
      }

      // 3. Gancho de Daño por Ataque (atkFor)
      const descAtkFor = Object.getOwnPropertyDescriptor(proto, "atkFor");
      if (descAtkFor && typeof descAtkFor.value === "function") {
        const origAtkFor = descAtkFor.value;
        proto.atkFor = function(...args) {
          try { syncPlayer(this); } catch (e) {}
          const base = origAtkFor.apply(this, args);
          const mult = window._psState.dmgMult || 1;
          return (typeof base === "number" && !isNaN(base)) ? base * mult : base;
        };
      }

      // 4. Gancho de Velocidad de Movimiento (spd)
      const descSpd = Object.getOwnPropertyDescriptor(proto, "spd");
      if (descSpd && descSpd.get) {
        const origSpd = descSpd.get;
        Object.defineProperty(proto, "spd", {
          get() {
            const base = origSpd.call(this);
            const mult = window._psState.spdMult || 1;
            return typeof base === "number" ? base * mult : base;
          },
          set: descSpd.set,
          configurable: true,
          enumerable: descSpd.enumerable
        });
      } else if (descSpd && typeof descSpd.value === "function") {
        const origSpdFn = descSpd.value;
        proto.spd = function(...args) {
          const base = origSpdFn.apply(this, args);
          return typeof base === "number" ? base * (window._psState.spdMult || 1) : base;
        };
      }

      // 5. Gancho de Imán / Vacuum (pickup)
      const descPickup = Object.getOwnPropertyDescriptor(proto, "pickup");
      if (descPickup && descPickup.get) {
        const origPickup = descPickup.get;
        Object.defineProperty(proto, "pickup", {
          get() {
            const base = origPickup.call(this);
            const mult = window._psState.pickupMult || 1;
            return typeof base === "number" ? base * mult : base;
          },
          set: descPickup.set,
          configurable: true,
          enumerable: descPickup.enumerable
        });
      }

      // 6. Gancho de Probabilidad de Crítico (crit)
      const descCrit = Object.getOwnPropertyDescriptor(proto, "crit");
      if (descCrit && descCrit.get) {
        const origCrit = descCrit.get;
        Object.defineProperty(proto, "crit", {
          get() {
            if (window._psState.alwaysCrit) return 100;
            return origCrit.call(this);
          },
          set: descCrit.set,
          configurable: true,
          enumerable: descCrit.enumerable
        });
      }

      // 7. Gancho de Suerte (luck)
      const descLuck = Object.getOwnPropertyDescriptor(proto, "luck");
      if (descLuck && descLuck.get) {
        const origLuck = descLuck.get;
        Object.defineProperty(proto, "luck", {
          get() {
            if (window._psState.maxLuck) return 9999;
            return origLuck.call(this);
          },
          set: descLuck.set,
          configurable: true,
          enumerable: descLuck.enumerable
        });
      }

      // 8. Gancho de Daño Recibido / Inmortalidad (hurt)
      const descHurt = Object.getOwnPropertyDescriptor(proto, "hurt");
      if (descHurt && typeof descHurt.value === "function") {
        const origHurt = descHurt.value;
        proto.hurt = function(amount, ...args) {
          try { syncPlayer(this); } catch (e) {}
          if (window._psState.godMode) {
            const max = this.maxHp || this.mhp;
            if (max) this.hp = max;
            return 0;
          }
          return origHurt.call(this, amount, ...args);
        };
      }

      // 9. Gancho de Adición de Ataques con Blindaje (addMove)
      const descAddMove = Object.getOwnPropertyDescriptor(proto, "addMove");
      if (descAddMove && typeof descAddMove.value === "function") {
        const origAddMove = descAddMove.value;
        proto.addMove = function(moveId, ...args) {
          try {
            const res = origAddMove.call(this, moveId, ...args);
            sanitizeAndShieldMoves(this);
            return res;
          } catch (eAdd) {
            console.warn("[PokéSurvivor Mod] Error al añadir ataque con addMove:", moveId, eAdd);
            sanitizeAndShieldMoves(this);
            return null;
          }
        };
      }

      // 10. Bucle Principal de Actualización con Blindaje Anticolisión (update)
      const descUpdate = Object.getOwnPropertyDescriptor(proto, "update");
      if (descUpdate && typeof descUpdate.value === "function") {
        const origUpdate = descUpdate.value;
        proto.update = function(...args) {
          try {
            syncPlayer(this);
          } catch (eSync) {}

          try {
            return origUpdate.apply(this, args);
          } catch (eUpd) {
            return;
          }
        };
      }

      // 11. Gancho en Enemigos para Congelar Movimiento
      if (ns.Enemy && ns.Enemy.prototype) {
        const eProto = ns.Enemy.prototype;
        const descEUpd = Object.getOwnPropertyDescriptor(eProto, "update");
        if (descEUpd && typeof descEUpd.value === "function") {
          const origEUpd = descEUpd.value;
          eProto.update = function(...args) {
            if (window._psState.freezeEnemies) {
              if (this.body && this.body.velocity) {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
              }
              return;
            }
            return origEUpd.apply(this, args);
          };
        }
      }

      // 12. Rerolls y Skips Infinitos en Apertura de Recompensas (LevelUp.offer)
      if (ns.LevelUp && typeof ns.LevelUp.offer === "function") {
        const origOffer = ns.LevelUp.offer;
        ns.LevelUp.offer = function(...args) {
          try {
            if (window._psState.infRerolls) {
              const p = window._psPlayerInstance;
              if (p) {
                if ("rerolls" in p) p.rerolls = 99;
                if ("skips" in p) p.skips = 99;
                if ("banishes" in p) p.banishes = 99;
                if (p.st) {
                  if ("rerolls" in p.st) p.st.rerolls = 99;
                  if ("skips" in p.st) p.st.skips = 99;
                  if ("banishes" in p.st) p.st.banishes = 99;
                }
              }
            }
          } catch (eReroll) {}

          const res = origOffer.apply(this, args);
          if (window._psState.autoSkip) window._psTime.triggerRecursiveAutoSkip(90);
          return res;
        };
      }

      hooksApplied = true;
      console.log("⚡ [PokéSurvivor Mod Suite] Ganchos y blindaje anticrash inyectados con éxito.");
      if (window._psUI) window._psUI.updateBadge(true);
    } catch (e) {
      console.error("Error al inyectar ganchos:", e);
    }
  }

  // SISTEMA STEALTH PARA CAPTURAR EL NAMESPACE DEL MOTOR SIN TOCAR PROTOTIPOS
  // ========================================================
  let _capturedNS = null;

  function onNamespaceCaptured(ns) {
    if (_capturedNS || !ns) return;
    _capturedNS = ns;
    window._psGameNS = ns;
    console.log("⚡ [PokéSurvivor Mod Suite] ¡Namespace del juego capturado con éxito!", ns);
    installEngineHooks(ns);
    if (window._psUI) window._psUI.updateBadge(true);
  }

  // Interceptar la creación nativa del namespace: var _0x599208 = Object.create(null);
  const _origCreate = Object.create;
  Object.create = function(proto, props) {
    const result = _origCreate.apply(this, arguments);
    if (proto === null && !_capturedNS) {
      _capturedNS = result;
      window._psGameNS = result;

      // 1. Desarmar módulo trampa anti-extensión Hz
      let _dummyHz = {
        boot: function() { return false; },
        get v() { return 0; }
      };
      Object.defineProperty(result, 'Hz', {
        configurable: true,
        enumerable: true,
        get: () => _dummyHz,
        set: () => {} // Descarta la función original de detección
      });

      // 2. Interceptor reactivo para enganchar Player apenas se defina
      let _playerVal = undefined;
      Object.defineProperty(result, 'Player', {
        configurable: true,
        enumerable: true,
        get: () => _playerVal,
        set(val) {
          _playerVal = val;
          onNamespaceCaptured(result);
          try {
            if (val && val.prototype) {
              installEngineHooks(result);
            }
          } catch (e) {
            console.error("Error al enganchar Player:", e);
          }
        }
      });

      // 3. Interceptor reactivo para Game
      let _gameVal = undefined;
      Object.defineProperty(result, 'Game', {
        configurable: true,
        enumerable: true,
        get: () => _gameVal,
        set(val) {
          _gameVal = val;
          onNamespaceCaptured(result);
        }
      });
    }
    return result;
  };

  // Bucle de sincronización
  setInterval(() => {
    const ns = window._psGameNS;
    if (ns && ns.Game) {
      if (ns.Game.player) {
        syncPlayer(ns.Game.player);
      }
      if (window._psState && window._psState.timeScale && window._psState.timeScale !== 1) {
        if (typeof ns.Game.debugSpeed === "function") {
          try {
            ns.Game.debugSpeed(window._psState.timeScale);
          } catch (e) {}
        }
      }
    }
    if (!hooksApplied && ns && ns.Player) {
      installEngineHooks(ns);
    }
  }, 150);

  function restoreDefaultStats() {
    const player = window._psPlayerInstance;
    if (player) {
      const maxProp = ("maxHp" in player) ? "maxHp" : ("mhp" in player) ? "mhp" : null;
      if (maxProp && typeof player[maxProp] === "number" && player._origMaxHp) {
        player[maxProp] = player._origMaxHp;
        if (player.hp > player[maxProp]) player.hp = player[maxProp];
      }
      if (player._origCrit !== undefined) { player.crit = player._origCrit; delete player._origCrit; }
      if (player._origCritRate !== undefined) { player.critRate = player._origCritRate; delete player._origCritRate; }
      if (player._origCritChance !== undefined) { player.critChance = player._origCritChance; delete player._origCritChance; }
      if (player._origLuck !== undefined) { player.luck = player._origLuck; delete player._origLuck; }
    }

    try {
      const ns = window._psGameNS;
      if (ns && ns.EnemyMgr) {
        const enemies = (typeof ns.EnemyMgr.all === "function") ? ns.EnemyMgr.all() : (ns.EnemyMgr.enemies || []);
        if (Array.isArray(enemies)) {
          enemies.forEach(e => {
            if (e) {
              if (e._origSpd !== undefined) { e.spd = e._origSpd; delete e._origSpd; }
              if (e._origSpeed !== undefined) { e.speed = e._origSpeed; delete e._origSpeed; }
            }
          });
        }
      }
    } catch (eRestore) {}
  }

  window._psEngine = {
    get hooksApplied() { return hooksApplied; },
    installEngineHooks,
    syncPlayer,
    sanitizeAndShieldMoves,
    setCameraZoom,
    restoreDefaultStats
  };
})();
