---
layout: page
title: Sports analytics AI assistants
description: Retrieval, data, and evaluation systems for natural-language basketball and football analysis.
permalink: /projects/sports-analytics-assistants/
importance: 3
category: flagship
---

<link rel="stylesheet" href="{{ '/assets/css/ferran.css' | relative_url }}">

<div class="fv-page">
  <p class="fv-lede">I designed and built analytics assistants that let users ask natural-language questions over decades of basketball and football data while keeping answers grounded in structured evidence.</p>

  <div class="fv-metric-row">
    <div><strong>20 seasons</strong><span>play-by-play data</span></div>
    <div><strong>80 seasons</strong><span>box-score data</span></div>
    <div><strong>End to end</strong><span>ingestion through evaluation</span></div>
  </div>

  <h2>More than a chat interface</h2>
  <p>The work began with ingestion pipelines from open-source endpoints and continued through data modeling, retrieval, Python services, prompt and tool design, and systematic evaluation. The systems combined BigQuery, DuckDB, and Neo4j with retrieval-augmented generation and orchestrated workflows.</p>

  <h2>Grounding and evaluation</h2>
  <p>Sports questions often require several operations—filtering a long event history, joining game context, comparing cohorts, or following relationships through a graph. I designed the data and retrieval layers around those operations rather than asking the language model to reconstruct facts from prose.</p>
  <p>Evaluation workflows tested whether responses were supported by the underlying records, whether the requested slice had been applied correctly, and whether the assistant declined questions outside its evidence.</p>

  <h2>Immersive coaching</h2>
  <p>For a VR football simulation, I also engineered a conversational coach across eight game scenarios and integrated cloned-voice text-to-speech to deliver consistent, context-aware feedback inside the experience.</p>
</div>
