---
layout: page
title: Three open-source sports analytics assistants
description: Production chatbots for NBA, MLB, and NCAA basketball analysis, built over open-source data.
permalink: /projects/sports-analytics-assistants/
importance: 4
category: flagship
---

<link rel="stylesheet" href="{{ '/assets/css/ferran.css' | relative_url }}">

<div class="fv-page">
  <p class="fv-lede">I designed and built three production chatbots—one for the NBA, one for MLB, and one for NCAA basketball—that let users ask natural-language questions over open-source sports data while keeping answers grounded in structured evidence.</p>

  <div class="fv-metric-row">
    <div><strong>3</strong><span>live assistants</span></div>
    <div><strong>Open source</strong><span>sports data</span></div>
    <div><strong>End to end</strong><span>ingestion through evaluation</span></div>
  </div>

  <h2>NBA assistant</h2>
  <p>The NBA chatbot covers approximately 70K games, 1.5M player-game boxscore entries and 18M play-by-play records, with additional tables for shots, passes, lineups, matchups, standings, and CBA data. It supports SQL-driven answers and visualizations, including shot charts. Data comes from the `nba_api` that manages access to official NBA data.</p>

  <h2>MLB assistant</h2>
  <p>The MLB chatbot covers approximately 220K games since 1901, including 34M pitches, 16M runner records, 14M fielding credits, and 12 million plays, alongside player, team, and leaderboard tables. It supports SQL-driven answers and visualizations, including spray charts and pitcher charts. Data comes from the official MLB stats endpoint and Basevall Savant.</p>

  <h2>NCAA basketball assistant</h2>
  <p>The NCAA chatbot is restricted to Division I basketball, and covers approximately 240K games, 2M player-game boxscore entries and 30M play-by-play records, with additional tables for shots, lineups, conferences, standings, draft and ratings. It supports SQL-driven answers and visualizations, including shot charts. Data comes from the College Basketball Data API as its upstream source and supports both development and production environments.</p>

  <h2>Common architecture</h2>
  <p>Each assistant follows the same layered pattern. Prefect flows pull open-source data on a schedule or on demand, land the raw responses, build cleaned production-ready tables in BigQuery, and sync a read-only DuckDB database for fast, predictable tool calls that sits in a VM within the GCP ecosystem. The chat service runs in FastAPI on GCP.</p>
  <p>A LangGraph ReAct agent combines a small set of SQL and domain tools with a system prompt containing schema, guardrails, and worked examples. The agent validates its own query and answer, discloses filters, and generates deterministic charts or tables from the returned rows instead of asking the model to invent visualizations.</p>
  <p>Firebase Authentication protects the applications, Firestore stores durable conversation history, and structured request logs plus GCS visualization artifacts feed a BigQuery-backed analytics dashboard. This makes it possible to evaluate not only whether an answer looks plausible, but which prompt, model, query path, latency, and user feedback produced it.</p>

  <h2>Grounding and evaluation</h2>
  <p>Sports questions often require several operations—filtering a long event history, joining game context, comparing cohorts, or following relationships across tables. I designed the data and retrieval layers around those operations rather than asking the language model to reconstruct facts from prose.</p>
  <p>Evaluation workflows tested whether responses were supported by the underlying records, whether the requested slice had been applied correctly, and whether the assistant declined questions outside its evidence.</p>

{% include project_navigation.liquid %}

</div>
