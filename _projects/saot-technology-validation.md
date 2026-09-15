---
layout: page
title: Making SAOT match-ready
description: Live data collection, quality assessment, and synchronization protocols for FIFA's semi-automated offside technology.
permalink: /projects/saot-technology-validation/
importance: 3
category: flagship
---

<link rel="stylesheet" href="{{ '/assets/css/ferran.css' | relative_url }}">

<div class="fv-page">
  <p class="fv-lede">At the MIT Sports Lab, I worked with FIFA, Hawkeye Innovations and Kinexon to validate the optical skeletal-tracking and connected-ball systems that underpin Semi-Automated Offside Technology (SAOT).</p>

  <div class="fv-metric-row">
    <div><strong>80+</strong><span>matches and test sessions</span></div>
    <div><strong>Live</strong><span>collection and latency assessment</span></div>
    <div><strong>FIFA 2022</strong><span>World Cup deployment context</span></div>
  </div>

  <h2>The problem</h2>
  <p>Officiating technology only works when multiple sensing systems are accurate, timely, and synchronized. The challenge was to assess skeletal tracking and connected ball feeds under live-event conditions and identify the failure modes that could compromise a decision at the exact moment the offside is officiated.</p>

  <h2>The system</h2>
  <p>I developed a live data-collection platform using RabbitMQ and Google Cloud Platform, measured latency from collection to reception, and performed statistical analyses of data quality and consistency across providers. I also analyzed the synchronization between connected-ball and skeletal-tracking data so the two sources could support a reliable officiating workflow.</p>

  <h2>Impact</h2>
  <p>The work helped FIFA evaluate the technology pipeline that led to SAOT being used at the 2022 FIFA World Cup. I applied the following mindset throughout the project: test the data path under realistic operating conditions, separate system quality from model quality, and make failure modes visible. This methodlogy continues to be how I build production AI systems.</p>
  <p>Read the <a href="https://www.fifa.com/technical/media-releases/semi-automated-offside-technology-to-be-used-at-fifa-world-cup-2022-tm">FIFA announcement</a> and the <a href="https://www.technologyreview.com/2026/06/23/1138214/heads-in-the-game/">MIT Technology Review interview</a> covering the Sports Lab's work with FIFA.</p>

{% include project_navigation.liquid %}

</div>
