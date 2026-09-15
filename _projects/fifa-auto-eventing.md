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
  <p>Traditional football event data is manually collected, and is thus expensive, unreliable and often inconsistent across competitions and providers. Tracking feeds offer richer context as they already encompass several layers of raw data understanding, but when we started in 2019 there were no research avenues to bridge the gap between the tracking data and the event data, neither in academia nor in industry.</p>

  <h2>The approach</h2>
  <p>I standardized tracking and reference-event feeds from multiple providers, filtered noisy ball trajectories, and built a two-stage algorithm: first infer possession and changes in control, then combine those signals with football rules and spatial configurations to identify in-play events and set pieces.</p>
  <p>The model included tunable tolerances for player proximity, ball displacement, speed, and direction. I used held-out matches and Bayesian optimization to calibrate those parameters, while keeping evaluation separated by provider, event type, and match phase to ensure the shortcomings of the model were visible.</p>
    <p>Throughout this project, we partnered with data companies, football clubs (FC Barcelona) and competition organizers (Bundesliga, English Premier League) to source data from multiple leagues, formats and providers to further validate the approach.</p>

  <h2>Production and impact</h2>
  <p>The pipeline ran on GCP, wrote generated events to a data warehouse and data lake, and produced automated match reports. It was used for post-match auto-eventing at the 2022 FIFA World Cup, fully embedded within FIFA's data ecosystem.</p>
  <p>The research received the International Sports Engineering Association and Springer Sports Engineering Paper of the Year award in 2023.</p>
    <p>The efforts we spearheaded paved the path towards all major football data companies today offering similar automated event data products.</p>

  <p><a class="fv-button" href="https://doi.org/10.1007/s12283-022-00381-6">Read the open-access paper</a></p>

{% include project_navigation.liquid %}

</div>
