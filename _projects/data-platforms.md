---
layout: page
title: Streaming Live Skeletal & Tracking Data
description: Cloud infrastructure for live sports data collection.
period: 2021 – present
img:
permalink: /projects/data-platforms/
importance: 5
category: engineering
---

<link rel="stylesheet" href="{{ '/assets/css/ferran.css' | relative_url }}">

<div class="fv-page">
  {% include project_bubbles.liquid %}

  <p class="fv-lede">Two generations of the same live-ingestion system, both on GCP, show how I evolve infrastructure as requirements grow: a RabbitMQ pipeline that carried FIFA certification events from 2021 to 2023, and the gRPC service that replaced it from 2024 onward.</p>
  <p class="fv-project-period">Project period · {{ page.period }}</p>

  <div class="fv-metric-row">
    <div><strong>10 MB/s</strong><span>live tracking throughput</span></div>
    <div><strong>50 ms</strong><span>p99 end-to-end latency</span></div>
    <div><strong>10+ data providers</strong><span>over 8 FIFA certification events</span></div>
  </div>

  <h2>RabbitMQ live ingestion (2021 – 2023)</h2>
  <p>I built a live data-collection service on GCP using RabbitMQ to center-of-mass, skeletal tracking and connected-ball data during FIFA technology-certification events and testing sessions, including the validation work behind Semi-Automated Offside Technology (SAOT). It carried certification-event traffic through 2023, when I replaced it with a gRPC-based system built for the scale the next generation of events demanded.</p>

  <h2>gRPC live ingestion (2024 – present)</h2>
  <p>I engineered a gRPC service on GCP as the future-proofed successor to the RabbitMQ pipeline, capable of consuming live soccer tracking and skeletal data and automatically storing and ingesting it. This system has been used during FIFA technology-certification events since 2024, and has sustained peak loads of ~10 MB/s over event sessions with ~50 ms p99 end-to-end latency.</p>

  <h2>Architecture as a decision</h2>
  <p>Across both generations, the objective was not infrastructure for its own sake. RabbitMQ met the certification events of 2021–2023; as those events outgrew it, gRPC took over as the more scalable, future-proofed replacement, running FIFA certification events since 2024.</p>

{% include project_navigation.liquid %}

</div>
