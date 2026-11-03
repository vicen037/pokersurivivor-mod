(() => {
  // 7. INTERFAZ GRÁFICA MODERNA (Glassmorphism UI)
  // ========================================================
  function updateBadge(ok) {
    const b = document.getElementById("ps-badge-status");
    if (b) {
      b.innerText = ok ? "ACTIVO" : "BUSCANDO";
      b.style.background = ok ? "#10b981" : "#ef4444";
    }
  }

  function initUI() {
    if (document.getElementById("ps-root-btn")) return;

    // Estilos CSS
    const style = document.createElement("style");
    style.innerText = `
      #ps-mod-window * { box-sizing: border-box; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
      .ps-tab-btn { flex: 1; padding: 9px 2px; background: transparent; border: none; color: #94a3b8; font-size: 11px; font-weight: 700; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
      .ps-tab-btn.active { color: #38bdf8; border-bottom: 2px solid #38bdf8; background: rgba(56, 189, 248, 0.05); }
      .ps-btn { border: none; border-radius: 6px; padding: 7px 10px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; justify-content: center; gap: 5px; }
      .ps-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
      .ps-btn:active { transform: translateY(0); }
      .ps-card { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 8px; padding: 10px; margin-bottom: 10px; }
      .ps-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .ps-row:last-child { margin-bottom: 0; }
      .ps-input { background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #f8fafc; padding: 5px 8px; font-size: 12px; }
      .ps-chip { background: #1e293b; border: 1px solid #475569; border-radius: 12px; padding: 3px 8px; font-size: 10px; color: #e2e8f0; cursor: pointer; transition: 0.15s; }
      .ps-chip:hover { background: #38bdf8; color: #0f172a; border-color: #38bdf8; font-weight: bold; }
      .ps-switch { position: relative; width: 44px; height: 22px; cursor: pointer; }
      .ps-switch input { opacity: 0; width: 0; height: 0; }
      .ps-slider { position: absolute; top:0; left:0; right:0; bottom:0; background: #334155; border-radius: 22px; transition: 0.2s; }
      .ps-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.2s; }
      input:checked + .ps-slider { background: #10b981; }
      input:checked + .ps-slider:before { transform: translateX(22px); }

      /* Estilos para el catálogo de tipos e ítems */
      .ps-type-filter-btn { padding: 4px 8px; border-radius: 14px; font-size: 10px; font-weight: 700; cursor: pointer; border: 1px solid #334155; background: #1e293b; color: #94a3b8; transition: all 0.15s; display: inline-flex; align-items: center; gap: 3px; white-space: nowrap; }
      .ps-type-filter-btn:hover { filter: brightness(1.2); color: #fff; }
      .ps-type-filter-btn.active { background: #0284c7; color: #fff; border-color: #38bdf8; box-shadow: 0 0 8px rgba(56, 189, 248, 0.4); }
      .ps-move-card { border-radius: 7px; padding: 7px; margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.08); }
      .ps-move-item { display: inline-flex; align-items: center; justify-content: space-between; gap: 5px; border-radius: 10px; padding: 3px 8px; font-size: 10px; font-weight: 600; cursor: pointer; transition: all 0.15s; margin: 2px; }
      .ps-move-item:hover { filter: brightness(1.3); transform: translateY(-1px); }
      .ps-move-btn-quick, .ps-item-btn-quick { background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: #fff; font-size: 9px; padding: 1px 5px; cursor: pointer; transition: 0.1s; }
      .ps-move-btn-quick:hover, .ps-item-btn-quick:hover { background: #10b981; color: #000; font-weight: bold; border-color: #10b981; }
    `;
    document.head.appendChild(style);

    // Botón flotante superior
    const toggle = document.createElement("button");
    toggle.id = "ps-root-btn";
    toggle.innerHTML = `<span style="font-size:16px;">⚡</span> <span style="letter-spacing:0.5px;">MOD MENU</span>`;
    toggle.style.cssText = `
      position: fixed; top: 14px; right: 14px; z-index: 9999999;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: #fff; font-size: 11px; font-weight: 800; border: 1px solid rgba(255,255,255,0.4);
      border-radius: 30px; padding: 8px 16px; cursor: pointer; box-shadow: 0 4px 20px rgba(220, 38, 38, 0.4);
      display: flex; align-items: center; gap: 6px; transition: transform 0.2s;
    `;
    toggle.onmouseover = () => toggle.style.transform = "scale(1.04)";
    toggle.onmouseout = () => toggle.style.transform = "scale(1)";

    // Ventana modal arrastrable
    const win = document.createElement("div");
    win.id = "ps-mod-window";
    win.style.cssText = `
      display: none; position: fixed; top: 60px; right: 14px; z-index: 9999999;
      width: 410px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7); overflow: hidden; color: #f1f5f9;
    `;

    win.innerHTML = `
      <!-- ENCABEZADO -->
      <div id="ps-drag-bar" style="padding: 12px 14px; background: rgba(30, 41, 59, 0.8); border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">🎮</span>
          <span style="font-weight: 800; font-size: 13px; letter-spacing: 0.5px; color: #f8fafc;">PokéSurvivor Suite Ultra</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span id="ps-badge-status" style="font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 10px; color: #fff; background: ${window._psEngine && window._psEngine.hooksApplied ? "#10b981" : "#ef4444"};">
            ${window._psEngine && window._psEngine.hooksApplied ? "ACTIVO" : "BUSCANDO"}
          </span>
          <button id="ps-btn-close" style="background: transparent; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; padding: 0 4px;">✕</button>
        </div>
      </div>

      <!-- BARRA DE ACCIÓN RÁPIDA: DESACTIVAR TODO / POR DEFECTO -->
      <div style="padding: 7px 12px; background: rgba(30, 41, 59, 0.95); border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; gap: 8px; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 5px;">
          <span style="font-size: 11px;">⚙️</span>
          <span style="font-size: 10px; color: #cbd5e1; font-weight: 700;">MODS & CHEATS:</span>
        </div>
        <button id="ps-btn-reset-all" class="ps-btn" style="background: linear-gradient(135deg, #ef4444, #b91c1c); color: #fff; padding: 5px 12px; font-size: 10px; font-weight: 800; border-radius: 5px; border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 2px 8px rgba(239, 68, 68, 0.35);" title="Desactivar todos los trucos y restablecer daño, vida, velocidad y multiplicadores por defecto según el juego">
          🔄 DESACTIVAR TODO (POR DEFECTO)
        </button>
      </div>

      <!-- PESTAÑAS -->
      <div style="display: flex; background: rgba(15, 23, 42, 0.7); border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <button class="ps-tab-btn active" data-tab="tab-combat">⚔️ COMBATE</button>
        <button class="ps-tab-btn" data-tab="tab-moves">🎯 ARSENAL</button>
        <button class="ps-tab-btn" data-tab="tab-move">⚡ JUEGO</button>
        <button class="ps-tab-btn" data-tab="tab-save">🏆 PROGRESO</button>
        <button class="ps-tab-btn" data-tab="tab-sys">💾 SISTEMA</button>
      </div>

      <!-- CONTENIDO DE PESTAÑAS -->
      <div style="padding: 14px; max-height: 500px; overflow-y: auto;">
        
        <!-- PESTAÑA 1: COMBATE -->
        <div id="tab-combat" class="ps-tab-pane">
          <!-- BOTÓN RÁPIDO RESTABLECER VALORES -->
          <div style="margin-bottom: 10px;">
            <button id="ps-btn-reset-all-combat" class="ps-btn" style="width: 100%; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; padding: 7px 10px; font-size: 11px; font-weight: 700;">
              🔄 Restablecer Todo por Defecto (1x / Vanilla)
            </button>
          </div>
          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">VENTAJAS DIVINAS</div>
            <div class="ps-row">
              <span style="font-size: 12px; font-weight: 600;">🛡️ Modo Dios (Inmortal)</span>
              <label class="ps-switch">
                <input type="checkbox" id="ps-sw-god" ${window._psState.godMode ? "checked" : ""}>
                <span class="ps-slider"></span>
              </label>
            </div>
            <div class="ps-row" style="margin-top: 8px;">
              <span style="font-size: 12px; font-weight: 600;">⚡ Sin Enfriamiento (No CD)</span>
              <label class="ps-switch">
                <input type="checkbox" id="ps-sw-nocd" ${window._psState.noCd ? "checked" : ""}>
                <span class="ps-slider"></span>
              </label>
            </div>
            <div class="ps-row" style="margin-top: 8px;">
              <span style="font-size: 12px; font-weight: 600;">🎯 100% Críticos (Always Crit)</span>
              <label class="ps-switch">
                <input type="checkbox" id="ps-sw-crit" ${window._psState.alwaysCrit ? "checked" : ""}>
                <span class="ps-slider"></span>
              </label>
            </div>
            <div class="ps-row" style="margin-top: 8px;">
              <span style="font-size: 12px; font-weight: 600;">🍀 Suerte Máxima (Drops y Shinies)</span>
              <label class="ps-switch">
                <input type="checkbox" id="ps-sw-luck" ${window._psState.maxLuck ? "checked" : ""}>
                <span class="ps-slider"></span>
              </label>
            </div>
            <div class="ps-row" style="margin-top: 8px;">
              <span style="font-size: 12px; font-weight: 600;">☠️ Aura de Muerte (Touch of Death)</span>
              <label class="ps-switch">
                <input type="checkbox" id="ps-sw-aura" ${window._psState.deathAura ? "checked" : ""}>
                <span class="ps-slider"></span>
              </label>
            </div>
            <div class="ps-row" style="margin-top: 8px;">
              <span style="font-size: 12px; font-weight: 600;">❄️ Congelar Enemigos (Freeze)</span>
              <label class="ps-switch">
                <input type="checkbox" id="ps-sw-freeze" ${window._psState.freezeEnemies ? "checked" : ""}>
                <span class="ps-slider"></span>
              </label>
            </div>
          </div>

          <!-- MULTIPLICADOR DE DAÑO -->
          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">⚔️ DAÑO INFLIGIDO (MULTIPLICADOR LIBRE)</div>
            <div style="display: flex; gap: 5px; align-items: center; margin-bottom: 6px;">
              <input type="number" id="ps-in-mult-dmg" class="ps-input" value="${window._psState.dmgMult}" min="1" step="any" placeholder="Ej: 1000" style="flex: 1; font-weight: 700; color: #f87171;">
              <button class="ps-btn ps-btn-set-custom" data-type="dmg" style="background: #2563eb; color: #fff; padding: 6px 10px;">Fijar</button>
              <button class="ps-btn ps-btn-max-val" data-type="dmg" data-v="999999999" style="background: linear-gradient(135deg, #ef4444, #b91c1c); color: #fff; padding: 6px 10px; font-weight: 800;" title="Daño absoluto (999M)">💥 MÁX (999M)</button>
            </div>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              <button class="ps-btn ps-btn-val" data-type="dmg" data-v="1" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x1</button>
              <button class="ps-btn ps-btn-val" data-type="dmg" data-v="10" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x10</button>
              <button class="ps-btn ps-btn-val" data-type="dmg" data-v="100" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x100</button>
              <button class="ps-btn ps-btn-val" data-type="dmg" data-v="1000" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x1,000</button>
              <button class="ps-btn ps-btn-val" data-type="dmg" data-v="100000" style="background:#7c3aed; color:#fff; padding: 3px 7px; font-size: 10px;">x100K</button>
              <button class="ps-btn ps-btn-val" data-type="dmg" data-v="1000000" style="background:#dc2626; color:#fff; padding: 3px 7px; font-size: 10px;">x1M</button>
            </div>
          </div>

          <!-- MULTIPLICADOR DE VIDA MÁXIMA -->
          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">🛡️ VIDA MÁXIMA (MULTIPLICADOR LIBRE)</div>
            <div style="display: flex; gap: 5px; align-items: center; margin-bottom: 6px;">
              <input type="number" id="ps-in-mult-hp" class="ps-input" value="${window._psState.hpMult}" min="1" step="any" placeholder="Ej: 50" style="flex: 1; font-weight: 700; color: #60a5fa;">
              <button class="ps-btn ps-btn-set-custom" data-type="hp" style="background: #2563eb; color: #fff; padding: 6px 10px;">Fijar</button>
              <button class="ps-btn ps-btn-max-val" data-type="hp" data-v="999999999" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; padding: 6px 10px; font-weight: 800;" title="Vida máxima (999M)">🛡️ MÁX (999M)</button>
            </div>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              <button class="ps-btn ps-btn-val" data-type="hp" data-v="1" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x1</button>
              <button class="ps-btn ps-btn-val" data-type="hp" data-v="5" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x5</button>
              <button class="ps-btn ps-btn-val" data-type="hp" data-v="20" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x20</button>
              <button class="ps-btn ps-btn-val" data-type="hp" data-v="100" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x100</button>
              <button class="ps-btn ps-btn-val" data-type="hp" data-v="1000" style="background:#2563eb; color:#fff; padding: 3px 7px; font-size: 10px;">x1,000</button>
              <button class="ps-btn ps-btn-val" data-type="hp" data-v="1000000" style="background:#1d4ed8; color:#fff; padding: 3px 7px; font-size: 10px;">x1M</button>
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button id="ps-btn-heal" class="ps-btn" style="flex: 1; background: #059669; color: #fff;">💖 Curar 100% [H]</button>
            <button id="ps-btn-nuke" class="ps-btn" style="flex: 1; background: #b91c1c; color: #fff;">💣 Limpiar [N]</button>
          </div>
        </div>

        <!-- PESTAÑA 2: ATAQUES Y OBJETOS PASIVOS -->
        <div id="tab-moves" class="ps-tab-pane" style="display:none;">
          <div class="ps-card">
            <div class="ps-row">
              <div>
                <div style="font-size: 12px; font-weight: 600;">🚀 Inyectar Ataques al Iniciar</div>
                <div style="font-size: 10px; color: #94a3b8;">Apareces con tu set al empezar</div>
              </div>
              <label class="ps-switch">
                <input type="checkbox" id="ps-sw-moves-enabled" ${window._psState.customMovesEnabled ? "checked" : ""}>
                <span class="ps-slider"></span>
              </label>
            </div>
            <div class="ps-row" style="margin-top: 8px;">
              <div>
                <div style="font-size: 12px; font-weight: 600;">⭐ Auto-Maxear Ataques y Pasivas</div>
                <div style="font-size: 10px; color: #94a3b8;">Mantiene todo al nivel máximo</div>
              </div>
              <label class="ps-switch">
                <input type="checkbox" id="ps-sw-automax" ${window._psState.autoMaxMoves ? "checked" : ""}>
                <span class="ps-slider"></span>
              </label>
            </div>
            <div class="ps-row" style="margin-top: 8px;">
              <div>
                <div style="font-size: 12px; font-weight: 600;">🧬 Auto-Fusionar en Vivo</div>
                <div style="font-size: 10px; color: #94a3b8;">Maxea y fusiona recetas compatibles</div>
              </div>
              <label class="ps-switch">
                <input type="checkbox" id="ps-sw-autofuse" ${window._psState.autoFuse ? "checked" : ""}>
                <span class="ps-slider"></span>
              </label>
            </div>
          </div>

          <!-- ENTRADA DIRECTA DE ATAQUES -->
          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 6px;">🎯 ATAQUE SELECCIONADO:</div>
            <div style="display: flex; gap: 5px; margin-bottom: 8px;">
              <input type="text" id="ps-in-custom-move" class="ps-input" placeholder="Nombre (ej: flamethrower, origin-pulse)" list="ps-move-suggestions" style="flex: 1; font-size: 11px;">
              <button id="ps-btn-add-move" class="ps-btn" style="background: #2563eb; color: #fff; padding: 6px 9px;">➕ Lista</button>
              <button id="ps-btn-inject-single" class="ps-btn" style="background: #059669; color: #fff; padding: 6px 9px;">⚡ Ya</button>
            </div>
            <datalist id="ps-move-suggestions"></datalist>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 10px; color: #94a3b8; font-weight: 600;">LISTA DE ATAQUES ACTIVOS:</span>
              <button id="ps-btn-clear-moves" style="background: transparent; border: none; color: #ef4444; font-size: 10px; cursor: pointer; text-decoration: underline;">Limpiar</button>
            </div>
            <textarea id="ps-txt-moves" class="ps-input" style="width: 100%; height: 44px; resize: none; margin-bottom: 8px; font-family: monospace; font-size: 11px;">${window._psState.customMoves.join(", ")}</textarea>

            <div style="display: flex; gap: 6px; margin-bottom: 6px;">
              <button id="ps-btn-save-moves" class="ps-btn" style="flex: 1; background: #334155; color: #fff;">💾 Guardar Lista</button>
              <button id="ps-btn-inject-now" class="ps-btn" style="flex: 1; background: #2563eb; color: #fff;">⚡ Inyectar Lista</button>
            </div>

            <div style="display: flex; gap: 6px;">
              <button id="ps-btn-max-moves-now" class="ps-btn" style="flex: 1; background: #d97706; color: #fff;">⭐ Subir a Nivel Máx.</button>
              <button id="ps-btn-fuse-now" class="ps-btn" style="flex: 1; background: #7c3aed; color: #fff;">🧬 Maxear y Fusionar</button>
            </div>
          </div>

          <!-- OBJETOS PASIVOS (HELD ITEMS) -->
          <div class="ps-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div style="font-size: 11px; font-weight: 700; color: #f59e0b;">🎒 OBJETOS PASIVOS (HELD ITEMS):</div>
              <label class="ps-switch" style="width: 36px; height: 18px;">
                <input type="checkbox" id="ps-sw-items-enabled" ${window._psState.customItemsEnabled ? "checked" : ""}>
                <span class="ps-slider"></span>
              </label>
            </div>

            <div style="display: flex; gap: 5px; margin-bottom: 6px;">
              <input type="text" id="ps-in-custom-item" class="ps-input" placeholder="Nombre (ej: leftovers, magnet, scope-lens)" style="flex: 1; font-size: 11px;">
              <button id="ps-btn-add-item" class="ps-btn" style="background: #2563eb; color: #fff; padding: 5px 8px;">➕ Lista</button>
              <button id="ps-btn-inject-item-single" class="ps-btn" style="background: #059669; color: #fff; padding: 5px 8px;">⚡ Ya</button>
            </div>

            <textarea id="ps-txt-items" class="ps-input" style="width: 100%; height: 36px; resize: none; margin-bottom: 6px; font-family: monospace; font-size: 11px;">${window._psState.customItems.join(", ")}</textarea>

            <div style="display: flex; gap: 6px; margin-bottom: 8px;">
              <button id="ps-btn-save-items" class="ps-btn" style="flex: 1; background: #334155; color: #fff; font-size: 10px;">💾 Guardar Pasivas</button>
              <button id="ps-btn-inject-items-now" class="ps-btn" style="flex: 1; background: #d97706; color: #fff; font-size: 10px;">⚡ Inyectar Pasivas</button>
              <button id="ps-btn-max-items-now" class="ps-btn" style="flex: 1; background: #7c3aed; color: #fff; font-size: 10px;">⭐ Maxear Pasivas</button>
            </div>

            <div style="font-size: 9px; color: #94a3b8; margin-bottom: 4px; font-weight: 600;">CATÁLOGO RÁPIDO DE PASIVAS:</div>
            <div id="ps-items-catalog-render" style="display: flex; flex-wrap: wrap; gap: 4px; max-height: 120px; overflow-y: auto;"></div>
          </div>

          <!-- CATÁLOGO COMPLETO DE ATAQUES SEPARADO POR TIPOS -->
          <div class="ps-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div style="font-size: 11px; font-weight: 700; color: #38bdf8;">CATÁLOGO DE ATAQUES POR TIPO:</div>
              <div style="font-size: 9px; color: #94a3b8;">Haz clic en un ataque</div>
            </div>

            <!-- Selector de Acción al hacer clic -->
            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 6px; padding: 5px 8px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 10px; color: #94a3b8; font-weight: 600;">Acción al pulsar:</span>
              <div style="display: flex; gap: 4px;">
                <button id="ps-btn-action-inject" class="ps-btn" style="padding: 3px 8px; font-size: 10px; background: ${window._psState.moveClickAction === 'inject' ? '#059669' : '#334155'}; color: #fff;">⚡ Inyectar Directo</button>
                <button id="ps-btn-action-list" class="ps-btn" style="padding: 3px 8px; font-size: 10px; background: ${window._psState.moveClickAction === 'list' ? '#2563eb' : '#334155'}; color: #fff;">➕ Añadir a Lista</button>
              </div>
            </div>

            <!-- Buscador en tiempo real -->
            <div style="margin-bottom: 8px;">
              <input type="text" id="ps-in-search-moves" class="ps-input" placeholder="🔍 Filtrar por nombre (ej: flamethrower, hydro, meteor)..." style="width: 100%; font-size: 11px;">
            </div>

            <!-- Filtro de Tipos en barra horizontal con scroll -->
            <div id="ps-type-filter-bar" style="display: flex; gap: 4px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 8px;">
              <button class="ps-type-filter-btn active" data-type="all">🌐 Todos</button>
              <button class="ps-type-filter-btn" data-type="fire">🔥 Fuego</button>
              <button class="ps-type-filter-btn" data-type="water">💧 Agua</button>
              <button class="ps-type-filter-btn" data-type="grass">🌿 Planta</button>
              <button class="ps-type-filter-btn" data-type="electric">⚡ Eléctrico</button>
              <button class="ps-type-filter-btn" data-type="ice">❄️ Hielo</button>
              <button class="ps-type-filter-btn" data-type="dragon">🐉 Dragón</button>
              <button class="ps-type-filter-btn" data-type="psychic">🔮 Psíquico</button>
              <button class="ps-type-filter-btn" data-type="ghost">👻 Fantasma</button>
              <button class="ps-type-filter-btn" data-type="dark">🌑 Siniestro</button>
              <button class="ps-type-filter-btn" data-type="steel">🛡️ Acero</button>
              <button class="ps-type-filter-btn" data-type="fighting">🥊 Lucha</button>
              <button class="ps-type-filter-btn" data-type="ground">🌍 Tierra</button>
              <button class="ps-type-filter-btn" data-type="rock">🪨 Roca</button>
              <button class="ps-type-filter-btn" data-type="flying">🦅 Volador</button>
              <button class="ps-type-filter-btn" data-type="poison">☠️ Veneno</button>
              <button class="ps-type-filter-btn" data-type="bug">🐛 Bicho</button>
              <button class="ps-type-filter-btn" data-type="fairy">✨ Hada</button>
              <button class="ps-type-filter-btn" data-type="normal">⭐ Normal</button>
              <button class="ps-type-filter-btn" data-type="supreme">👑 Supremos</button>
            </div>

            <!-- Contenedor dinámico del catálogo -->
            <div id="ps-catalog-render" style="max-height: 250px; overflow-y: auto; padding-right: 2px;"></div>
          </div>
        </div>

        <!-- PESTAÑA 3: JUGABILIDAD -->
        <div id="tab-move" class="ps-tab-pane" style="display:none;">
          <!-- CÁMARA Y ZOOM (Full Vision) -->
          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">🔍 CÁMARA Y ZOOM (FULL ARENA VISION)</div>
            <div style="display: flex; gap: 5px; align-items: center; margin-bottom: 6px;">
              <input type="number" id="ps-in-cam-zoom" class="ps-input" value="${window._psState.camZoom}" min="0.3" max="2.5" step="0.1" style="width: 70px; font-weight: 700; color: #38bdf8;">
              <button id="ps-btn-set-cam-zoom" class="ps-btn" style="background: #2563eb; color: #fff; padding: 6px 10px;">Fijar</button>
            </div>
            <div style="display: flex; gap: 4px;">
              <button class="ps-btn ps-btn-zoom" data-z="0.5" style="flex: 1; background: #334155; color: #fff; font-size: 10px;">0.5x Gran Angular</button>
              <button class="ps-btn ps-btn-zoom" data-z="0.75" style="flex: 1; background: #334155; color: #fff; font-size: 10px;">0.75x Amplio</button>
              <button class="ps-btn ps-btn-zoom" data-z="1" style="flex: 1; background: #2563eb; color: #fff; font-size: 10px;">1x Normal</button>
            </div>
          </div>

          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">⏱️ ADELANTAR TIEMPO (SALTO EN EL RELOJ)</div>
            <div style="display: flex; gap: 4px; margin-bottom: 8px;">
              <button class="ps-btn ps-btn-jump" data-sec="30" style="flex: 1; background: #334155; color: #fff;">+30s</button>
              <button class="ps-btn ps-btn-jump" data-sec="60" style="flex: 1; background: #2563eb; color: #fff;">+1 min</button>
              <button class="ps-btn ps-btn-jump" data-sec="300" style="flex: 1; background: #7c3aed; color: #fff;">+5 min</button>
              <button class="ps-btn ps-btn-jump" data-sec="600" style="flex: 1; background: #d97706; color: #fff;">+10 min</button>
            </div>
            <div class="ps-row">
              <div style="display: flex; gap: 4px; flex: 1;">
                <input type="number" id="ps-in-time-advance" class="ps-input" value="60" min="1" style="width: 70px; font-size: 11px;">
                <select id="ps-sel-time-unit" class="ps-input" style="font-size: 11px; padding: 4px 6px;">
                  <option value="s">Segundos</option>
                  <option value="m">Minutos</option>
                </select>
              </div>
              <button id="ps-btn-advance-time" class="ps-btn" style="background: #059669; color: #fff;">⏩ Adelantar</button>
            </div>
          </div>

          <!-- SPEEDHACK LIBRE -->
          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">⚡ VELOCIDAD DEL JUEGO (SPEEDHACK)</div>
            <div style="display: flex; gap: 5px; align-items: center; margin-bottom: 6px;">
              <input type="number" id="ps-in-timescale" class="ps-input" value="${window._psState.timeScale}" min="0.1" step="0.5" placeholder="Ej: 3" style="flex: 1; font-weight: 700; color: #38bdf8;">
              <button id="ps-btn-set-timescale" class="ps-btn" style="background: #2563eb; color: #fff; padding: 6px 10px;">Fijar</button>
              <button id="ps-btn-max-timescale" class="ps-btn" style="background: #dc2626; color: #fff; padding: 6px 10px; font-weight: 800;">🚀 x20 Hyper</button>
            </div>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              <button class="ps-btn ps-btn-speed" data-scale="1" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">1x</button>
              <button class="ps-btn ps-btn-speed" data-scale="2" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">2x</button>
              <button class="ps-btn ps-btn-speed" data-scale="3" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">3x</button>
              <button class="ps-btn ps-btn-speed" data-scale="5" style="background:#2563eb; color:#fff; padding: 3px 7px; font-size: 10px;">5x</button>
              <button class="ps-btn ps-btn-speed" data-scale="10" style="background:#dc2626; color:#fff; padding: 3px 7px; font-size: 10px;">10x</button>
            </div>
          </div>

          <div class="ps-card">
            <div class="ps-row">
              <div>
                <div style="font-size: 12px; font-weight: 600;">⏩ Auto-Skip Niveles</div>
                <div style="font-size: 10px; color: #94a3b8;">Cierra cartas consecutivas al instante</div>
              </div>
              <label class="ps-switch">
                <input type="checkbox" id="ps-sw-skip" ${window._psState.autoSkip ? "checked" : ""}>
                <span class="ps-slider"></span>
              </label>
            </div>
            <div class="ps-row" style="margin-top: 8px;">
              <div>
                <div style="font-size: 12px; font-weight: 600;">🎲 Rerolls / Skips Infinitos</div>
                <div style="font-size: 10px; color: #94a3b8;">Nunca se agotan al elegir cartas</div>
              </div>
              <label class="ps-switch">
                <input type="checkbox" id="ps-sw-inf-rerolls" ${window._psState.infRerolls ? "checked" : ""}>
                <span class="ps-slider"></span>
              </label>
            </div>
          </div>

          <!-- MULTIPLICADOR DE EXPERIENCIA -->
          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">⭐ EXPERIENCIA (EXP POR ORBE)</div>
            <div style="display: flex; gap: 5px; align-items: center; margin-bottom: 6px;">
              <input type="number" id="ps-in-mult-exp" class="ps-input" value="${window._psState.expMult}" min="1" step="any" placeholder="Ej: 500" style="flex: 1; font-weight: 700; color: #34d399;">
              <button class="ps-btn ps-btn-set-custom" data-type="exp" style="background: #2563eb; color: #fff; padding: 6px 10px;">Fijar</button>
              <button class="ps-btn ps-btn-max-val" data-type="exp" data-v="999999999" style="background: linear-gradient(135deg, #059669, #047857); color: #fff; padding: 6px 10px; font-weight: 800;" title="EXP máxima (999M)">⭐ MÁX (999M)</button>
            </div>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              <button class="ps-btn ps-btn-val" data-type="exp" data-v="1" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x1</button>
              <button class="ps-btn ps-btn-val" data-type="exp" data-v="10" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x10</button>
              <button class="ps-btn ps-btn-val" data-type="exp" data-v="100" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x100</button>
              <button class="ps-btn ps-btn-val" data-type="exp" data-v="1000" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x1,000</button>
              <button class="ps-btn ps-btn-val" data-type="exp" data-v="50000" style="background:#059669; color:#fff; padding: 3px 7px; font-size: 10px;">x50K</button>
              <button class="ps-btn ps-btn-val" data-type="exp" data-v="1000000" style="background:#047857; color:#fff; padding: 3px 7px; font-size: 10px;">x1M</button>
            </div>
          </div>

          <!-- MULTIPLICADOR DE IMÁN -->
          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">🧲 RANGO DE IMÁN (RECOGIDA)</div>
            <div style="display: flex; gap: 5px; align-items: center; margin-bottom: 6px;">
              <input type="number" id="ps-in-mult-pickup" class="ps-input" value="${window._psState.pickupMult}" min="1" step="any" placeholder="Ej: 100" style="flex: 1; font-weight: 700; color: #c084fc;">
              <button class="ps-btn ps-btn-set-custom" data-type="pickup" style="background: #2563eb; color: #fff; padding: 6px 10px;">Fijar</button>
              <button class="ps-btn ps-btn-max-val" data-type="pickup" data-v="999999999" style="background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff; padding: 6px 10px; font-weight: 800;" title="Absorber toda la arena">🌌 Toda la Arena</button>
            </div>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              <button class="ps-btn ps-btn-val" data-type="pickup" data-v="1" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">Normal</button>
              <button class="ps-btn ps-btn-val" data-type="pickup" data-v="10" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">Medio</button>
              <button class="ps-btn ps-btn-val" data-type="pickup" data-v="100" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">Pantalla</button>
              <button class="ps-btn ps-btn-val" data-type="pickup" data-v="10000" style="background:#7c3aed; color:#fff; padding: 3px 7px; font-size: 10px;">x10,000</button>
              <button class="ps-btn ps-btn-val" data-type="pickup" data-v="1000000" style="background:#6d28d9; color:#fff; padding: 3px 7px; font-size: 10px;">x1M</button>
            </div>
          </div>

          <!-- MULTIPLICADOR DE VELOCIDAD POKÉMON -->
          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">🏃 VELOCIDAD DEL POKÉMON</div>
            <div style="display: flex; gap: 5px; align-items: center; margin-bottom: 6px;">
              <input type="number" id="ps-in-mult-spd" class="ps-input" value="${window._psState.spdMult}" min="0.5" step="0.5" placeholder="Ej: 3" style="flex: 1; font-weight: 700; color: #f59e0b;">
              <button class="ps-btn ps-btn-set-custom" data-type="spd" style="background: #2563eb; color: #fff; padding: 6px 10px;">Fijar</button>
              <button class="ps-btn ps-btn-max-val" data-type="spd" data-v="30" style="background: linear-gradient(135deg, #d97706, #b45309); color: #fff; padding: 6px 10px; font-weight: 800;" title="Velocidad extrema">⚡ Flash (x30)</button>
            </div>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              <button class="ps-btn ps-btn-val" data-type="spd" data-v="1" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x1</button>
              <button class="ps-btn ps-btn-val" data-type="spd" data-v="2" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x2</button>
              <button class="ps-btn ps-btn-val" data-type="spd" data-v="5" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x5</button>
              <button class="ps-btn ps-btn-val" data-type="spd" data-v="10" style="background:#334155; color:#fff; padding: 3px 7px; font-size: 10px;">x10</button>
              <button class="ps-btn ps-btn-val" data-type="spd" data-v="50" style="background:#d97706; color:#fff; padding: 3px 7px; font-size: 10px;">x50</button>
            </div>
          </div>
        </div>

        <!-- PESTAÑA 4: PROGRESO -->
        <div id="tab-save" class="ps-tab-pane" style="display:none;">
          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #f59e0b; margin-bottom: 8px;">MONEDAS, TICKETS Y CARAMELOS (EVENTO)</div>
            <div class="ps-row">
              <span style="font-size: 12px;">🪙 Monedas:</span>
              <input type="number" id="ps-in-coins" class="ps-input" value="999999" style="width: 100px;">
            </div>
            <div class="ps-row">
              <span style="font-size: 12px;">🎟️ Tickets (x1 / x10):</span>
              <div style="display:flex; gap: 4px;">
                <input type="number" id="ps-in-t1" class="ps-input" value="999" style="width: 48px;">
                <input type="number" id="ps-in-t10" class="ps-input" value="100" style="width: 48px;">
              </div>
            </div>
            <div class="ps-row">
              <span style="font-size: 12px;">🍬 Caramelos Evento:</span>
              <input type="number" id="ps-in-candies" class="ps-input" value="99999" style="width: 100px; color: #f472b6; font-weight: 700;">
            </div>
            <div style="display: flex; gap: 4px; margin-bottom: 6px;">
              <button class="ps-btn ps-btn-quick-candy" data-amt="300" style="flex: 1; background: #334155; color: #fff; font-size: 10px;">+300 (1 Skin)</button>
              <button class="ps-btn ps-btn-quick-candy" data-amt="3000" style="flex: 1; background: #334155; color: #fff; font-size: 10px;">+3,000</button>
              <button class="ps-btn ps-btn-quick-candy" data-amt="99999" style="flex: 1; background: #7c3aed; color: #fff; font-size: 10px;">99,999 MÁX</button>
            </div>
            <button id="ps-btn-save-coins" class="ps-btn" style="width: 100%; margin-bottom: 6px; background: #059669; color: #fff;">
              💾 Inyectar Recursos (Monedas, Tickets y Caramelos)
            </button>
            <button id="ps-btn-run-candy" class="ps-btn" style="width: 100%; background: #9333ea; color: #fff; font-size: 11px;">
              🍬 +1,000 Caramelos a Partida en Vivo
            </button>
          </div>

          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">DESBLOQUEO TOTAL</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px;">
              <button id="ps-btn-unlock-all" class="ps-btn" style="background: #2563eb; color: #fff;">📖 Toda la Pokédex</button>
              <button id="ps-btn-unlock-shiny" class="ps-btn" style="background: #d97706; color: #fff;">✨ Todos los Shinies</button>
              <button id="ps-btn-max-all" class="ps-btn" style="background: #7c3aed; color: #fff;">⭐ Maxear Stats</button>
              <button id="ps-btn-unlock-arenas" class="ps-btn" style="background: #475569; color: #fff;">🌋 Todas las Arenas</button>
            </div>
            <button id="ps-btn-unlock-skins" class="ps-btn" style="width: 100%; background: linear-gradient(135deg, #a855f7, #7c3aed); color: #fff; font-size: 11px; font-weight: 800; padding: 8px;" title="Desbloquea instantáneamente todas las skins de bruja (Gengar, Pikachu, Umbreon, etc.)">
              🧙‍♀️ Desbloquear Todas las Skins (Halloween / Brujas)
            </button>
          </div>
        </div>

        <!-- PESTAÑA 5: SISTEMA -->
        <div id="tab-sys" class="ps-tab-pane" style="display:none;">
          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #ef4444; margin-bottom: 6px;">RESTABLECER JUGABILIDAD (POR DEFECTO)</div>
            <div style="font-size: 10px; color: #94a3b8; margin-bottom: 8px;">
              Desactiva todos los trucos de combate y juego (daño, vida, velocidad, exp, imán, cámara, etc.). No modifica monedas, tickets ni consumibles guardados.
            </div>
            <button id="ps-btn-reset-all-sys" class="ps-btn" style="width: 100%; background: #dc2626; color: #fff; font-size: 11px; font-weight: 700;">
              🔄 Desactivar Todo y Dejar Juego por Defecto
            </button>
          </div>

          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-bottom: 6px;">COPIA DE SEGURIDAD</div>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <button id="ps-btn-export" class="ps-btn" style="flex: 1; background: #334155; color: #fff;">⬇️ Exportar JSON</button>
              <button id="ps-btn-import-trigger" class="ps-btn" style="flex: 1; background: #334155; color: #fff;">⬆️ Restaurar JSON</button>
              <input type="file" id="ps-file-import" accept=".json" style="display: none;">
            </div>
          </div>

          <div class="ps-card">
            <div style="font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 6px;">ATAJOS DE TECLADO GLOBALES</div>
            <div style="font-size: 11px; line-height: 1.6; color: #cbd5e1;">
              • <b style="color:#38bdf8;">Insert / F2:</b> Ocultar o mostrar este panel<br>
              • <b style="color:#38bdf8;">G:</b> Conmutar Modo Dios (Inmortal)<br>
              • <b style="color:#38bdf8;">C:</b> Conmutar 100% Críticos<br>
              • <b style="color:#38bdf8;">F:</b> Conmutar Congelar Enemigos<br>
              • <b style="color:#38bdf8;">Z:</b> Alternar Zoom de Cámara (Amplio / Normal)<br>
              • <b style="color:#38bdf8;">H:</b> Curar toda la salud<br>
              • <b style="color:#38bdf8;">N:</b> Limpiar pantalla (Nuke Enemigos)<br>
              • <b style="color:#38bdf8;">T:</b> Adelantar tiempo (+1 min)<br>
              • <b style="color:#38bdf8;">Y:</b> Alternar velocidad (x5 / x1)
            </div>
          </div>
        </div>

      </div>

      <!-- NOTIFICADOR INFERIOR -->
      <div id="ps-toast" style="padding: 8px 14px; font-size: 11px; font-weight: 600; text-align: center; color: #38bdf8; background: rgba(15, 23, 42, 0.9); border-top: 1px solid rgba(255, 255, 255, 0.05); min-height: 32px; display: flex; align-items: center; justify-content: center;">
        Suite Ultra cargada con éxito.
      </div>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(win);

    function showToast(msg) {
      const t = document.getElementById("ps-toast");
      if (t) {
        t.innerText = msg;
        clearTimeout(t._timer);
        t._timer = setTimeout(() => { t.innerText = "Listo."; }, 3000);
      }
    }

    const toggleWindow = () => {
      win.style.display = (win.style.display === "none" || !win.style.display) ? "block" : "none";
      if (win.style.display === "block") {
        renderCatalog();
        renderItemsCatalog();
        populateDatalist();
      }
    };
    toggle.addEventListener("click", toggleWindow);
    document.getElementById("ps-btn-close").addEventListener("click", () => win.style.display = "none");

    win.querySelectorAll(".ps-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        win.querySelectorAll(".ps-tab-btn").forEach(b => b.classList.remove("active"));
        win.querySelectorAll(".ps-tab-pane").forEach(p => p.style.display = "none");
        btn.classList.add("active");
        const target = document.getElementById(btn.getAttribute("data-tab"));
        if (target) {
          target.style.display = "block";
          if (btn.getAttribute("data-tab") === "tab-moves") {
            renderCatalog();
            renderItemsCatalog();
            populateDatalist();
          }
          if (btn.getAttribute("data-tab") === "tab-prog") {
            const active = window._psSave?.getActiveSave();
            if (active && active.save) {
              const inCoins = document.getElementById("ps-in-coins");
              const inT1 = document.getElementById("ps-in-t1");
              const inT10 = document.getElementById("ps-in-t10");
              const inCandies = document.getElementById("ps-in-candies");
              if (inCoins && active.save.coins !== undefined) inCoins.value = active.save.coins;
              if (inT1 && active.save.tickets?.t1 !== undefined) inT1.value = active.save.tickets.t1;
              if (inT10 && active.save.tickets?.t10 !== undefined) inT10.value = active.save.tickets.t10;
              const candyVal = (active.save.bag && active.save.bag.candy !== undefined) ? active.save.bag.candy : active.save.candy;
              if (inCandies && candyVal !== undefined) inCandies.value = candyVal;
            }
          }
        }
      });
    });

    // Arrastre con el ratón
    const dragBar = document.getElementById("ps-drag-bar");
    let isDragging = false, startX, startY, initLeft, initTop;
    dragBar.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "BUTTON") return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = win.getBoundingClientRect();
      initLeft = rect.left;
      initTop = rect.top;
    });
    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      win.style.left = `${initLeft + (e.clientX - startX)}px`;
      win.style.top = `${initTop + (e.clientY - startY)}px`;
      win.style.right = "auto";
    });
    window.addEventListener("mouseup", () => isDragging = false);

    // Conmutadores (Switches)
    const bindSwitch = (id, key, label) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("change", (e) => {
        window._psState[key] = e.target.checked;
        localStorage.setItem(`ps_${key}`, e.target.checked);
        if (key === "autoSkip" && e.target.checked) window._psTime.triggerRecursiveAutoSkip(90);
        showToast(`${label}: ${e.target.checked ? "ACTIVADO" : "DESACTIVADO"}`);
      });
    };
    bindSwitch("ps-sw-god", "godMode", "Modo Dios");
    bindSwitch("ps-sw-nocd", "noCd", "Sin Enfriamiento");
    bindSwitch("ps-sw-crit", "alwaysCrit", "100% Críticos");
    bindSwitch("ps-sw-luck", "maxLuck", "Suerte Máxima");
    bindSwitch("ps-sw-aura", "deathAura", "Aura de Muerte");
    bindSwitch("ps-sw-freeze", "freezeEnemies", "Congelar Enemigos");
    bindSwitch("ps-sw-skip", "autoSkip", "Auto-Skip");
    bindSwitch("ps-sw-inf-rerolls", "infRerolls", "Rerolls Infinitos");
    bindSwitch("ps-sw-moves-enabled", "customMovesEnabled", "Ataques Iniciales");
    bindSwitch("ps-sw-items-enabled", "customItemsEnabled", "Pasivas Iniciales");
    bindSwitch("ps-sw-automax", "autoMaxMoves", "Auto-Maxear");
    bindSwitch("ps-sw-autofuse", "autoFuse", "Auto-Fusión");

    function populateDatalist() {
      const datalist = document.getElementById("ps-move-suggestions");
      if (datalist && window._psMoves && typeof window._psMoves.getAllAvailableMoves === "function") {
        const allMoves = window._psMoves.getAllAvailableMoves();
        datalist.innerHTML = allMoves.map(m => `<option value="${m}"></option>`).join("");
      }
    }
    populateDatalist();

    // Gestión de Ataques
    const txtMoves = document.getElementById("ps-txt-moves");
    const inCustomMove = document.getElementById("ps-in-custom-move");

    const addMoveToList = (moveName) => {
      const val = (moveName || inCustomMove.value).trim().toLowerCase();
      if (!val) return;
      const current = txtMoves.value.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      if (!current.includes(val)) {
        current.push(val);
        txtMoves.value = current.join(", ");
        window._psState.customMoves = current;
        localStorage.setItem("ps_custom_moves", JSON.stringify(current));
        showToast(`+ [${val}] añadido.`);
      } else {
        showToast(`El ataque [${val}] ya está en la lista.`);
      }
      inCustomMove.value = val;
    };

    function executeDirectInject(move) {
      if (!move) return;
      inCustomMove.value = move;
      if (window._psPlayerInstance && window._psMoves) {
        const ok = window._psMoves.injectSingleMove(move, window._psPlayerInstance);
        if (ok) {
          showToast(`⚡ [${move}] inyectado y maxeado en tu Pokémon.`);
        } else {
          showToast(`No se pudo inyectar [${move}].`);
        }
      } else {
        showToast(`⚡ Seleccionado [${move}]. Entra en partida para inyectarlo.`);
      }
    }

    document.getElementById("ps-btn-add-move").addEventListener("click", () => addMoveToList());
    inCustomMove.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addMoveToList();
      }
    });

    document.getElementById("ps-btn-inject-single").addEventListener("click", () => {
      const val = inCustomMove.value.trim().toLowerCase();
      if (!val) return showToast("Escribe un nombre de ataque.");
      executeDirectInject(val);
    });

    document.getElementById("ps-btn-clear-moves").addEventListener("click", () => {
      txtMoves.value = "";
      window._psState.customMoves = [];
      localStorage.setItem("ps_custom_moves", JSON.stringify([]));
      showToast("Lista de ataques vaciada.");
    });

    document.getElementById("ps-btn-save-moves").addEventListener("click", () => {
      const list = txtMoves.value.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      window._psState.customMoves = list;
      localStorage.setItem("ps_custom_moves", JSON.stringify(list));
      showToast("Lista de ataques guardada.");
    });

    document.getElementById("ps-btn-inject-now").addEventListener("click", () => {
      if (window._psPlayerInstance && window._psMoves) {
        const list = txtMoves.value.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
        const count = window._psMoves.injectCustomMoves(window._psPlayerInstance, list);
        showToast(`⚡ ${count} ataques inyectados al nivel máximo.`);
      } else {
        showToast("Entra en partida para inyectar.");
      }
    });

    document.getElementById("ps-btn-max-moves-now").addEventListener("click", () => {
      if (window._psPlayerInstance && window._psMoves) {
        const count = window._psMoves.maxOutAllMoves(window._psPlayerInstance);
        showToast(`⭐ ${count} ataques subidos al nivel máximo.`);
      } else {
        showToast("Entra en partida para subir niveles.");
      }
    });

    document.getElementById("ps-btn-fuse-now").addEventListener("click", () => {
      if (window._psPlayerInstance && window._psMoves) {
        const count = window._psMoves.triggerMoveFusions(window._psPlayerInstance);
        showToast(`🧬 ${count} fusiones completadas al nivel máximo.`);
      } else {
        showToast("Entra en partida para fusionar.");
      }
    });

    // Gestión de Objetos Pasivos (Held Items)
    const txtItems = document.getElementById("ps-txt-items");
    const inCustomItem = document.getElementById("ps-in-custom-item");

    const addItemToList = (itemId) => {
      const val = (itemId || inCustomItem.value).trim().toLowerCase();
      if (!val) return;
      const current = txtItems.value.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      if (!current.includes(val)) {
        current.push(val);
        txtItems.value = current.join(", ");
        window._psState.customItems = current;
        localStorage.setItem("ps_custom_items", JSON.stringify(current));
        showToast(`+ Pasiva [${val}] añadida.`);
      } else {
        showToast(`La pasiva [${val}] ya está en la lista.`);
      }
      inCustomItem.value = val;
    };

    document.getElementById("ps-btn-add-item").addEventListener("click", () => addItemToList());
    inCustomItem.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addItemToList();
      }
    });

    document.getElementById("ps-btn-inject-item-single").addEventListener("click", () => {
      const val = inCustomItem.value.trim().toLowerCase();
      if (!val) return showToast("Escribe el nombre de la pasiva.");
      if (window._psPlayerInstance && window._psMoves) {
        const ok = window._psMoves.injectSingleItem(val, window._psPlayerInstance);
        window._psMoves.maxOutAllItems(window._psPlayerInstance);
        showToast(ok ? `⚡ Pasiva [${val}] equipada y maxeada.` : `Pasiva [${val}] procesada.`);
      } else {
        showToast("Entra en partida para equipar.");
      }
    });

    document.getElementById("ps-btn-save-items").addEventListener("click", () => {
      const list = txtItems.value.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      window._psState.customItems = list;
      localStorage.setItem("ps_custom_items", JSON.stringify(list));
      showToast("Lista de pasivas guardada.");
    });

    document.getElementById("ps-btn-inject-items-now").addEventListener("click", () => {
      if (window._psPlayerInstance && window._psMoves) {
        const list = txtItems.value.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
        const count = window._psMoves.injectCustomItems(window._psPlayerInstance, list);
        showToast(`⚡ ${count} pasivas inyectadas y maxeadas.`);
      } else {
        showToast("Entra en partida para inyectar pasivas.");
      }
    });

    document.getElementById("ps-btn-max-items-now").addEventListener("click", () => {
      if (window._psPlayerInstance && window._psMoves) {
        const count = window._psMoves.maxOutAllItems(window._psPlayerInstance);
        showToast(`⭐ ${count} pasivas maxeadas.`);
      } else {
        showToast("Entra en partida para maxear pasivas.");
      }
    });

    function renderItemsCatalog() {
      const container = document.getElementById("ps-items-catalog-render");
      if (!container || !window._psMoves || !Array.isArray(window._psMoves.PASSIVE_ITEMS)) return;

      container.innerHTML = window._psMoves.PASSIVE_ITEMS.map(it => `
        <span class="ps-move-item" data-item="${it.id}" style="background: rgba(30, 41, 59, 0.85); border: 1px solid #475569; color: #f8fafc; font-size: 9px;" title="${it.desc}">
          <span>${it.icon} ${it.name}</span>
          <button class="ps-item-btn-quick" data-item="${it.id}" title="Equipar y maxear inmediatamente">⚡</button>
        </span>
      `).join("");

      container.querySelectorAll(".ps-move-item").forEach(item => {
        item.addEventListener("click", (e) => {
          const itemId = item.getAttribute("data-item");
          if (e.target.classList.contains("ps-item-btn-quick") || window._psState.moveClickAction === "inject") {
            if (window._psPlayerInstance && window._psMoves) {
              const ok = window._psMoves.injectSingleItem(itemId, window._psPlayerInstance);
              window._psMoves.maxOutAllItems(window._psPlayerInstance);
              showToast(ok ? `⚡ [${itemId}] equipado y maxeado.` : `[${itemId}] procesado.`);
            } else {
              showToast(`⚡ Seleccionado [${itemId}]. Entra en partida para equipar.`);
            }
          } else {
            addItemToList(itemId);
          }
        });
      });
    }

    // Selector de modo de clic
    const btnActionInject = document.getElementById("ps-btn-action-inject");
    const btnActionList = document.getElementById("ps-btn-action-list");

    btnActionInject.addEventListener("click", () => {
      window._psState.moveClickAction = "inject";
      localStorage.setItem("ps_move_action", "inject");
      btnActionInject.style.background = "#059669";
      btnActionList.style.background = "#334155";
      showToast("Modo: Al pulsar se inyecta directamente al Pokémon.");
    });

    btnActionList.addEventListener("click", () => {
      window._psState.moveClickAction = "list";
      localStorage.setItem("ps_move_action", "list");
      btnActionInject.style.background = "#334155";
      btnActionList.style.background = "#2563eb";
      showToast("Modo: Al pulsar se añade a la lista activa.");
    });

    // Filtros de tipos de ataque
    let currentTypeFilter = "all";
    win.querySelectorAll(".ps-type-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        win.querySelectorAll(".ps-type-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentTypeFilter = btn.getAttribute("data-type");
        renderCatalog();
      });
    });

    const inSearchMoves = document.getElementById("ps-in-search-moves");
    inSearchMoves.addEventListener("input", () => renderCatalog());

    function renderCatalog() {
      const container = document.getElementById("ps-catalog-render");
      if (!container || !window._psMoves || typeof window._psMoves.getMovesByType !== "function") return;

      const catalog = window._psMoves.getMovesByType();
      const searchQuery = (inSearchMoves.value || "").trim().toLowerCase();

      let html = "";
      let totalShown = 0;

      for (const [typeKey, typeData] of Object.entries(catalog)) {
        if (currentTypeFilter !== "all" && currentTypeFilter !== typeKey) continue;

        const filteredMoves = typeData.moves.filter(m => {
          if (!searchQuery) return true;
          return m.toLowerCase().includes(searchQuery);
        });

        if (filteredMoves.length === 0) continue;
        totalShown += filteredMoves.length;

        html += `
          <div class="ps-move-card" style="background: ${typeData.bg || 'rgba(30,41,59,0.5)'}; border-color: ${typeData.border || '#334155'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: 800; color: ${typeData.color || '#fff'}; letter-spacing: 0.5px;">
                ${typeData.icon || '🎯'} ${typeData.name.toUpperCase()} (${filteredMoves.length})
              </span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${filteredMoves.map(m => `
                <span class="ps-move-item" data-move="${m}" style="background: rgba(15, 23, 42, 0.9); border: 1px solid ${typeData.border || '#475569'}; color: ${typeData.color || '#e2e8f0'};" title="Clic para seleccionar/inyectar">
                  <span>${m}</span>
                  <button class="ps-move-btn-quick" data-move="${m}" title="Inyectar directamente y subir al máximo">⚡</button>
                </span>
              `).join("")}
            </div>
          </div>
        `;
      }

      if (totalShown === 0) {
        html = `<div style="text-align: center; padding: 18px; color: #94a3b8; font-size: 11px;">No se encontraron ataques que coincidan con la búsqueda.</div>`;
      }

      container.innerHTML = html;

      container.querySelectorAll(".ps-move-item").forEach(item => {
        item.addEventListener("click", (e) => {
          if (e.target.classList.contains("ps-move-btn-quick")) {
            e.stopPropagation();
            const move = e.target.getAttribute("data-move");
            executeDirectInject(move);
            return;
          }

          const move = item.getAttribute("data-move");
          inCustomMove.value = move;

          if (window._psState.moveClickAction === "inject") {
            executeDirectInject(move);
          } else {
            addMoveToList(move);
          }
        });
      });
    }

    renderCatalog();
    renderItemsCatalog();

    // Control de Adelanto de Tiempo
    win.querySelectorAll(".ps-btn-jump").forEach(b => {
      b.addEventListener("click", () => {
        const sec = parseFloat(b.getAttribute("data-sec"));
        if (window._psTime) {
          window._psTime.advanceGameTime(sec);
          showToast(`⏩ Tiempo adelantado +${sec >= 60 ? (sec / 60) + ' min' : sec + ' s'}.`);
        }
      });
    });

    document.getElementById("ps-btn-advance-time").addEventListener("click", () => {
      const val = parseFloat(document.getElementById("ps-in-time-advance").value) || 0;
      const unit = document.getElementById("ps-sel-time-unit").value;
      const sec = unit === "m" ? val * 60 : val;
      if (sec <= 0) return showToast("Introduce un tiempo válido.");
      if (window._psTime) {
        window._psTime.advanceGameTime(sec);
        showToast(`⏩ Tiempo adelantado +${val} ${unit === "m" ? "min" : "s"}.`);
      }
    });

    // Control de Zoom de Cámara
    function applyCamZoom(val) {
      if (window._psEngine) {
        const z = window._psEngine.setCameraZoom(val);
        const inZ = document.getElementById("ps-in-cam-zoom");
        if (inZ) inZ.value = z;
        showToast(`🔍 Zoom de cámara fijado a ${z}x`);
      }
    }

    win.querySelectorAll(".ps-btn-zoom").forEach(b => {
      b.addEventListener("click", () => applyCamZoom(b.getAttribute("data-z")));
    });

    document.getElementById("ps-btn-set-cam-zoom")?.addEventListener("click", () => {
      applyCamZoom(document.getElementById("ps-in-cam-zoom").value);
    });

    // Control de Multiplicadores Totales
    function setMultiplier(type, rawVal) {
      const val = Math.max(0.1, parseFloat(rawVal) || 1);
      window._psState[`${type}Mult`] = val;
      localStorage.setItem(`ps_${type}`, val.toString());

      const input = document.getElementById(`ps-in-mult-${type}`);
      if (input) input.value = val;

      if (type === "hp" && window._psPlayerInstance) {
        const player = window._psPlayerInstance;
        const maxProp = ("maxHp" in player) ? "maxHp" : ("mhp" in player) ? "mhp" : null;
        if (maxProp && typeof player[maxProp] === "number") {
          if (!player._origMaxHp) player._origMaxHp = player[maxProp];
          player[maxProp] = player._origMaxHp * val;
          if (window._psState.godMode) player.hp = player[maxProp];
        }
      }

      showToast(`⚡ ${type.toUpperCase()} fijado a x${val >= 1000000 ? (val / 1000000).toLocaleString() + 'M' : val.toLocaleString()}`);
    }

    win.querySelectorAll(".ps-btn-val").forEach(b => {
      b.addEventListener("click", () => setMultiplier(b.getAttribute("data-type"), parseFloat(b.getAttribute("data-v"))));
    });

    win.querySelectorAll(".ps-btn-max-val").forEach(b => {
      b.addEventListener("click", () => setMultiplier(b.getAttribute("data-type"), parseFloat(b.getAttribute("data-v"))));
    });

    win.querySelectorAll(".ps-btn-set-custom").forEach(b => {
      b.addEventListener("click", () => {
        const type = b.getAttribute("data-type");
        const input = document.getElementById(`ps-in-mult-${type}`);
        if (input) setMultiplier(type, parseFloat(input.value));
      });
    });

    ["dmg", "hp", "exp", "pickup", "spd"].forEach(type => {
      const input = document.getElementById(`ps-in-mult-${type}`);
      if (input) {
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setMultiplier(type, parseFloat(input.value));
          }
        });
        input.addEventListener("change", () => setMultiplier(type, parseFloat(input.value)));
      }
    });

    // Control de Speedhack
    function setGameSpeed(rawScale) {
      const scale = Math.max(0.1, parseFloat(rawScale) || 1);
      if (window._psTime) {
        window._psTime.setTimeScale(scale);
        const inScale = document.getElementById("ps-in-timescale");
        if (inScale) inScale.value = scale;
        win.querySelectorAll(".ps-btn-speed").forEach(s => {
          s.style.outline = parseFloat(s.getAttribute("data-scale")) === scale ? "2px solid #38bdf8" : "none";
        });
        showToast(`⚡ Velocidad fijada a ${scale}x`);
      }
    }

    win.querySelectorAll(".ps-btn-speed").forEach(b => {
      b.addEventListener("click", () => setGameSpeed(b.getAttribute("data-scale")));
    });

    document.getElementById("ps-btn-set-timescale")?.addEventListener("click", () => {
      const input = document.getElementById("ps-in-timescale");
      if (input) setGameSpeed(input.value);
    });

    document.getElementById("ps-btn-max-timescale")?.addEventListener("click", () => setGameSpeed(20));

    document.getElementById("ps-in-timescale")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setGameSpeed(e.target.value);
      }
    });
    document.getElementById("ps-in-timescale")?.addEventListener("change", (e) => setGameSpeed(e.target.value));

    // Curar
    document.getElementById("ps-btn-heal").addEventListener("click", () => {
      if (window._psPlayerInstance) {
        const max = window._psPlayerInstance.maxHp || window._psPlayerInstance.mhp;
        if (max) window._psPlayerInstance.hp = max;
        showToast("💖 Salud restaurada al 100%");
      } else {
        showToast("Entra en partida para curarte.");
      }
    });

    // Limpiar Pantalla
    document.getElementById("ps-btn-nuke").addEventListener("click", () => {
      const killed = window._psSave.nukeEnemies();
      showToast(`💣 ${killed} enemigos eliminados al instante.`);
    });

    // Guardar Recursos
    document.getElementById("ps-btn-save-coins").addEventListener("click", () => {
      const coins = document.getElementById("ps-in-coins")?.value;
      const t1 = document.getElementById("ps-in-t1")?.value;
      const t10 = document.getElementById("ps-in-t10")?.value;
      const candies = document.getElementById("ps-in-candies")?.value;

      const res = window._psSave.injectCurrencies(coins, t1, t10, candies);
      if (res.ok) {
        showToast("💰 Recursos inyectados y guardados con éxito.");
      } else {
        showToast("⚠️ Inicia sesión o entra como Invitado en el juego primero.");
      }
    });

    win.querySelectorAll(".ps-btn-quick-candy").forEach(b => {
      b.addEventListener("click", () => {
        const amt = b.getAttribute("data-amt");
        const inCandies = document.getElementById("ps-in-candies");
        if (inCandies) inCandies.value = amt;
      });
    });

    document.getElementById("ps-btn-run-candy")?.addEventListener("click", () => {
      const ok = window._psSave.addCandiesToRun(1000);
      if (ok) {
        showToast("🍬 +1,000 Caramelos inyectados a tu partida.");
      } else {
        showToast("⚠️ Inicia sesión o entra como Invitado en el juego primero.");
      }
    });

    // Desbloqueos Masivos
    document.getElementById("ps-btn-unlock-all").addEventListener("click", () => {
      const res = window._psSave.unlockAllPokemon();
      if (res.ok) {
        showToast(`📖 ¡Toda la Pokédex desbloqueada (${res.count} Pokémon)!`);
      } else {
        showToast("⚠️ Inicia sesión o entra como Invitado en el juego primero.");
      }
    });

    document.getElementById("ps-btn-unlock-shiny").addEventListener("click", () => {
      const res = window._psSave.unlockAllShinies();
      if (res.ok) {
        showToast(`✨ ¡Todos los Shinies desbloqueados (${res.count} Pokémon)!`);
      } else {
        showToast("⚠️ Inicia sesión o entra como Invitado en el juego primero.");
      }
    });

    document.getElementById("ps-btn-max-all").addEventListener("click", () => {
      const res = window._psSave.maxAllStats();
      if (res.ok) {
        showToast("⭐ ¡Todos los stats de Pokémon maxeados al nivel 10!");
      } else {
        showToast("⚠️ Inicia sesión o entra como Invitado en el juego primero.");
      }
    });

    document.getElementById("ps-btn-unlock-arenas").addEventListener("click", () => {
      const res = window._psSave.unlockAllArenas();
      if (res.ok) {
        showToast("🌋 ¡Todas las 18 Arenas y Biomas desbloqueados!");
      } else {
        showToast("⚠️ Inicia sesión o entra como Invitado en el juego primero.");
      }
    });

    document.getElementById("ps-btn-unlock-skins")?.addEventListener("click", () => {
      const ok = window._psSave.unlockAllSkins();
      if (ok) {
        showToast("🧙‍♀️ ¡Todas las skins de Halloween desbloqueadas y equipadas!");
      } else {
        showToast("⚠️ Inicia sesión o entra como Invitado en el juego primero.");
      }
    });

    // Copias de Seguridad (JSON)
    document.getElementById("ps-btn-export").addEventListener("click", () => {
      const ctx = window._psSave.getSaveContext();
      if (!ctx) return showToast("Error: Sin partida para exportar.");
      const blob = new Blob([localStorage.getItem(ctx.saveKey)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `pokesurvivor_save_${ctx.uid}.json`;
      a.click();
      showToast("Partida exportada en archivo JSON.");
    });

    const fileIn = document.getElementById("ps-file-import");
    document.getElementById("ps-btn-import-trigger").addEventListener("click", () => fileIn.click());
    fileIn.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          const ctx = window._psSave.getSaveContext();
          if (!ctx) return showToast("Error al importar.");
          window._psSave.commitSave(data, ctx.uid, ctx.saveKey);
        } catch (err) {
          showToast("Archivo JSON no válido.");
        }
      };
      reader.readAsText(file);
    });

    // Función para sincronizar todos los switches e inputs de la UI con el estado
    function syncUIFromState() {
      const switchMap = {
        "ps-sw-god": "godMode",
        "ps-sw-nocd": "noCd",
        "ps-sw-crit": "alwaysCrit",
        "ps-sw-luck": "maxLuck",
        "ps-sw-aura": "deathAura",
        "ps-sw-freeze": "freezeEnemies",
        "ps-sw-skip": "autoSkip",
        "ps-sw-inf-rerolls": "infRerolls",
        "ps-sw-moves-enabled": "customMovesEnabled",
        "ps-sw-items-enabled": "customItemsEnabled",
        "ps-sw-automax": "autoMaxMoves",
        "ps-sw-autofuse": "autoFuse"
      };
      for (const [id, key] of Object.entries(switchMap)) {
        const el = document.getElementById(id);
        if (el) el.checked = !!window._psState[key];
      }

      const inputMap = {
        "ps-in-mult-dmg": "dmgMult",
        "ps-in-mult-hp": "hpMult",
        "ps-in-mult-exp": "expMult",
        "ps-in-mult-pickup": "pickupMult",
        "ps-in-mult-spd": "spdMult",
        "ps-in-timescale": "timeScale",
        "ps-in-cam-zoom": "camZoom"
      };
      for (const [id, key] of Object.entries(inputMap)) {
        const el = document.getElementById(id);
        if (el) el.value = window._psState[key];
      }

      win.querySelectorAll(".ps-btn-speed").forEach(s => {
        s.style.outline = parseFloat(s.getAttribute("data-scale")) === (window._psState.timeScale || 1) ? "2px solid #38bdf8" : "none";
      });

      win.querySelectorAll(".ps-btn-zoom").forEach(z => {
        z.style.background = parseFloat(z.getAttribute("data-z")) === (window._psState.camZoom || 1) ? "#2563eb" : "#334155";
      });
    }

    // Manejador del botón de Desactivar Todo (Por Defecto)
    const handleResetAll = () => {
      if (typeof window._psResetGameplay === "function") {
        window._psResetGameplay();
      }
      showToast("🔄 Todo desactivado: Jugabilidad restablecida a los valores por defecto del juego.");
    };

    document.getElementById("ps-btn-reset-all")?.addEventListener("click", handleResetAll);
    document.getElementById("ps-btn-reset-all-combat")?.addEventListener("click", handleResetAll);
    document.getElementById("ps-btn-reset-all-sys")?.addEventListener("click", handleResetAll);

    // Atajos de Teclado
    window.addEventListener("keydown", (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      const k = e.key.toLowerCase();
      if (e.key === "Insert" || e.key === "F2") {
        e.preventDefault();
        toggleWindow();
      } else if (k === "g") {
        const sw = document.getElementById("ps-sw-god");
        if (sw) { sw.checked = !sw.checked; sw.dispatchEvent(new Event("change")); }
      } else if (k === "c") {
        const sw = document.getElementById("ps-sw-crit");
        if (sw) { sw.checked = !sw.checked; sw.dispatchEvent(new Event("change")); }
      } else if (k === "f") {
        const sw = document.getElementById("ps-sw-freeze");
        if (sw) { sw.checked = !sw.checked; sw.dispatchEvent(new Event("change")); }
      } else if (k === "z") {
        const curZ = window._psState.camZoom || 1;
        const nextZ = curZ === 1 ? 0.75 : curZ === 0.75 ? 0.5 : 1;
        applyCamZoom(nextZ);
      } else if (k === "h") {
        document.getElementById("ps-btn-heal")?.click();
      } else if (k === "n") {
        document.getElementById("ps-btn-nuke")?.click();
      } else if (k === "t") {
        if (window._psTime) {
          window._psTime.advanceGameTime(60);
          showToast("⏩ Tiempo adelantado +1 min");
        }
      } else if (k === "y") {
        if (window._psTime) {
          const current = window._psTime.getTimeScale();
          const target = current >= 5 ? 1 : 5;
          setGameSpeed(target);
        }
      }
    });
  }

  // Inicialización de la interfaz
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUI);
  } else {
    initUI();
  }

  window._psUI = {
    initUI,
    updateBadge,
    syncUIFromState: typeof syncUIFromState === "function" ? syncUIFromState : () => {}
  };
})();
