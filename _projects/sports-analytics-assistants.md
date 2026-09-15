---
layout: page
title: Conversational Sports Analytics
description: RAG-based natural-language chatbots for NBA, MLB, and NCAA basketball.
period: 2025 – present
img:
permalink: /projects/sports-analytics-assistants/
importance: 1
featured: true
summary: "Natural-language analysis grounded in accurate structured data for NBA, MLB, and NCAA basketball."
results:
  - "3 production assistants"
  - "100M+ records"
  - "LangGraph · BigQuery · DuckDB"
capability: "LLM systems"
role: "Designed and built jointly with one colleague, from data platform to chat interface"
---

<link rel="stylesheet" href="{{ '/assets/css/ferran.css' | relative_url | bust_css_cache }}">
<script src="{{ '/assets/js/nba-shot-chart.js' | relative_url | bust_file_cache }}" defer></script>
<script src="{{ '/assets/js/mlb-charts.js' | relative_url | bust_file_cache }}" defer></script>

<div class="fv-page">
  <p class="fv-lede">I designed and built production chatbots that let users explore sports data through natural language without giving up analytical accuracy. The systems turn questions into validated queries over structured NBA, MLB, and NCAA basketball data, then return answers and visualizations tied to the underlying records.</p>
  <p class="fv-project-period">Project period · {{ page.period }}</p>
  <p class="fv-project-role"><span>Role</span> {{ page.role }}</p>

  <div class="fv-metric-row">
    <div><strong>3</strong><span>production assistants: NBA, MLB, NCAA</span></div>
    <div><strong>530K+</strong><span>games covered</span></div>
    <div><strong>100M+</strong><span>structured records queryable</span></div>
  </div>

  <h2>Architecture</h2>
  <ol class="fv-flow" aria-label="Assistant architecture, from data ingestion to monitoring">
    <li><span class="fv-flow-step">Ingest</span><strong>Prefect flows</strong><small>Scheduled or on-demand pulls from public sports APIs</small></li>
    <li><span class="fv-flow-step">Model</span><strong>BigQuery</strong><small>Raw responses landed, cleaned into production tables</small></li>
    <li><span class="fv-flow-step">Serve</span><strong>DuckDB</strong><small>Read-only replica on a GCP VM for fast, predictable tool calls</small></li>
    <li><span class="fv-flow-step">Reason</span><strong>LangGraph agent</strong><small>SQL and domain tools, self-validation, FastAPI on GCP</small></li>
    <li><span class="fv-flow-step">Observe</span><strong>Logs → dashboard</strong><small>Firebase Auth, Firestore history, BigQuery analytics</small></li>
  </ol>

  <h3>Accuracy by design</h3>
  <p>Each assistant follows the same layered pattern. Prefect flows pull open-source data on a schedule or on demand, land the raw responses, build cleaned production-ready tables in BigQuery, and sync a read-only DuckDB database for fast, predictable tool calls that sits in a VM within the GCP ecosystem. The chat service runs in FastAPI on GCP.</p>
  <p>A LangGraph ReAct agent combines a small set of SQL and domain tools with a system prompt containing schema, guardrails, and worked examples. The agent validates its own query and answer, discloses filters, and generates deterministic charts or tables from the returned rows instead of asking the model to invent visualizations.</p>
  <p>Firebase Authentication protects the applications, Firestore stores durable conversation history, and structured request logs plus GCS visualization artifacts feed a BigQuery-backed analytics dashboard. This makes it possible to evaluate not only whether an answer looks plausible, but which prompt, model, query path, latency, and user feedback produced it.</p>

  <h3>Grounding and evaluation</h3>
  <p>Sports questions often require several operations—filtering a long event history, joining game context, comparing cohorts, or following relationships across tables. I designed the data and retrieval layers around those operations rather than asking the language model to reconstruct facts from prose.</p>
  <p>Evaluation workflows tested whether responses were supported by the underlying records, whether the requested slice had been applied correctly, and whether the assistant declined questions outside its evidence.</p>

  <h2>The assistants</h2>
  <p>Each assistant shares the architecture above. Open one to see its data coverage and an interactive chart built from a saved answer.</p>

  <details class="fv-collapsible">
  <summary><h3>NBA assistant <span class="fv-summary-hint">shot chart</span></h3></summary>
  <p>The NBA assistant covers approximately 70K games, 1.5M player-game boxscore entries and 18M play-by-play records, with additional tables for shots, passes, lineups, matchups, standings, and CBA data. It supports SQL-driven answers and visualizations, including shot charts. Data comes from <code>nba_api</code>, which provides access to official NBA data.</p>

  <section class="fv-chart-example" data-shot-chart data-source="{{ '/assets/data/jalen-brunson-2026-finals-shot-chart.csv' | relative_url }}">
    <div class="fv-chart-example__head">
      <div>
        <p class="fv-chart-kicker">Interactive example · fixed data snapshot</p>
        <h3>Jalen Brunson · 2026 NBA Finals</h3>
        <p>Explore the mapped shot attempts returned by the NBA assistant. Filters and zoom work entirely within this saved dataset.</p>
      </div>
      <div class="fv-chart-summary" aria-live="polite"></div>
    </div>
    <div class="fv-chart-controls" aria-label="Shot chart controls">
      <div class="fv-outcome-toggle" aria-label="Shot outcome">
        <button type="button" data-outcome="all" aria-pressed="true">All shots</button>
        <button type="button" data-outcome="made" aria-pressed="false">Made</button>
        <button type="button" data-outcome="missed" aria-pressed="false">Missed</button>
      </div>
      <div class="fv-zoom-controls" aria-label="Chart zoom">
        <button type="button" data-zoom-out aria-label="Zoom out">−</button>
        <button type="button" data-zoom-in aria-label="Zoom in">+</button>
        <button type="button" data-reset aria-label="Reset zoom and pan">↺</button>
      </div>
      <button type="button" class="fv-select-area" data-region aria-pressed="false">Select area</button>
    </div>
    <div class="fv-chart-workbench">
      <div class="fv-chart-court">
        <div class="fv-shot-chart-wrap"><svg class="fv-shot-chart" viewBox="-258 -70 516 400" role="img" aria-label="Jalen Brunson shot chart from the 2026 NBA Finals"></svg><div class="fv-shot-tooltip" data-shot-tooltip role="status" aria-live="polite" hidden></div></div>
        <p class="fv-chart-note">Hover or focus a mark for shot details; use the mouse wheel or controls to zoom, then drag to pan.</p>
      </div>
      <aside class="fv-filter-drawer" data-filter-drawer aria-label="Shot chart filters">
        <div class="fv-filter-drawer__head"><strong>Filters</strong><button type="button" data-filter-reset>Reset filters</button></div>
        <div class="fv-filter-grid">
          <label>Shot type <select data-shot-type><option value="">All types</option></select></label>
          <label>Quarter <select data-period><option value="">All quarters</option></select></label>
        </div>
        <fieldset class="fv-filter-group"><legend>Time remaining</legend><div class="fv-filter-pills" data-clock-presets></div><button type="button" class="fv-custom-range" data-clock-custom>Custom range…</button><div class="fv-range-group" data-clock-range hidden><div><span data-clock-min-label></span><span data-clock-max-label></span></div><div class="fv-double-range"><input type="range" data-clock-min min="0" max="12" step="0.25"><input type="range" data-clock-max min="0" max="12" step="0.25"></div></div></fieldset>
        <fieldset class="fv-filter-group"><legend>Shot distance</legend><div class="fv-range-group"><div><span data-distance-min-label></span><span data-distance-max-label></span></div><div class="fv-double-range"><input type="range" data-distance-min min="0" step="0.1"><input type="range" data-distance-max min="0" step="0.1"></div></div></fieldset>
      </aside>
    </div>
  </section>
  </details>

  <details class="fv-collapsible">
  <summary><h3>MLB assistant <span class="fv-summary-hint">spray and pitch charts</span></h3></summary>
  <p>The MLB assistant covers approximately 220K games since 1901, including 34M pitches, 16M runner records, 14M fielding credits, and 12 million plays, alongside player, team, and leaderboard tables. It supports SQL-driven answers and visualizations, including spray charts and pitcher charts. Data comes from the official MLB Stats API and Baseball Savant.</p>

  <section class="fv-mlb-examples" aria-label="MLB assistant interactive examples">
    <div class="fv-mlb-example" data-mlb-chart="spray" data-source="{{ '/assets/data/shohei-ohtani-2026-through-august-spray-chart.csv' | relative_url }}">
      <div class="fv-chart-example__head"><div><p class="fv-chart-kicker">Interactive example · fixed data snapshot</p><h3>Shohei Ohtani · 2026 spray chart</h3><p>Every mapped batted ball from the regular season through August 31.</p></div><div class="fv-chart-summary" data-mlb-summary aria-live="polite"></div></div>
      <div class="fv-mlb-metrics" data-mlb-metrics aria-live="polite"></div>
      <div class="fv-chart-controls" aria-label="Spray chart controls"><div class="fv-zoom-controls"><button type="button" data-zoom-out aria-label="Zoom out">−</button><button type="button" data-zoom-in aria-label="Zoom in">+</button><button type="button" data-reset aria-label="Reset zoom and pan">↺</button></div><button type="button" class="fv-select-area" data-region aria-pressed="false">Select area</button></div>
      <div class="fv-chart-workbench"><div class="fv-chart-court"><div class="fv-mlb-legend" data-mlb-legend aria-label="Spray chart legend"></div><div class="fv-mlb-chart-wrap"><svg class="fv-mlb-chart" viewBox="-20 -20 290 270" role="img" aria-label="Shohei Ohtani 2026 spray chart through August 31"></svg><div class="fv-shot-tooltip" data-mlb-tooltip role="status" aria-live="polite" hidden></div></div><p class="fv-chart-note">Hover or focus a mark for batted-ball details; use the mouse wheel or controls to zoom, then drag to pan.</p></div><aside class="fv-filter-drawer fv-mlb-filter-panel" aria-label="Spray chart filters"><div class="fv-filter-drawer__head"><strong>Filters</strong><button type="button" data-filter-reset>Reset filters</button></div><fieldset class="fv-filter-group"><legend>Exit velocity</legend><div class="fv-range-group"><div><span data-speed-min-label></span><span data-speed-max-label></span></div><div class="fv-double-range"><input type="range" data-speed-min step="0.1"><input type="range" data-speed-max step="0.1"></div></div></fieldset><fieldset class="fv-filter-group"><legend>Launch angle</legend><div class="fv-range-group"><div><span data-angle-min-label></span><span data-angle-max-label></span></div><div class="fv-double-range"><input type="range" data-angle-min step="1"><input type="range" data-angle-max step="1"></div></div></fieldset><fieldset class="fv-filter-group"><legend>Inning</legend><div class="fv-range-group"><div><span data-inning-min-label></span><span data-inning-max-label></span></div><div class="fv-double-range"><input type="range" data-inning-min step="1"><input type="range" data-inning-max step="1"></div></div></fieldset><div class="fv-filter-pills" data-pill-group="outs"></div><div class="fv-filter-pills" data-pill-group="balls"></div><div class="fv-filter-pills" data-pill-group="strikes"></div><div class="fv-filter-pills" data-pill-group="pitchHand"></div><fieldset class="fv-filter-group fv-base-filter"><legend>Runners on base</legend><div class="fv-base-selector" data-base-selector aria-label="Runners on base"><button type="button" data-base-filter="2nd" aria-label="Runner on second base" aria-pressed="false"></button><button type="button" data-base-filter="3rd" aria-label="Runner on third base" aria-pressed="false"></button><span class="fv-base-selector__home" aria-hidden="true"></span><button type="button" data-base-filter="1st" aria-label="Runner on first base" aria-pressed="false"></button></div></fieldset></aside></div>
    </div>

    <div class="fv-mlb-example" data-mlb-chart="pitch" data-source="{{ '/assets/data/shohei-ohtani-2026-through-august-pitch-chart.csv' | relative_url }}">
      <div class="fv-chart-example__head"><div><p class="fv-chart-kicker">Interactive example · fixed data snapshot</p><h3>Shohei Ohtani · 2026 pitcher chart</h3><p>Every tracked pitch from the regular season through August 31.</p></div><div class="fv-chart-summary" data-mlb-summary aria-live="polite"></div></div>
      <div class="fv-mlb-metrics" data-mlb-metrics aria-live="polite"></div>
      <div class="fv-chart-controls" aria-label="Pitcher chart controls"><div class="fv-zoom-controls"><button type="button" data-zoom-out aria-label="Zoom out">−</button><button type="button" data-zoom-in aria-label="Zoom in">+</button><button type="button" data-reset aria-label="Reset zoom and pan">↺</button></div><button type="button" class="fv-select-area" data-region aria-pressed="false">Select area</button></div>
      <div class="fv-chart-workbench"><div class="fv-chart-court"><div class="fv-mlb-legend" data-mlb-legend aria-label="Pitch type legend"></div><div class="fv-mlb-chart-wrap fv-mlb-chart-wrap--pitch"><svg class="fv-mlb-chart" viewBox="-3.5 -0.5 7 6.7" role="img" aria-label="Shohei Ohtani 2026 pitch location chart through August 31"></svg><div class="fv-shot-tooltip" data-mlb-tooltip role="status" aria-live="polite" hidden></div></div><p class="fv-chart-note">Hover or focus a mark for pitch details; use the mouse wheel or controls to zoom, then drag to pan.</p></div><aside class="fv-filter-drawer fv-mlb-filter-panel" aria-label="Pitcher chart filters"><div class="fv-filter-drawer__head"><strong>Filters</strong><button type="button" data-filter-reset>Reset filters</button></div><div class="fv-filter-grid"><label>Result <select data-result-filter></select></label></div><fieldset class="fv-filter-group"><legend>Velocity</legend><div class="fv-range-group"><div><span data-speed-min-label></span><span data-speed-max-label></span></div><div class="fv-double-range"><input type="range" data-speed-min step="0.1"><input type="range" data-speed-max step="0.1"></div></div></fieldset><fieldset class="fv-filter-group"><legend>Spin rate</legend><div class="fv-range-group"><div><span data-spin-min-label></span><span data-spin-max-label></span></div><div class="fv-double-range"><input type="range" data-spin-min step="1"><input type="range" data-spin-max step="1"></div></div></fieldset><fieldset class="fv-filter-group"><legend>Inning</legend><div class="fv-range-group"><div><span data-inning-min-label></span><span data-inning-max-label></span></div><div class="fv-double-range"><input type="range" data-inning-min step="1"><input type="range" data-inning-max step="1"></div></div></fieldset><div class="fv-filter-pills" data-pill-group="outs"></div><div class="fv-filter-pills" data-pill-group="balls"></div><div class="fv-filter-pills" data-pill-group="strikes"></div><div class="fv-filter-pills" data-pill-group="batSide"></div><fieldset class="fv-filter-group fv-base-filter"><legend>Runners on base</legend><div class="fv-base-selector" data-base-selector aria-label="Runners on base"><button type="button" data-base-filter="2nd" aria-label="Runner on second base" aria-pressed="false"></button><button type="button" data-base-filter="3rd" aria-label="Runner on third base" aria-pressed="false"></button><span class="fv-base-selector__home" aria-hidden="true"></span><button type="button" data-base-filter="1st" aria-label="Runner on first base" aria-pressed="false"></button></div></fieldset></aside></div>
    </div>

  </section>
  </details>

  <details class="fv-collapsible">
  <summary><h3>NCAA basketball assistant</h3></summary>
  <p>The NCAA assistant is restricted to Division I basketball, and covers approximately 240K games, 2M player-game boxscore entries and 30M play-by-play records, with additional tables for shots, lineups, conferences, standings, draft and ratings. It supports SQL-driven answers and visualizations, including shot charts. Data comes from the College Basketball Data API.</p>
  </details>

{% include project_navigation.liquid %}

</div>
