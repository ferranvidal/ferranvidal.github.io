---
layout: page
title: Shipping AI products end to end
description: Full-stack products spanning application design, LLM workflows, payments, and deployment.
period: May 2025 – present
img:
permalink: /projects/ai-products/
importance: 6
category: products
---

<link rel="stylesheet" href="{{ '/assets/css/ferran.css' | relative_url }}">

<div class="fv-page">
  {% include project_bubbles.liquid %}

  <p class="fv-lede">Personal projects give me room to experiment and learn with the technologies as well as the models and data behind it.</p>
  <p class="fv-project-period">Project period · {{ page.period }}</p>

  <h2>AI meal-planning platform</h2>
  <p>I independently built and shipped a full-stack product using Next.js, React, MongoDB, Tailwind CSS, Auth.js, Stripe, and Resend, with language models powering recipe generation, meal planning, and nutritional analysis for toddlers.</p>
  <p>The project covered the complete path from concept to production: authentication, subscriptions, payments, transactional email, LLM workflow design, and deployment.</p>

  <h2>Conversational CV</h2>
  <p>I built a retrieval-augmented assistant that answers questions about my professional background from a curated knowledge base, declines unsupported questions, and avoids inventing dates, metrics, or technologies.</p>
  <p><a class="fv-button" href="https://huggingface.co/spaces/ferranvidal/career_conversation">Open the conversational CV</a></p>

{% include project_navigation.liquid %}

</div>
