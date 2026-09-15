(() => {
  const ns = "http://www.w3.org/2000/svg";
  const ZOOM_MIN = 0.5,
    ZOOM_MAX = 3,
    ZOOM_STEP = 1.25,
    REGULATION_MINUTES = 12;
  const PRESETS = [
    { key: "all", label: "Whole Game", min: 0, max: 12 },
    { key: "first5", label: "First 5 Min", min: 7, max: 12 },
    { key: "final5", label: "Final 5 Min", min: 0, max: 5 },
    { key: "clutch", label: "Clutch (Q4/OT, last 2)", min: 0, max: 2, lateOnly: true },
  ];
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const clock = (v) => `${Math.floor(v)}:${String(Math.round((v % 1) * 60)).padStart(2, "0")}`;
  const period = (v) => (+v <= 4 ? `Q${v}` : `OT${+v - 4}`);
  const escape = (v) => String(v || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const parseCsv = (raw) => {
    const rows = [];
    let row = [],
      cell = "",
      quote = false;
    for (let i = 0; i < raw.length; i++) {
      const c = raw[i],
        n = raw[i + 1];
      if (c === '"' && quote && n === '"') {
        cell += c;
        i++;
      } else if (c === '"') quote = !quote;
      else if (c === "," && !quote) {
        row.push(cell);
        cell = "";
      } else if ((c === "\n" || c === "\r") && !quote) {
        if (c === "\r" && n === "\n") i++;
        row.push(cell);
        if (row.length > 1) rows.push(row);
        row = [];
        cell = "";
      } else cell += c;
    }
    if (cell || row.length) {
      row.push(cell);
      rows.push(row);
    }
    const [head, ...body] = rows;
    return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] || ""])));
  };
  const svgEl = (tag, attrs) => {
    const node = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  };

  document.querySelectorAll("[data-shot-chart]").forEach(async (root) => {
    const data = parseCsv(await (await fetch(root.dataset.source)).text())
      .map((r) => ({
        ...r,
        x: +r.x,
        y: +r.y,
        made: r.shotMade === "1",
        distance: +(r.distanceFt || r.shotDistance),
        clockValue: +(r.clockMinutes || 0),
        periodNumber: +r.period,
      }))
      .filter((r) => Number.isFinite(r.x) && Number.isFinite(r.y));
    const svg = root.querySelector("svg"),
      wrap = root.querySelector(".fv-shot-chart-wrap"),
      summary = root.querySelector(".fv-chart-summary"),
      type = root.querySelector("[data-shot-type]"),
      quarter = root.querySelector("[data-period]"),
      drawer = root.querySelector("[data-filter-drawer]"),
      toggle = root.querySelector("[data-filter-toggle]"),
      badge = root.querySelector("[data-filter-count]"),
      tooltip = root.querySelector("[data-shot-tooltip]");
    const minDistanceInput = root.querySelector("[data-distance-min]"),
      maxDistanceInput = root.querySelector("[data-distance-max]"),
      minClockInput = root.querySelector("[data-clock-min]"),
      maxClockInput = root.querySelector("[data-clock-max]"),
      clockRange = root.querySelector("[data-clock-range]"),
      customClock = root.querySelector("[data-clock-custom]");
    const distanceMax = Math.ceil(Math.max(...data.map((r) => r.distance)) * 10) / 10;
    [...new Set(data.map((r) => r.shotType).filter(Boolean))].sort().forEach((v) => type.add(new Option(v, v)));
    [...new Set(data.map((r) => r.period).filter(Boolean))].sort((a, b) => +a - +b).forEach((v) => quarter.add(new Option(period(v), v)));
    minDistanceInput.max = maxDistanceInput.max = distanceMax;
    minDistanceInput.value = 0;
    maxDistanceInput.value = distanceMax;
    minClockInput.value = 0;
    maxClockInput.value = 12;
    let outcome = "all",
      scale = 1,
      pan = { x: 0, y: 0 },
      drag,
      minDistance = 0,
      maxDistance = distanceMax,
      minClock = 0,
      maxClock = 12,
      lateOnly = false,
      preset = "all";
    const sync = () => {
      minDistanceInput.value = minDistance;
      maxDistanceInput.value = maxDistance;
      minClockInput.value = minClock;
      maxClockInput.value = maxClock;
      root.querySelector("[data-distance-min-label]").textContent = `${minDistance.toFixed(1)} ft`;
      root.querySelector("[data-distance-max-label]").textContent = `${maxDistance.toFixed(1)} ft`;
      root.querySelector("[data-clock-min-label]").textContent = clock(minClock);
      root.querySelector("[data-clock-max-label]").textContent = clock(maxClock);
      root.querySelectorAll("[data-outcome]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.outcome === outcome)));
      root.querySelectorAll("[data-clock-preset]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.clockPreset === preset)));
      root.querySelector("[data-zoom-in]").disabled = scale >= ZOOM_MAX;
      root.querySelector("[data-zoom-out]").disabled = scale <= ZOOM_MIN;
      root.querySelector("[data-reset]").disabled = scale === 1 && pan.x === 0 && pan.y === 0;
      const count =
        +Boolean(type.value) +
        +Boolean(quarter.value) +
        +(minDistance !== 0 || maxDistance !== distanceMax) +
        +(minClock !== 0 || maxClock !== 12 || lateOnly);
      badge.hidden = !count;
      badge.textContent = count;
    };
    const show = () =>
      data.filter(
        (r) =>
          (outcome === "all" || (outcome === "made") === r.made) &&
          (!type.value || r.shotType === type.value) &&
          (!quarter.value || r.period === quarter.value) &&
          r.distance >= minDistance &&
          r.distance <= maxDistance &&
          r.clockValue >= minClock &&
          r.clockValue <= maxClock &&
          (!lateOnly || r.periodNumber >= 4)
      );
    const hideTooltip = () => {
      tooltip.hidden = true;
    };
    const showTooltip = (event, r) => {
      const homeScore = r.scoreHomePreShot || r.scoreHome;
      const awayScore = r.scoreAwayPreShot || r.scoreAway;
      const score = homeScore || awayScore ? `Away ${awayScore} – Home ${homeScore}` : "";
      const game = r.awayTeam || r.homeTeam ? `<div><dt>Game</dt><dd>${escape(r.awayTeam)} @ ${escape(r.homeTeam)}</dd></div>` : "";
      const scoreRow = score ? `<div><dt>Score</dt><dd>${escape(score)}</dd></div>` : "";
      tooltip.innerHTML = `<strong class="${r.made ? "is-made" : "is-missed"}">${r.made ? "Made" : "Missed"} · ${escape(r.playType || r.shotType || "shot")}</strong><dl><div><dt>Player</dt><dd>${escape(r.playerName)}</dd></div>${game}<div><dt>Date</dt><dd>${escape(r.gameDate)}</dd></div><div><dt>Quarter</dt><dd>${period(r.period)}</dd></div><div><dt>Clock</dt><dd>${escape(r.clock)}</dd></div><div><dt>Distance</dt><dd>${r.distance.toFixed(1)} ft</dd></div>${scoreRow}${r.made && r.assistPlayerName ? `<div><dt>Assist</dt><dd>${escape(r.assistPlayerName)}</dd></div>` : ""}${!r.made && r.blockPlayerName ? `<div><dt>Blocked by</dt><dd>${escape(r.blockPlayerName)}</dd></div>` : ""}</dl>${r.videoUrl ? `<a href="${escape(r.videoUrl)}" target="_blank" rel="noopener noreferrer">Watch the play ↗</a>` : "<small>No video for this shot</small>"}`;
      tooltip.hidden = false;
      const rect = wrap.getBoundingClientRect(),
        x = event.clientX - rect.left,
        y = event.clientY - rect.top;
      tooltip.style.left = `${clamp(x + 14, 8, Math.max(8, rect.width - 232))}px`;
      tooltip.style.top = `${clamp(y + 14, 8, Math.max(8, rect.height - tooltip.offsetHeight - 8))}px`;
    };
    const draw = () => {
      const shown = show(),
        made = shown.filter((r) => r.made).length;
      summary.innerHTML = `<strong>${made}/${shown.length}</strong>${shown.length ? ((100 * made) / shown.length).toFixed(1) : "0.0"}% FG`;
      svg.replaceChildren();
      const court = svgEl("g", { transform: `translate(${pan.x / scale} ${pan.y / scale}) scale(${scale})` });
      svg.append(court);
      [
        ["rect", { x: -250, y: -50, width: 500, height: 780, fill: "#f8fafc", stroke: "#94a3b8", "stroke-width": 2 }],
        ["rect", { x: -80, y: -50, width: 160, height: 190, fill: "none", stroke: "#94a3b8", "stroke-width": 2 }],
        ["circle", { cx: 0, cy: 142.5, r: 60, fill: "none", stroke: "#94a3b8", "stroke-width": 2 }],
        ["path", { d: "M -220,-50 L -220,89.5 A 237.5,237.5 0 0,0 220,89.5 L 220,-50", fill: "none", stroke: "#94a3b8", "stroke-width": 2.5 }],
        ["rect", { x: -30, y: -7.5, width: 60, height: 2, fill: "#475569" }],
        ["circle", { cx: 0, cy: 0, r: 7.5, fill: "none", stroke: "#475569", "stroke-width": 2.5 }],
      ].forEach(([tag, attrs]) => court.append(svgEl(tag, attrs)));
      shown.forEach((r) => {
        const mark = svgEl(
          r.made ? "circle" : "path",
          r.made
            ? { cx: r.x, cy: r.y, r: 4.6, fill: "#16805a", stroke: "#fff", "stroke-width": 1, class: "fv-shot-mark", tabindex: 0 }
            : {
                d: `M ${r.x - 4} ${r.y - 4} L ${r.x + 4} ${r.y + 4} M ${r.x + 4} ${r.y - 4} L ${r.x - 4} ${r.y + 4}`,
                stroke: "#c84343",
                "stroke-width": 1.9,
                "stroke-linecap": "round",
                class: "fv-shot-mark",
                tabindex: 0,
              }
        );
        mark.addEventListener("pointerenter", (e) => showTooltip(e, r));
        mark.addEventListener("pointermove", (e) => showTooltip(e, r));
        mark.addEventListener("pointerleave", hideTooltip);
        mark.addEventListener("focus", () => {
          const rect = wrap.getBoundingClientRect();
          showTooltip({ clientX: rect.left + rect.width / 2, clientY: rect.top + 40 }, r);
        });
        mark.addEventListener("blur", hideTooltip);
        court.append(mark);
      });
      sync();
    };
    PRESETS.forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.clockPreset = p.key;
      b.textContent = p.label;
      b.addEventListener("click", () => {
        minClock = p.min;
        maxClock = p.max;
        lateOnly = !!p.lateOnly;
        preset = p.key;
        clockRange.hidden = true;
        customClock.textContent = "Custom range…";
        draw();
      });
      root.querySelector("[data-clock-presets]").append(b);
    });
    root.querySelectorAll("[data-outcome]").forEach((b) =>
      b.addEventListener("click", () => {
        outcome = b.dataset.outcome;
        draw();
      })
    );
    [type, quarter].forEach((input) => input.addEventListener("change", draw));
    minDistanceInput.addEventListener("input", () => {
      minDistance = Math.min(+minDistanceInput.value, maxDistance);
      draw();
    });
    maxDistanceInput.addEventListener("input", () => {
      maxDistance = Math.max(+maxDistanceInput.value, minDistance);
      draw();
    });
    minClockInput.addEventListener("input", () => {
      minClock = Math.min(+minClockInput.value, maxClock);
      preset = "custom";
      lateOnly = false;
      draw();
    });
    maxClockInput.addEventListener("input", () => {
      maxClock = Math.max(+maxClockInput.value, minClock);
      preset = "custom";
      lateOnly = false;
      draw();
    });
    customClock.addEventListener("click", () => {
      clockRange.hidden = !clockRange.hidden;
      customClock.textContent = clockRange.hidden ? "Custom range…" : "Hide custom range";
    });
    toggle.addEventListener("click", () => {
      drawer.hidden = !drawer.hidden;
      toggle.setAttribute("aria-expanded", String(!drawer.hidden));
    });
    root.querySelector("[data-filter-reset]").addEventListener("click", () => {
      type.value = quarter.value = "";
      minDistance = 0;
      maxDistance = distanceMax;
      minClock = 0;
      maxClock = 12;
      lateOnly = false;
      preset = "all";
      draw();
    });
    root.querySelector("[data-zoom-in]").addEventListener("click", () => {
      scale = clamp(scale * ZOOM_STEP, ZOOM_MIN, ZOOM_MAX);
      draw();
    });
    root.querySelector("[data-zoom-out]").addEventListener("click", () => {
      scale = clamp(scale / ZOOM_STEP, ZOOM_MIN, ZOOM_MAX);
      draw();
    });
    root.querySelector("[data-reset]").addEventListener("click", () => {
      scale = 1;
      pan = { x: 0, y: 0 };
      draw();
    });
    svg.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const rect = svg.getBoundingClientRect(),
          unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? rect.height : 1,
          next = clamp(scale * clamp(Math.exp(-e.deltaY * unit * 0.0018), 0.85, 1.18), ZOOM_MIN, ZOOM_MAX),
          ratio = next / scale,
          x = e.clientX - rect.left - rect.width / 2,
          y = e.clientY - rect.top - rect.height / 2;
        pan = { x: (pan.x - x) * ratio + x, y: (pan.y - y) * ratio + y };
        scale = next;
        draw();
      },
      { passive: false }
    );
    svg.addEventListener("pointerdown", (e) => {
      drag = { x: e.clientX, y: e.clientY, pan: { ...pan } };
      svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener("pointermove", (e) => {
      if (!drag) return;
      pan = { x: drag.pan.x + e.clientX - drag.x, y: drag.pan.y + e.clientY - drag.y };
      draw();
    });
    svg.addEventListener("pointerup", () => {
      drag = null;
    });
    svg.addEventListener("pointerleave", () => {
      drag = null;
      hideTooltip();
    });
    draw();
  });
})();
