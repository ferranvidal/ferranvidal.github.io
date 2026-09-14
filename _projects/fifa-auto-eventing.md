---
layout: page
title: Automatic event detection for FIFA
description: Turning player and ball tracking data into structured football events at World Cup scale.
permalink: /projects/fifa-auto-eventing/
importance: 1
category: flagship
---

<link rel="stylesheet" href="{{ '/assets/css/ferran.css' | relative_url }}">

<div class="fv-page">
  <p class="fv-lede">I developed a provider-agnostic system that automatically detected football events from player and ball tracking data. The work moved from applied research to post-match deployment at the 2022 FIFA World Cup.</p>

  <div class="fv-metric-row">
    <div><strong>450+</strong><span>professional matches</span></div>
    <div><strong>&gt;90%</strong><span>event detection</span></div>
    <div><strong>&gt;95%</strong><span>set-piece detection</span></div>
  </div>

  <h2>The problem</h2>
  <p>Traditional football event data is manually collected, expensive, and inconsistent across competitions and providers. Tracking feeds offer richer context, but providers encode and smooth the data differently, and several important events do not have a simple one-frame signature.</p>

  <h2>The approach</h2>
  <p>I standardized tracking and reference-event feeds from multiple providers, filtered noisy ball trajectories, and built a two-stage algorithm: first infer possession and changes in control, then combine those signals with football rules and spatial configurations to identify in-play events and set pieces.</p>
  <p>The model included tunable tolerances for player proximity, ball displacement, speed, and direction. I used held-out matches and Bayesian optimization to calibrate those parameters, while keeping evaluation separated by provider, event type, and match phase so that aggregate scores did not hide systematic failures.</p>

  <h2>Production and impact</h2>
  <p>The pipeline ran on GCP, wrote generated events to a warehouse and data lake, and produced automated match reports. It was used for post-match auto-eventing at the 2022 FIFA World Cup.</p>
  <p>The research received the International Sports Engineering Association and Springer Sports Engineering Paper of the Year award.</p>

  <p><a class="fv-button" href="https://doi.org/10.1007/s12283-022-00381-6">Read the open-access paper</a></p>
</div>
