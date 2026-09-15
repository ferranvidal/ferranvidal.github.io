---
layout: page
title: From live tracking to the warehouse
description: Cloud infrastructure for live sports data and multi-provider analytical workloads.
permalink: /projects/data-platforms/
importance: 5
category: engineering
---

<link rel="stylesheet" href="{{ '/assets/css/ferran.css' | relative_url }}">

<div class="fv-page">
  <p class="fv-lede">Two infrastructure engagements illustrate the range of systems I build: a low-latency live ingestion service on GCP and a multi-provider analytical warehouse on AWS.</p>

  <div class="fv-metric-row">
    <div><strong>10 MB/s</strong><span>live tracking throughput</span></div>
    <div><strong>50 ms</strong><span>p99 end-to-end latency</span></div>
    <div><strong>50%</strong><span>lower Redshift spend</span></div>
  </div>

  <h2>Live tracking ingestion</h2>
  <p>I engineered a gRPC service on GCP that streamed live soccer tracking and skeletal data during FIFA technology-certification events. The system sustained approximately 10 MB/s over event sessions with 50 ms p99 end-to-end latency.</p>

  <h2>FC Internazionale data warehouse</h2>
  <p>I built and maintained approximately 20 Lambda, Glue, and Step Functions pipelines that integrated tracking and event feeds from multiple providers and leagues into Redshift. Query-level cost attribution exposed the workloads driving spend and supported a 50% cost reduction.</p>

  <h2>Architecture as a decision</h2>
  <p>Across these projects, the objective was not infrastructure for its own sake. The platform choices followed the operational need: predictable low latency for certification events, and observable, maintainable analytical workloads for a professional club.</p>

{% include project_navigation.liquid %}

</div>
