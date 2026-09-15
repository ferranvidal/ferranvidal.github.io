---
layout: page
title: Technical Validation of FIFA's SAOT
description: Live data collection, quality assessment, and synchronization protocols for FIFA's semi-automated offside technology.
period: January 2021 – June 2022
img:
permalink: /projects/saot-technology-validation/
importance: 3
category: flagship
---

<link rel="stylesheet" href="{{ '/assets/css/ferran.css' | relative_url }}">

<div class="fv-page">
  {% include project_bubbles.liquid %}

  <p class="fv-lede">At the MIT Sports Lab, I worked with FIFA alongside Hawkeye Innovations and Kinexon to validate the optical skeletal-tracking and connected-ball systems that underpin Semi-Automated Offside Technology (SAOT).</p>
  <p class="fv-project-period">Project period · {{ page.period }}</p>

  <div class="fv-metric-row">
    <div><strong>80+</strong><span>matches and test sessions</span></div>
    <div><strong>Live</strong><span>collection and latency assessment</span></div>
    <div><strong>FIFA 2022</strong><span>World Cup deployment context</span></div>
  </div>

  <h2>The problem</h2>
  <p>This new offside technology only works when the two sensing systems are accurate, timely, and synchronized. The challenge was to assess skeletal tracking and connected ball feeds under live-event conditions and identify the failure modes that could compromise a decision at the exact moment the offside is officiated.</p>

  <h2>The system</h2>
  <p>I developed a live data-collection platform using <a href="{{ '/projects/data-platforms/' | relative_url }}">RabbitMQ and Google Cloud Platform</a>, measured latency from collection to reception, and performed statistical analyses of data quality and consistency across providers. I also analyzed the synchronization between connected-ball and skeletal-tracking data so the two sources could support a reliable officiating workflow.</p>

  <div class="fv-video-embed">
    <iframe src="https://www.youtube.com/embed/rPCovGdxsVM" title="Semi-Automated Offside Technology" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  </div>

  <h2>Impact</h2>
  <p>The work helped FIFA evaluate the technology pipeline, as well as the data providers to improve their systems. The insights that we generated were a key factor for deciding that SAOT was ready to be used at the 2022 FIFA World Cup. I applied the following mindset throughout the project: test the data path under realistic operating conditions, examine the data quality and consistency with a critical eye, and make failure modes visible. This methodology continues to be how I build production systems.</p>
  <p>Read the <a href="https://www.fifa.com/technical/media-releases/semi-automated-offside-technology-to-be-used-at-fifa-world-cup-2022-tm">FIFA announcement</a> and the <a href="https://www.technologyreview.com/2026/06/23/1138214/heads-in-the-game/">MIT Technology Review interview</a> covering the Sports Lab's work with FIFA.</p>

{% include project_navigation.liquid %}

</div>
