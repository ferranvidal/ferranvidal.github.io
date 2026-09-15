(() => {
  const NS = "http://www.w3.org/2000/svg";
  const colors = { "Home Run": "#b45309", Triple: "#9333ea", Double: "#2563eb", Single: "#65a30d", Out: "#dc2626", Other: "#94a3b8" };
  const pitchColors = {
    "Four-Seam Fastball": "#ef8b3c",
    Sinker: "#b45309",
    Cutter: "#0d9488",
    Changeup: "#0e7490",
    Splitter: "#115e59",
    Slider: "#1e40af",
    Sweeper: "#e11d76",
    Curveball: "#9d174d",
    "Knuckle Curve": "#a855f7",
  };
  const esc = (v) => String(v || "").replace(/[&<>\"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const svg = (tag, attrs = {}) => {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const csv = (raw) => {
    let rows = [],
      row = [],
      cell = "",
      quoted = false;
    for (let i = 0; i < raw.length; i++) {
      const c = raw[i],
        n = raw[i + 1];
      if (c === '"' && quoted && n === '"') {
        cell += c;
        i++;
      } else if (c === '"') quoted = !quoted;
      else if (c === "," && !quoted) {
        row.push(cell);
        cell = "";
      } else if ((c === "\n" || c === "\r") && !quoted) {
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
  const outcome = (r) => {
    const e = (r.event || "").toLowerCase();
    if (e.includes("home run")) return "Home Run";
    if (e.includes("triple")) return "Triple";
    if (e.includes("double")) return "Double";
    if (e.includes("single")) return "Single";
    return r.isOut === "true" || e.includes("out") ? "Out" : "Other";
  };
  const eventLabel = (r) => r.event || r.description || "Pitch";
  const pitchResult = (r) => {
    if (r.event) return r.isOut === "true" ? "In Play (Out)" : "In Play (Not Out)";
    const call = (r.call || r.description || "").toLowerCase();
    if (call.includes("foul")) return "Foul";
    if (call.includes("swinging") || call.includes("missed bunt")) return "Swinging Strike";
    if (call.includes("called strike")) return "Called Strike";
    return "Ball";
  };
  const tooltip = (wrap, data, type) => {
    const box = wrap.querySelector("[data-mlb-tooltip]");
    const score =
      data.awayScore || data.homeScore
        ? `<div><dt>Score</dt><dd>${esc(data.away)} ${esc(data.awayScore)} – ${esc(data.home)} ${esc(data.homeScore)}</dd></div>`
        : "";
    const rows =
      type === "spray"
        ? `<div><dt>Result</dt><dd>${esc(eventLabel(data))}</dd></div><div><dt>Exit velo</dt><dd>${data.launchSpeed ? `${(+data.launchSpeed).toFixed(1)} mph` : "—"}</dd></div><div><dt>Angle</dt><dd>${data.launchAngle ? `${(+data.launchAngle).toFixed(0)}°` : "—"}</dd></div><div><dt>Distance</dt><dd>${data.totalDistance ? `${(+data.totalDistance).toFixed(0)} ft` : "—"}</dd></div><div><dt>Pitcher</dt><dd>${esc(data.pitcherName)}</dd></div>`
        : `<div><dt>Result</dt><dd>${esc(eventLabel(data))}</dd></div><div><dt>Batter</dt><dd>${esc(data.batterName)}</dd></div><div><dt>Velocity</dt><dd>${data.startSpeed ? `${(+data.startSpeed).toFixed(1)} mph` : "—"}</dd></div><div><dt>Spin</dt><dd>${data.spinRate ? `${Math.round(+data.spinRate).toLocaleString()} rpm` : "—"}</dd></div><div><dt>Count</dt><dd>${esc(data.balls)}–${esc(data.strikes)}</dd></div>`;
    box.innerHTML = `<strong>${esc(type === "spray" ? outcome(data) : data.pitchType)}</strong><dl><div><dt>Date</dt><dd>${esc(data.gameDate)}</dd></div><div><dt>Game</dt><dd>${esc(data.away)} @ ${esc(data.home)}</dd></div><div><dt>Inning</dt><dd>${esc(data.halfInning)} ${esc(data.inning)}</dd></div>${score}${rows}</dl>`;
    box.hidden = false;
  };
  const positionTooltip = (wrap, event) => {
    const box = wrap.querySelector("[data-mlb-tooltip]"),
      rect = wrap.getBoundingClientRect();
    box.style.left = `${clamp(event.clientX - rect.left + 14, 8, Math.max(8, rect.width - 236))}px`;
    box.style.top = `${clamp(event.clientY - rect.top + 14, 8, Math.max(8, rect.height - box.offsetHeight - 8))}px`;
  };
  document.querySelectorAll("[data-mlb-chart]").forEach(async (root) => {
    const kind = root.dataset.mlbChart,
      raw = csv(await (await fetch(root.dataset.source)).text());
    const data = raw
      .map((r) => ({
        ...r,
        x: +(kind === "spray" ? r.hitCoordX : r.plateX),
        y: +(kind === "spray" ? r.hitCoordY : r.plateZ),
        speed: +(kind === "spray" ? r.launchSpeed : r.startSpeed),
      }))
      .filter((r) => Number.isFinite(r.x) && Number.isFinite(r.y));
    const chart = root.querySelector("svg"),
      wrap = root.querySelector(".fv-mlb-chart-wrap"),
      summary = root.querySelector("[data-mlb-summary]"),
      legend = root.querySelector("[data-mlb-legend]"),
      metrics = root.querySelector("[data-mlb-metrics]"),
      resultFilter = root.querySelector("[data-result-filter]");
    const inputs = {
      speedMin: root.querySelector("[data-speed-min]"),
      speedMax: root.querySelector("[data-speed-max]"),
      angleMin: root.querySelector("[data-angle-min]"),
      angleMax: root.querySelector("[data-angle-max]"),
      spinMin: root.querySelector("[data-spin-min]"),
      spinMax: root.querySelector("[data-spin-max]"),
      inningMin: root.querySelector("[data-inning-min]"),
      inningMax: root.querySelector("[data-inning-max]"),
    };
    const limits = (key, fallback = 0) => {
      const values = data
        .map((r) => +(key === "angle" ? r.launchAngle : key === "spin" ? r.spinRate : key === "inning" ? r.inning : r.speed))
        .filter(Number.isFinite);
      return { min: values.length ? Math.min(...values) : fallback, max: values.length ? Math.max(...values) : fallback };
    };
    const bounds = { speed: limits("speed"), angle: limits("angle"), spin: limits("spin"), inning: limits("inning", 1) };
    let scale = 1,
      pan = { x: 0, y: 0 },
      drag = null,
      selected = "",
      resultType = "",
      region = null,
      draft = null,
      selecting = false,
      group;
    const categories = [...new Set(data.map((r) => (kind === "spray" ? outcome(r) : r.pitchType)).filter(Boolean))].sort();
    const setRange = (name) => {
      const low = inputs[`${name}Min`],
        high = inputs[`${name}Max`],
        limit = bounds[name];
      if (!low || !high) return;
      low.min = high.min = limit.min;
      low.max = high.max = limit.max;
      low.value = limit.min;
      high.value = limit.max;
      const labelMin = root.querySelector(`[data-${name}-min-label]`),
        labelMax = root.querySelector(`[data-${name}-max-label]`);
      const suffix = name === "spin" ? " rpm" : name === "inning" ? "" : name === "angle" ? "°" : " mph";
      const update = () => {
        labelMin.textContent = `${+low.value}${suffix}`;
        labelMax.textContent = `${+high.value}${suffix}`;
        const track = low.closest(".fv-double-range");
        track.style.setProperty("--fv-range-start", `${((+low.value - limit.min) / Math.max(1, limit.max - limit.min)) * 100}%`);
        track.style.setProperty("--fv-range-end", `${((+high.value - limit.min) / Math.max(1, limit.max - limit.min)) * 100}%`);
      };
      low.addEventListener("input", () => {
        if (+low.value > +high.value) low.value = high.value;
        update();
        render();
      });
      high.addEventListener("input", () => {
        if (+high.value < +low.value) high.value = low.value;
        update();
        render();
      });
      update();
    };
    ["speed", "angle", "spin", "inning"].forEach(setRange);
    if (resultFilter) {
      const results = [...new Set(data.map(pitchResult))].sort();
      resultFilter.innerHTML = `<option value="">All results</option>${results.map((x) => `<option value="${esc(x)}">${esc(x)}</option>`).join("")}`;
      resultFilter.addEventListener("change", () => {
        resultType = resultFilter.value;
        render();
      });
    }
    const match = (r) =>
      (!selected || (kind === "spray" ? outcome(r) : r.pitchType) === selected) &&
      (!resultType || pitchResult(r) === resultType) &&
      (!inputs.speedMin || (r.speed >= +inputs.speedMin.value && r.speed <= +inputs.speedMax.value)) &&
      (!inputs.angleMin || (+r.launchAngle >= +inputs.angleMin.value && +r.launchAngle <= +inputs.angleMax.value)) &&
      (!inputs.spinMin || (+r.spinRate >= +inputs.spinMin.value && +r.spinRate <= +inputs.spinMax.value)) &&
      (!inputs.inningMin || (+r.inning >= +inputs.inningMin.value && +r.inning <= +inputs.inningMax.value)) &&
      (!region || (r.x >= region.x0 && r.x <= region.x1 && r.y >= region.y0 && r.y <= region.y1));
    const point = (event) => {
      const matrix = group?.getScreenCTM();
      if (!matrix) return null;
      const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
      return kind === "spray" ? { x: clamp(p.x, 0, 250), y: clamp(p.y, 0, 230) } : { x: clamp(p.x, -3, 3), y: clamp(p.y, 0, 5) };
    };
    const regionBounds = (d) => ({ x0: Math.min(d.x0, d.x1), x1: Math.max(d.x0, d.x1), y0: Math.min(d.y0, d.y1), y1: Math.max(d.y0, d.y1) });
    const render = () => {
      const visible = data.filter(match),
        average = visible.length ? visible.reduce((a, r) => a + r.speed, 0) / visible.length : 0;
      summary.innerHTML = `<strong>${visible.length.toLocaleString()}</strong><span>${kind === "spray" ? "batted balls" : "pitches"} · ${average.toFixed(1)} mph avg</span>`;
      if (metrics) {
        const hits = visible.filter((r) => ["Single", "Double", "Triple", "Home Run"].includes(outcome(r))).length;
        const hardHit = visible.filter((r) => r.speed >= 95).length;
        const homers = visible.filter((r) => outcome(r) === "Home Run").length;
        metrics.innerHTML = [
          ["Batted balls", visible.length, visible.length === data.length ? "in view" : `of ${data.length} total`],
          ["Hits", `${hits}/${visible.length}`, visible.length ? `${((hits / visible.length) * 100).toFixed(1)}% hit rate` : "no batted balls"],
          ["Hard-Hit%", visible.length ? `${((hardHit / visible.length) * 100).toFixed(1)}%` : "--", "95+ mph exit velo"],
          ["Avg exit velo", visible.length ? `${average.toFixed(1)} mph` : "--", "batted ball speed"],
          ["Home runs", homers, visible.length ? `${((homers / visible.length) * 100).toFixed(1)}% of batted balls` : "none in view"],
        ]
          .map(([label, value, note]) => `<div><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`)
          .join("");
      }
      chart.replaceChildren();
      group = svg("g", { transform: `translate(${pan.x / scale} ${pan.y / scale}) scale(${scale})` });
      chart.append(group);
      if (kind === "spray") {
        const home = { x: 125, y: 203 },
          rad = 180,
          lx = home.x - rad * Math.sin(Math.PI / 4),
          rx = home.x + rad * Math.sin(Math.PI / 4),
          fy = home.y - rad * Math.cos(Math.PI / 4);
        group.append(
          svg("path", {
            d: `M ${home.x},${home.y} L ${lx.toFixed(1)},${fy.toFixed(1)} A ${rad},${rad} 0 0 1 ${rx.toFixed(1)},${fy.toFixed(1)} Z`,
            fill: "#eff6ef",
            stroke: "#5a8f5a",
            "stroke-width": 2,
          }),
          svg("polygon", { points: "125,203 157,171 125,139 93,171", fill: "#c9975c", stroke: "#fff" }),
          svg("circle", { cx: 125, cy: 203, r: 3, fill: "#fff", stroke: "#333" })
        );
      } else {
        group.append(
          svg("rect", { x: -0.83, y: 1.5, width: 1.66, height: 2, fill: "#f8fafc", stroke: "#334155", "stroke-width": 0.04 }),
          svg("line", { x1: 0, y1: 0, x2: 0, y2: 5, stroke: "#e2e8f0", "stroke-width": 0.02 })
        );
      }
      visible.forEach((r) => {
        const color = kind === "spray" ? colors[outcome(r)] : pitchColors[r.pitchType] || "#94a3b8";
        const mark =
          kind === "spray" && outcome(r) === "Out"
            ? svg("path", {
                d: `M ${r.x - 2.5} ${r.y - 2.5} L ${r.x + 2.5} ${r.y + 2.5} M ${r.x + 2.5} ${r.y - 2.5} L ${r.x - 2.5} ${r.y + 2.5}`,
                stroke: color,
                "stroke-width": 1.2,
              })
            : svg("circle", {
                cx: r.x,
                cy: kind === "spray" ? r.y : 5 - r.y,
                r: kind === "spray" ? 3.2 : 0.065,
                fill: color,
                stroke: "#fff",
                "stroke-width": kind === "spray" ? 0.7 : 0.012,
              });
        const target = svg("circle", {
          cx: r.x,
          cy: kind === "spray" ? r.y : 5 - r.y,
          r: kind === "spray" ? 7 : 0.13,
          fill: "transparent",
          "pointer-events": "all",
        });
        target.addEventListener("pointerenter", (e) => {
          tooltip(wrap, r, kind);
          positionTooltip(wrap, e);
        });
        target.addEventListener("pointermove", (e) => positionTooltip(wrap, e));
        target.addEventListener("pointerleave", () => {
          wrap.querySelector("[data-mlb-tooltip]").hidden = true;
        });
        group.append(mark, target);
      });
      const active = draft ? regionBounds(draft) : region;
      if (active)
        group.append(
          svg("rect", {
            x: active.x0,
            y: kind === "spray" ? active.y0 : 5 - active.y1,
            width: active.x1 - active.x0,
            height: active.y1 - active.y0,
            fill: "#0e6573",
            "fill-opacity": 0.1,
            stroke: "#0e6573",
            "stroke-dasharray": "3 2",
            "vector-effect": "non-scaling-stroke",
          })
        );
      legend.innerHTML = categories
        .map(
          (c) =>
            `<button type="button" data-key="${esc(c)}" aria-pressed="${String(selected === c)}"><i style="background:${kind === "spray" ? colors[c] : pitchColors[c] || "#94a3b8"}"></i>${esc(c)}</button>`
        )
        .join("");
      legend.querySelectorAll("button").forEach((b) =>
        b.addEventListener("click", () => {
          selected = selected === b.dataset.key ? "" : b.dataset.key;
          render();
        })
      );
      const regionButton = root.querySelector("[data-region]");
      regionButton.setAttribute("aria-pressed", String(selecting || !!region));
      regionButton.textContent = region ? "Clear area" : selecting ? "Drawing…" : "Select area";
      chart.classList.toggle("fv-shot-chart--selecting", selecting);
    };
    root.querySelector("[data-zoom-in]").onclick = () => {
      scale = clamp(scale * 1.25, 0.5, 3);
      render();
    };
    root.querySelector("[data-zoom-out]").onclick = () => {
      scale = clamp(scale / 1.25, 0.5, 3);
      render();
    };
    root.querySelector("[data-reset]").onclick = () => {
      scale = 1;
      pan = { x: 0, y: 0 };
      render();
    };
    root.querySelector("[data-region]").onclick = () => {
      if (region) region = null;
      else selecting = !selecting;
      render();
    };
    root.querySelector("[data-filter-reset]").onclick = () => {
      selected = "";
      resultType = "";
      region = null;
      selecting = false;
      ["speed", "angle", "spin", "inning"].forEach((name) => {
        if (inputs[`${name}Min`]) {
          inputs[`${name}Min`].value = bounds[name].min;
          inputs[`${name}Max`].value = bounds[name].max;
          inputs[`${name}Min`].dispatchEvent(new Event("input"));
        }
      });
      if (resultFilter) resultFilter.value = "";
      render();
    };
    chart.addEventListener("wheel", (e) => {
      e.preventDefault();
      scale = clamp(scale * (e.deltaY > 0 ? 0.9 : 1.1), 0.5, 3);
      render();
    });
    chart.addEventListener("pointerdown", (e) => {
      if (selecting) {
        const p = point(e);
        if (p) {
          draft = { x0: p.x, y0: p.y, x1: p.x, y1: p.y };
          chart.setPointerCapture(e.pointerId);
        }
      } else drag = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    });
    chart.addEventListener("pointermove", (e) => {
      if (draft) {
        const p = point(e);
        if (p) {
          draft.x1 = p.x;
          draft.y1 = p.y;
          render();
        }
      } else if (drag) {
        pan = { x: e.clientX - drag.x, y: e.clientY - drag.y };
        render();
      }
    });
    chart.addEventListener("pointerup", () => {
      if (draft) {
        const b = regionBounds(draft);
        region = b.x1 - b.x0 > 0.05 && b.y1 - b.y0 > 0.05 ? b : null;
        draft = null;
        selecting = false;
        render();
      }
      drag = null;
    });
    render();
  });
})();
