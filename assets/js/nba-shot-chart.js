(() => {
  const ns = "http://www.w3.org/2000/svg";
  const parseCsv = (text) => {
    const rows = [];
    let row = [],
      cell = "",
      quoted = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i],
        n = text[i + 1];
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
  document.querySelectorAll("[data-shot-chart]").forEach(async (root) => {
    const rows = parseCsv(await (await fetch(root.dataset.source)).text()).map((r) => ({ ...r, x: +r.x, y: +r.y, made: r.shotMade === "1" }));
    const svg = root.querySelector("svg"),
      summary = root.querySelector(".fv-chart-summary"),
      type = root.querySelector("[data-shot-type]"),
      period = root.querySelector("[data-period]");
    const types = [...new Set(rows.map((r) => r.shotType).filter(Boolean))].sort(),
      periods = [...new Set(rows.map((r) => r.period).filter(Boolean))].sort((a, b) => +a - +b);
    types.forEach((v) => type.add(new Option(v, v)));
    periods.forEach((v) => period.add(new Option(`Q${v}`, v)));
    let outcome = "all",
      scale = 1,
      pan = { x: 0, y: 0 },
      drag = null;
    const el = (tag, attrs = {}) => {
      const e = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      return e;
    };
    const draw = () => {
      const shown = rows.filter(
        (r) =>
          (outcome === "all" || (outcome === "made") === r.made) &&
          (!type.value || r.shotType === type.value) &&
          (!period.value || r.period === period.value)
      );
      const made = shown.filter((r) => r.made).length,
        pct = shown.length ? ((100 * made) / shown.length).toFixed(1) : "0.0";
      summary.innerHTML = `<strong>${made}/${shown.length}</strong>${pct}% FG`;
      svg.replaceChildren();
      const court = el("g", { transform: `translate(${pan.x / scale} ${pan.y / scale}) scale(${scale})` });
      svg.append(court);
      // The source data is NBA court space: tenths of a foot, with the rim at
      // (0, 0), the endline at y=-50, and y increasing toward half court. These
      // are the same dimensions and paths used in the NBA assistant.
      court.append(el("rect", { x: -250, y: -50, width: 500, height: 780, fill: "#f8fafc", stroke: "#94a3b8", "stroke-width": 2 }));
      court.append(el("rect", { x: -80, y: -50, width: 160, height: 190, fill: "none", stroke: "#94a3b8", "stroke-width": 2 }));
      court.append(el("circle", { cx: 0, cy: 142.5, r: 60, fill: "none", stroke: "#94a3b8", "stroke-width": 2 }));
      court.append(
        el("path", { d: "M -220,-50 L -220,89.5 A 237.5,237.5 0 0,0 220,89.5 L 220,-50", fill: "none", stroke: "#94a3b8", "stroke-width": 2.5 })
      );
      court.append(el("rect", { x: -30, y: -7.5, width: 60, height: 2, fill: "#475569" }));
      court.append(el("circle", { cx: 0, cy: 0, r: 7.5, fill: "none", stroke: "#475569", "stroke-width": 2.5 }));
      shown.forEach((r) => {
        const mark = el(
          r.made ? "circle" : "path",
          r.made
            ? { cx: r.x, cy: r.y, r: 5, fill: "#16805a", stroke: "#fff", "stroke-width": 1, class: "fv-shot-mark", tabindex: 0 }
            : {
                d: `M ${r.x - 4} ${r.y - 4} L ${r.x + 4} ${r.y + 4} M ${r.x + 4} ${r.y - 4} L ${r.x - 4} ${r.y + 4}`,
                stroke: "#c84343",
                "stroke-width": 2,
                class: "fv-shot-mark",
                tabindex: 0,
              }
        );
        const title = el("title");
        title.textContent = `${r.made ? "Made" : "Missed"} · ${r.shotType} · ${r.shotDistance} ft · Q${r.period} · ${r.gameDate}`;
        mark.append(title);
        court.append(mark);
      });
    };
    const setOutcome = (value) => {
      outcome = value;
      root.querySelectorAll("[data-outcome]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.outcome === value)));
      draw();
    };
    root.querySelectorAll("[data-outcome]").forEach((b) => b.addEventListener("click", () => setOutcome(b.dataset.outcome)));
    [type, period].forEach((i) => i.addEventListener("change", draw));
    root.querySelector("[data-zoom-in]").addEventListener("click", () => {
      scale = Math.min(3, scale * 1.25);
      draw();
    });
    root.querySelector("[data-zoom-out]").addEventListener("click", () => {
      scale = Math.max(1, scale / 1.25);
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
        scale = Math.max(1, Math.min(3, scale * (e.deltaY < 0 ? 1.12 : 0.89)));
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
      pan = { x: drag.pan.x + (e.clientX - drag.x) / scale, y: drag.pan.y + (e.clientY - drag.y) / scale };
      draw();
    });
    svg.addEventListener("pointerup", () => (drag = null));
    draw();
  });
})();
