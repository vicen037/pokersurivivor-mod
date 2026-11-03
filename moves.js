(() => {
  // CATÁLOGO COMPLETO DE ATAQUES SEPARADOS POR TIPO EN POKÉSURVIVOR
  // ========================================================
  const MOVES_BY_TYPE = {
    fire: {
      name: "Fuego",
      icon: "🔥",
      color: "#f97316",
      bg: "rgba(249, 115, 22, 0.15)",
      border: "#ea580c",
      moves: [
        "ember", "fire-spin", "flamethrower", "fire-blast", "blast-burn",
        "sacred-fire", "flare-blitz", "heat-wave", "overheat", "lava-plume",
        "will-o-wisp", "flame-wheel", "fire-punch", "mystical-fire"
      ]
    },
    water: {
      name: "Agua",
      icon: "💧",
      color: "#38bdf8",
      bg: "rgba(56, 189, 248, 0.15)",
      border: "#0284c7",
      moves: [
        "water-gun", "bubble-beam", "surf", "hydro-pump", "hydro-cannon",
        "origin-pulse", "aqua-jet", "water-pulse", "scald", "aqua-tail",
        "whirlpool", "dive", "waterfall", "muddy-water"
      ]
    },
    grass: {
      name: "Planta",
      icon: "🌿",
      color: "#4ade80",
      bg: "rgba(74, 222, 128, 0.15)",
      border: "#16a34a",
      moves: [
        "vine-whip", "razor-leaf", "seed-bomb", "energy-ball", "solar-beam",
        "frenzy-plant", "bullet-seed", "leaf-blade", "giga-drain", "mega-drain",
        "petal-dance", "magical-leaf", "leech-seed"
      ]
    },
    electric: {
      name: "Eléctrico",
      icon: "⚡",
      color: "#facc15",
      bg: "rgba(250, 204, 21, 0.15)",
      border: "#ca8a04",
      moves: [
        "spark", "thunderbolt", "thunder", "discharge", "volt-tackle",
        "shock-wave", "electro-ball", "zap-cannon", "wild-charge",
        "thunder-wave", "thunder-punch", "charge-beam"
      ]
    },
    ice: {
      name: "Hielo",
      icon: "❄️",
      color: "#67e8f9",
      bg: "rgba(103, 232, 249, 0.15)",
      border: "#0891b2",
      moves: [
        "aurora-beam", "ice-beam", "blizzard", "ice-shard", "ice-punch",
        "icicle-spear", "avalanche", "frost-breath", "icicle-crash"
      ]
    },
    dragon: {
      name: "Dragón",
      icon: "🐉",
      color: "#818cf8",
      bg: "rgba(129, 140, 248, 0.15)",
      border: "#4f46e5",
      moves: [
        "dragon-claw", "outrage", "draco-meteor", "dragon-breath",
        "dragon-pulse", "roar-of-time", "spacial-rend", "dragon-dance"
      ]
    },
    psychic: {
      name: "Psíquico",
      icon: "🔮",
      color: "#f472b6",
      bg: "rgba(244, 114, 182, 0.15)",
      border: "#db2777",
      moves: [
        "psybeam", "psychic", "psystrike", "confusion", "extrasensory",
        "future-sight", "mirror-coat", "psycho-cut", "zen-headbutt"
      ]
    },
    ghost: {
      name: "Fantasma",
      icon: "👻",
      color: "#c084fc",
      bg: "rgba(192, 132, 252, 0.15)",
      border: "#7c3aed",
      moves: [
        "shadow-ball", "shadow-force", "shadow-claw", "shadow-sneak",
        "night-shade", "hex", "confuse-ray", "ominous-wind"
      ]
    },
    dark: {
      name: "Siniestro",
      icon: "🌑",
      color: "#94a3b8",
      bg: "rgba(148, 163, 184, 0.15)",
      border: "#475569",
      moves: [
        "bite", "crunch", "dark-pulse", "night-slash", "foul-play",
        "pursuit", "sucker-punch", "payback", "knock-off"
      ]
    },
    steel: {
      name: "Acero",
      icon: "🛡️",
      color: "#cbd5e1",
      bg: "rgba(203, 213, 225, 0.15)",
      border: "#64748b",
      moves: [
        "iron-head", "meteor-mash", "doom-desire", "flash-cannon",
        "steel-wing", "metal-claw", "gyro-ball", "bullet-punch"
      ]
    },
    fighting: {
      name: "Lucha",
      icon: "🥊",
      color: "#f87171",
      bg: "rgba(248, 113, 113, 0.15)",
      border: "#dc2626",
      moves: [
        "mach-punch", "close-combat", "aura-sphere", "focus-blast",
        "brick-break", "cross-chop", "karate-chop", "seismic-toss",
        "dynamic-punch", "drain-punch"
      ]
    },
    ground: {
      name: "Tierra",
      icon: "🌍",
      color: "#fbbf24",
      bg: "rgba(251, 191, 36, 0.15)",
      border: "#b45309",
      moves: [
        "mud-slap", "earthquake", "precipice-blades", "earth-power",
        "dig", "mud-shot", "bone-rush", "sand-tomb"
      ]
    },
    rock: {
      name: "Roca",
      icon: "🪨",
      color: "#d97706",
      bg: "rgba(217, 119, 6, 0.15)",
      border: "#78350f",
      moves: [
        "stone-edge", "rock-slide", "rock-tomb", "rock-throw",
        "power-gem", "ancient-power", "rollout"
      ]
    },
    flying: {
      name: "Volador",
      icon: "🦅",
      color: "#38bdf8",
      bg: "rgba(56, 189, 248, 0.15)",
      border: "#0284c7",
      moves: [
        "air-slash", "aeroblast", "aerial-ace", "brave-bird",
        "wing-attack", "hurricane", "gust", "fly", "acrobatics"
      ]
    },
    poison: {
      name: "Veneno",
      icon: "☠️",
      color: "#e879f9",
      bg: "rgba(232, 121, 249, 0.15)",
      border: "#a855f7",
      moves: [
        "sludge-bomb", "sludge-wave", "poison-jab", "poison-sting",
        "toxic", "acid", "cross-poison"
      ]
    },
    bug: {
      name: "Bicho",
      icon: "🐛",
      color: "#a3e635",
      bg: "rgba(163, 230, 53, 0.15)",
      border: "#65a30d",
      moves: [
        "bug-buzz", "x-scissor", "pin-missile", "signal-beam",
        "megahorn", "leech-life", "silver-wind"
      ]
    },
    fairy: {
      name: "Hada",
      icon: "✨",
      color: "#fbcfe8",
      bg: "rgba(251, 207, 232, 0.15)",
      border: "#f472b6",
      moves: [
        "dazzling-gleam", "moonblast", "play-rough", "draining-kiss",
        "fairy-wind"
      ]
    },
    normal: {
      name: "Normal",
      icon: "⭐",
      color: "#e2e8f0",
      bg: "rgba(226, 232, 240, 0.15)",
      border: "#94a3b8",
      moves: [
        "swift", "hyper-voice", "hyper-beam", "judgment", "tackle",
        "scratch", "quick-attack", "body-slam", "double-edge", "extreme-speed"
      ]
    },
    supreme: {
      name: "Supremos y Fusiones",
      icon: "👑",
      color: "#c084fc",
      bg: "rgba(192, 132, 252, 0.25)",
      border: "#a855f7",
      moves: [
        "frenzy-plant", "hydro-cannon", "blast-burn", "hyper-beam",
        "draco-meteor", "shadow-force", "origin-pulse", "precipice-blades",
        "psystrike", "roar-of-time", "spacial-rend", "volt-tackle",
        "doom-desire", "aeroblast", "sacred-fire", "judgment"
      ]
    }
  };

  // CATÁLOGO DE OBJETOS PASIVOS (HELD ITEMS)
  // ========================================================
  const PASSIVE_ITEMS = [
    { id: "leftovers", name: "Restos", icon: "🍎", desc: "Regeneración de vida continua" },
    { id: "magnet", name: "Imán", icon: "🧲", desc: "Aumenta radio de recogida de orbes" },
    { id: "scope-lens", name: "Periscopio", icon: "🎯", desc: "Aumenta la probabilidad de crítico" },
    { id: "choice-band", name: "Cinta Elegida", icon: "🥋", desc: "Aumenta el poder de ataque general" },
    { id: "exp-share", name: "Repartir Exp", icon: "🎓", desc: "Multiplica la experiencia obtenida" },
    { id: "amulet-coin", name: "Moneda Amuleto", icon: "🪙", desc: "Aumenta monedas recogidas" },
    { id: "quick-claw", name: "Garra Rápida", icon: "⚡", desc: "Aumenta velocidad de movimiento" },
    { id: "charcoal", name: "Carbón", icon: "🔥", desc: "Potencia todos los ataques de Fuego" },
    { id: "mystic-water", name: "Agua Mística", icon: "💧", desc: "Potencia todos los ataques de Agua" },
    { id: "miracle-seed", name: "Semilla Milagro", icon: "🌿", desc: "Potencia todos los ataques de Planta" },
    { id: "magnetite", name: "Imán Eléctrico", icon: "⚡", desc: "Potencia todos los ataques Eléctricos" },
    { id: "never-melt-ice", name: "Hielo Eterno", icon: "❄️", desc: "Potencia todos los ataques de Hielo" },
    { id: "dragon-fang", name: "Colmillo Dragón", icon: "🐉", desc: "Potencia todos los ataques Dragón" },
    { id: "twisted-spoon", name: "Cuchara Torcida", icon: "🔮", desc: "Potencia todos los ataques Psíquicos" },
    { id: "spell-tag", name: "Hechizo", icon: "👻", desc: "Potencia todos los ataques Fantasma" },
    { id: "black-glasses", name: "Gafas de Sol", icon: "🌑", desc: "Potencia todos los ataques Siniestros" },
    { id: "metal-coat", name: "Revest. Metálico", icon: "🛡️", desc: "Potencia todos los ataques Acero" },
    { id: "black-belt", name: "Cinturón Negro", icon: "🥊", desc: "Potencia todos los ataques Lucha" },
    { id: "soft-sand", name: "Arena Fina", icon: "🌍", desc: "Potencia todos los ataques Tierra" },
    { id: "hard-stone", name: "Piedra Dura", icon: "🪨", desc: "Potencia todos los ataques Roca" },
    { id: "sharp-beak", name: "Pico Afilado", icon: "🦅", desc: "Potencia todos los ataques Volador" },
    { id: "poison-barb", name: "Flecha Venenosa", icon: "☠️", desc: "Potencia todos los ataques Veneno" },
    { id: "silver-powder", name: "Polvo Plata", icon: "🐛", desc: "Potencia todos los ataques Bicho" },
    { id: "silk-scarf", name: "Pañuelo Seda", icon: "⭐", desc: "Potencia todos los ataques Normal" },
    { id: "fairy-feather", name: "Pluma Hada", icon: "✨", desc: "Potencia todos los ataques Hada" }
  ];

  // Lista plana de todos los ataques conocidos
  const KNOWN_MOVES = Array.from(new Set(
    Object.values(MOVES_BY_TYPE).flatMap(t => t.moves)
  )).sort();

  // Validador y normalizador de ID según el registro interno del motor
  function getValidGameMoveId(moveId) {
    if (!moveId || typeof moveId !== "string") return null;
    const target = moveId.trim().toLowerCase();
    const targetClean = target.replace(/[-_\s]/g, "");
    const ns = window._psGameNS;
    if (!ns) return target;

    // 1. Buscar en ns.Moves.BY_ID
    if (ns.Moves && ns.Moves.BY_ID && typeof ns.Moves.BY_ID === "object") {
      for (let k in ns.Moves.BY_ID) {
        if (k.toLowerCase() === target || k.toLowerCase().replace(/[-_\s]/g, "") === targetClean) {
          return k;
        }
      }
    }

    // 2. Buscar en ns.Moves.LIST
    if (ns.Moves && Array.isArray(ns.Moves.LIST)) {
      for (let item of ns.Moves.LIST) {
        const id = typeof item === "string" ? item : item.id || item.name;
        if (id && (id.toLowerCase() === target || id.toLowerCase().replace(/[-_\s]/g, "") === targetClean)) {
          return id;
        }
      }
    }

    // 3. Buscar en ns.Moves directamente
    if (ns.Moves && typeof ns.Moves === "object") {
      for (let k in ns.Moves) {
        if (k.toLowerCase() === target || k.toLowerCase().replace(/[-_\s]/g, "") === targetClean) {
          return k;
        }
      }
    }

    // 4. Buscar en ns.TM_MOVES
    if (ns.TM_MOVES && typeof ns.TM_MOVES === "object") {
      for (let k in ns.TM_MOVES) {
        if (k.toLowerCase() === target || k.toLowerCase().replace(/[-_\s]/g, "") === targetClean) {
          return k;
        }
      }
    }

    if (ns.Moves) {
      return null;
    }

    return target;
  }

  function getMovesByType() {
    const result = {};
    for (const [key, val] of Object.entries(MOVES_BY_TYPE)) {
      result[key] = {
        name: val.name,
        icon: val.icon,
        color: val.color,
        bg: val.bg,
        border: val.border,
        moves: [...val.moves]
      };
    }

    const ns = window._psGameNS;
    if (ns) {
      const knownSet = new Set(KNOWN_MOVES);
      const extraMoves = new Set();

      if (ns.Moves) {
        if (ns.Moves.BY_ID && typeof ns.Moves.BY_ID === "object") {
          for (const [id, moveDef] of Object.entries(ns.Moves.BY_ID)) {
            const cleanId = id.trim().toLowerCase();
            if (!cleanId) continue;
            const moveType = (moveDef && moveDef.type) ? String(moveDef.type).toLowerCase() : null;
            if (moveType && result[moveType] && !result[moveType].moves.includes(cleanId)) {
              result[moveType].moves.push(cleanId);
              knownSet.add(cleanId);
            } else if (!knownSet.has(cleanId)) {
              extraMoves.add(cleanId);
            }
          }
        }
        if (Array.isArray(ns.Moves.LIST)) {
          ns.Moves.LIST.forEach(m => {
            const id = (typeof m === "string") ? m : m.id || m.name;
            if (!id) return;
            const cleanId = id.trim().toLowerCase();
            const moveType = (m && m.type) ? String(m.type).toLowerCase() : null;
            if (moveType && result[moveType] && !result[moveType].moves.includes(cleanId)) {
              result[moveType].moves.push(cleanId);
              knownSet.add(cleanId);
            } else if (!knownSet.has(cleanId)) {
              extraMoves.add(cleanId);
            }
          });
        }
      }

      if (extraMoves.size > 0) {
        result["extra"] = {
          name: "Detectados del Motor",
          icon: "🔍",
          color: "#38bdf8",
          bg: "rgba(56, 189, 248, 0.15)",
          border: "#0284c7",
          moves: Array.from(extraMoves).sort()
        };
      }
    }

    return result;
  }

  function getAllAvailableMoves() {
    const list = new Set(KNOWN_MOVES);
    const catalog = getMovesByType();
    Object.values(catalog).forEach(cat => {
      cat.moves.forEach(m => list.add(m));
    });
    return Array.from(list).sort();
  }

  // 1. ELEVAR ATAQUE A NIVEL MÁXIMO CON PROTECCIÓN CONTRA OVERFLOW
  // ========================================================
  function maxOutMove(m, player) {
    if (!m || typeof m !== "object") return false;

    const moveId = (m.id || m.key || (m.def && (m.def.id || m.def.key)) || "").toLowerCase();

    // Comprobar si es un ataque supremo o fusión
    const supremeList = MOVES_BY_TYPE.supreme?.moves || [];
    const isSupreme = supremeList.includes(moveId);

    // Detectar el límite real del ataque
    let targetMax = 5;
    if (isSupreme) {
      targetMax = 1;
    } else if (typeof m.maxLvl === "number" && m.maxLvl > 0) {
      targetMax = m.maxLvl;
    } else if (typeof m.maxLevel === "number" && m.maxLevel > 0) {
      targetMax = m.maxLevel;
    } else if (typeof m.maxRank === "number" && m.maxRank > 0) {
      targetMax = m.maxRank;
    } else if (m.def) {
      if (typeof m.def.maxLvl === "number" && m.def.maxLvl > 0) targetMax = m.def.maxLvl;
      else if (typeof m.def.maxLevel === "number" && m.def.maxLevel > 0) targetMax = m.def.maxLevel;
      else if (Array.isArray(m.def.levels)) targetMax = m.def.levels.length;
      else if (Array.isArray(m.def.stats)) targetMax = m.def.stats.length;
      else if (Array.isArray(m.def.ranks)) targetMax = m.def.ranks.length;
    } else if (Array.isArray(m.levels)) {
      targetMax = m.levels.length;
    }

    // Subir nivel usando exclusivamente métodos legítimos del motor
    let safety = 0;
    while (safety < 20) {
      safety++;
      const current = m.lvl || m.level || m.rank || 1;
      if (current >= targetMax) break;

      let called = false;
      if (typeof m.upgrade === "function") {
        try { m.upgrade(); called = true; } catch (e) {}
      } else if (typeof m.levelUp === "function") {
        try { m.levelUp(); called = true; } catch (e) {}
      } else if (player && typeof player.upgradeMove === "function") {
        try { player.upgradeMove(m); called = true; } catch (e) {}
      } else if (player && typeof player.levelUpMove === "function") {
        try { player.levelUpMove(m.id || m.key || m); called = true; } catch (e) {}
      }

      if (!called) break;
    }

    // Sincronizar sin superar targetMax
    const finalLvl = Math.max(1, Math.min(targetMax, 5));
    if ("lvl" in m && m.lvl < finalLvl && !isSupreme) m.lvl = finalLvl;
    if ("level" in m && m.level < finalLvl && !isSupreme) m.level = finalLvl;
    if ("rank" in m && m.rank < finalLvl && !isSupreme) m.rank = finalLvl;
    if ("tier" in m && m.tier < finalLvl && !isSupreme) m.tier = finalLvl;

    return true;
  }

  function maxOutAllMoves(player) {
    if (!player) player = window._psPlayerInstance;
    if (!player || !player.moves) return 0;

    let count = 0;
    const moveList = Array.isArray(player.moves) ? player.moves : Object.values(player.moves);
    moveList.forEach(m => {
      if (m && typeof m === "object") {
        if (maxOutMove(m, player)) count++;
      }
    });

    return count;
  }

  // 2. MOTOR DE FUSIÓN SEGURO
  // ========================================================
  function triggerMoveFusions(player) {
    if (!player) player = window._psPlayerInstance;
    if (!player || typeof player.fuse !== "function") return 0;
    let fusedTotal = 0;

    try {
      maxOutAllMoves(player);

      let safetyLoop = 0;
      while (safetyLoop < 10) {
        safetyLoop++;
        const opts = (typeof player.bondOptions === "function") ? player.bondOptions() : null;
        if (!opts) break;

        // Modo Pareja
        if (opts.mode === "pair" && opts.loose && opts.loose.length >= 2) {
          try {
            player.fuse([opts.loose[0], opts.loose[1]]);
            fusedTotal++;
            maxOutAllMoves(player);
            continue;
          } catch (ePair) {
            break;
          }
        }

        // Modo Añadir a grupo preexistente
        if (opts.mode === "add" && opts.group && opts.loose && opts.loose.length >= 1) {
          try {
            player.fuse(opts.group, opts.loose[0]);
            fusedTotal++;
            maxOutAllMoves(player);
            continue;
          } catch (eAdd1) {
            try {
              player.fuse([...opts.group, opts.loose[0]]);
              fusedTotal++;
              maxOutAllMoves(player);
              continue;
            } catch (eAdd2) {
              break;
            }
          }
        }

        break;
      }

      maxOutAllMoves(player);
    } catch (err) {
      console.warn("[PokéSurvivor Mod] Excepción en triggerMoveFusions:", err);
    }

    return fusedTotal;
  }

  // 3. INYECCIÓN DE ATAQUES CON VALIDACIÓN Y CONTROL DE RANURAS (SLOTS)
  // ========================================================
  function injectCustomMoves(player, movesList = null) {
    if (!player) player = window._psPlayerInstance;
    if (!player || typeof player.addMove !== "function") return 0;

    const list = movesList || window._psState.customMoves;
    if (!Array.isArray(list)) return 0;

    const maxSlots = player.maxMoves || player.maxSlots || 4;
    let added = 0;

    list.forEach(moveId => {
      if (!moveId || typeof moveId !== "string") return;
      const cleanRaw = moveId.trim().toLowerCase();
      if (!cleanRaw) return;

      const validId = getValidGameMoveId(cleanRaw);
      if (!validId) {
        console.warn(`[PokéSurvivor Mod] El ataque [${cleanRaw}] no existe en las tablas del juego.`);
        return;
      }

      const currentMoves = Array.isArray(player.moves) ? player.moves : Object.values(player.moves || {});
      const alreadyHas = currentMoves.some(existing => {
        if (!existing) return false;
        const id = (existing.id || existing.key || "").toLowerCase();
        return id === validId.toLowerCase();
      });
      if (alreadyHas) return;

      if (currentMoves.length >= maxSlots) {
        console.warn(`[PokéSurvivor Mod] Límite de ${maxSlots} slots alcanzado. No se inyecta ${validId}`);
        return;
      }

      try {
        player.addMove(validId);
        added++;
      } catch (err) {
        console.warn("[PokéSurvivor Mod] Error al llamar a addMove:", validId, err);
      }
    });

    if (window._psEngine && typeof window._psEngine.sanitizeAndShieldMoves === "function") {
      window._psEngine.sanitizeAndShieldMoves(player);
    }

    maxOutAllMoves(player);

    return added;
  }

  function injectSingleMove(moveName, player) {
    if (!player) player = window._psPlayerInstance;
    if (!player || typeof player.addMove !== "function") return false;
    if (!moveName || typeof moveName !== "string") return false;
    const cleanRaw = moveName.trim().toLowerCase();
    if (!cleanRaw) return false;

    const validId = getValidGameMoveId(cleanRaw);
    if (!validId) {
      if (window._psUI) {
        const toast = document.getElementById("ps-toast");
        if (toast) toast.innerText = `⚠️ [${cleanRaw}] no existe en este juego.`;
      }
      return false;
    }

    const currentMoves = Array.isArray(player.moves) ? player.moves : Object.values(player.moves || {});
    const maxSlots = player.maxMoves || player.maxSlots || 4;

    if (currentMoves.length >= maxSlots) {
      const toast = document.getElementById("ps-toast");
      if (toast) toast.innerText = `⚠️ Límite de ${maxSlots} ataques alcanzado en el Pokémon.`;
      return false;
    }

    try {
      player.addMove(validId);
      if (window._psEngine && typeof window._psEngine.sanitizeAndShieldMoves === "function") {
        window._psEngine.sanitizeAndShieldMoves(player);
      }
      maxOutAllMoves(player);
      return true;
    } catch (err) {
      console.warn("[PokéSurvivor Mod] Error al inyectar ataque individual:", validId, err);
      return false;
    }
  }

  // 4. GESTOR DE OBJETOS PASIVOS (HELD ITEMS)
  // ========================================================
  function injectSingleItem(itemId, player) {
    if (!player) player = window._psPlayerInstance;
    if (!player || !itemId) return false;
    const clean = itemId.trim().toLowerCase();

    // 1. Probar método nativo addItem
    if (typeof player.addItem === "function") {
      try { player.addItem(clean); return true; } catch (e) {}
    }
    // 2. Probar addPassive
    if (typeof player.addPassive === "function") {
      try { player.addPassive(clean); return true; } catch (e) {}
    }
    // 3. Probar equip
    if (typeof player.equip === "function") {
      try { player.equip(clean); return true; } catch (e) {}
    }
    // 4. Inserción directa en colección items
    if (Array.isArray(player.items)) {
      if (!player.items.some(x => (typeof x === "string" ? x : x.id || x.key) === clean)) {
        player.items.push(clean);
        return true;
      }
    }
    return false;
  }

  function injectCustomItems(player, itemsList = null) {
    if (!player) player = window._psPlayerInstance;
    if (!player) return 0;
    const list = itemsList || window._psState.customItems;
    if (!Array.isArray(list)) return 0;

    let count = 0;
    list.forEach(itemId => {
      if (injectSingleItem(itemId, player)) count++;
    });

    maxOutAllItems(player);
    return count;
  }

  function maxOutAllItems(player) {
    if (!player) player = window._psPlayerInstance;
    if (!player) return 0;
    let count = 0;
    const items = Array.isArray(player.items) ? player.items : (player.items && typeof player.items === "object" ? Object.values(player.items) : []);
    items.forEach(it => {
      if (it && typeof it === "object") {
        const max = it.maxLvl || it.maxLevel || 5;
        if (typeof it.upgrade === "function") {
          for (let s = 0; s < 10; s++) {
            if ((it.lvl || it.level || 1) >= max) break;
            try { it.upgrade(); } catch (e) {}
          }
        }
        if ("lvl" in it) it.lvl = max;
        if ("level" in it) it.level = max;
        count++;
      }
    });
    return count;
  }

  window._psMoves = {
    KNOWN_MOVES,
    MOVES_BY_TYPE,
    PASSIVE_ITEMS,
    getValidGameMoveId,
    getMovesByType,
    getAllAvailableMoves,
    maxOutMove,
    maxOutAllMoves,
    triggerMoveFusions,
    injectCustomMoves,
    injectSingleMove,
    injectSingleItem,
    injectCustomItems,
    maxOutAllItems
  };
})();
