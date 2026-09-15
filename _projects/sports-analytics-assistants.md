---
layout: page
title: Trustworthy sports analytics in plain language
description: Natural-language sports analysis grounded in accurate, structured NBA, MLB, and NCAA basketball data.
period: 2022 – present
img:
permalink: /projects/sports-analytics-assistants/
importance: 4
category: flagship
---

<link rel="stylesheet" href="{{ '/assets/css/ferran.css' | relative_url }}">
<script src="{{ '/assets/js/nba-shot-chart.js' | relative_url }}" defer></script>

<div class="fv-page">
  <p class="fv-lede">I designed and built production chatbots that let users explore sports data through natural language without giving up analytical accuracy. The systems turn questions into validated queries over structured NBA, MLB, and NCAA basketball data, then return answers and visualizations tied to the underlying records.</p>
  <p class="fv-project-period">Project period · {{ page.period }}</p>

  <div class="fv-metric-row">
    <div><strong>Grounded</strong><span>answers tied to records</span></div>
    <div><strong>Natural language</strong><span>questions to analytics</span></div>
    <div><strong>End to end</strong><span>ingestion through evaluation</span></div>
  </div>

  <h2>NBA assistant</h2>
  <p>The NBA chatbot covers approximately 70K games, 1.5M player-game boxscore entries and 18M play-by-play records, with additional tables for shots, passes, lineups, matchups, standings, and CBA data. It supports SQL-driven answers and visualizations, including shot charts. Data comes from the `nba_api` that manages access to official NBA data.</p>

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
      <button type="button" data-outcome="all" aria-pressed="true">All shots</button>
      <button type="button" data-outcome="made" aria-pressed="false">Made</button>
      <button type="button" data-outcome="missed" aria-pressed="false">Missed</button>
      <label>Shot type <select data-shot-type><option value="">All types</option></select></label>
      <label>Period <select data-period><option value="">All periods</option></select></label>
      <button type="button" data-zoom-out aria-label="Zoom out">−</button>
      <button type="button" data-zoom-in aria-label="Zoom in">+</button>
      <button type="button" data-reset>Reset view</button>
    </div>
    <div class="fv-shot-chart-wrap"><svg class="fv-shot-chart" viewBox="-258 -70 516 400" role="img" aria-label="Jalen Brunson shot chart from the 2026 NBA Finals"></svg></div>
    <p class="fv-chart-note">Snapshot created September 14, 2026. Hover or focus a mark for shot details; use the mouse wheel or controls to zoom, then drag to pan.</p>
  </section>

  <h2>MLB assistant</h2>
  <p>The MLB chatbot covers approximately 220K games since 1901, including 34M pitches, 16M runner records, 14M fielding credits, and 12 million plays, alongside player, team, and leaderboard tables. It supports SQL-driven answers and visualizations, including spray charts and pitcher charts. Data comes from the official MLB stats endpoint and Basevall Savant.</p>

  <h2>NCAA basketball assistant</h2>
  <p>The NCAA chatbot is restricted to Division I basketball, and covers approximately 240K games, 2M player-game boxscore entries and 30M play-by-play records, with additional tables for shots, lineups, conferences, standings, draft and ratings. It supports SQL-driven answers and visualizations, including shot charts. Data comes from the College Basketball Data API as its upstream source and supports both development and production environments.</p>

  <h2>Accuracy by design</h2>
  <p>Each assistant follows the same layered pattern. Prefect flows pull open-source data on a schedule or on demand, land the raw responses, build cleaned production-ready tables in BigQuery, and sync a read-only DuckDB database for fast, predictable tool calls that sits in a VM within the GCP ecosystem. The chat service runs in FastAPI on GCP.</p>
  <p>A LangGraph ReAct agent combines a small set of SQL and domain tools with a system prompt containing schema, guardrails, and worked examples. The agent validates its own query and answer, discloses filters, and generates deterministic charts or tables from the returned rows instead of asking the model to invent visualizations.</p>
  <p>Firebase Authentication protects the applications, Firestore stores durable conversation history, and structured request logs plus GCS visualization artifacts feed a BigQuery-backed analytics dashboard. This makes it possible to evaluate not only whether an answer looks plausible, but which prompt, model, query path, latency, and user feedback produced it.</p>

  <h2>Grounding and evaluation</h2>
  <p>Sports questions often require several operations—filtering a long event history, joining game context, comparing cohorts, or following relationships across tables. I designed the data and retrieval layers around those operations rather than asking the language model to reconstruct facts from prose.</p>
  <p>Evaluation workflows tested whether responses were supported by the underlying records, whether the requested slice had been applied correctly, and whether the assistant declined questions outside its evidence.</p>

{% include project_navigation.liquid %}

</div>
