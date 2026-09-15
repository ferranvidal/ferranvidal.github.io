---
layout: page
title: Reading playbooks without labels
description: Synthetic data and semantic segmentation for converting play diagrams into structured objects.
period: 2023 – 2024
img:
permalink: /projects/playbook-digitization/
importance: 2
category: flagship
---

<link rel="stylesheet" href="{{ '/assets/css/ferran.css' | relative_url }}">

<div class="fv-page">
  <p class="fv-lede">A client needed to convert proprietary American football play diagrams into structured objects but had no annotated dataset. I designed a computer-vision pipeline that learned to identify and extract routes entirely from synthetic examples.</p>
  <p class="fv-project-period">Project period · {{ page.period }}</p>

  <div class="fv-metric-row">
    <div><strong>0</strong><span>real training labels</span></div>
    <div><strong>&gt;80%</strong><span>IoU on real playbooks</span></div>
    <div><strong>Multi-GPU</strong><span>TensorFlow training</span></div>
  </div>

  <h2>The constraint</h2>
  <p>The target scans contained thin, branching routes, orientation changes, annotations, colors, and domain-specific visual noise. A simple object detector that works on clean synthetic cards fails to generalize to real playbooks.</p>

  <h2>The system</h2>
  <p>I built a synthetic play generator and expanded its variability through adversarial augmentation informed by the real, unlabeled examples. I then trained a U-Net-style semantic-segmentation model in TensorFlow with multiple GPUs. Finally I devised an algorithm to trace the routes from the predicted masks to produce structured play objects.</p>
  <p>The loss combined focal and Dice terms with topology-aware centerline supervision and hard-example mining. This addressed both the extreme foreground/background imbalance and the operationally important failure mode of broken route segments.</p>

  <h2>Evaluation</h2>
  <p>Synthetic validation data supported repeatable model selection, but the real objective was performance on scanned client cards. Subject-matter experts annotated a small real-world evaluation set, on which the system achieved greater than 80% intersection over union despite using no real images for training.</p>

{% include project_navigation.liquid %}

</div>
