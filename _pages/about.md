---
layout: about
title: home
permalink: /

selected_papers: false
social: false

announcements:
  enabled: false
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

<link rel="stylesheet" href="{{ '/assets/css/ferran.css' | relative_url }}">

<div class="fv-home">
  <div class="fv-hero">
    <div>
      <div class="fv-eyebrow">Data scientist · ML engineer · MIT PhD</div>
      <h1>I build production AI and data systems for complex, high-stakes domains.</h1>
      <p class="fv-lede">Nine years across research and engineering, including production work for FIFA, Google, the English Premier League, the Golden State Warriors, FC Internazionale, and US Soccer. I turn difficult data and modeling problems into systems people can trust and use.</p>
    </div>
    <figure class="fv-portrait">
      <span class="fv-portrait-label">FVC / 01</span>
      <img class="fv-headshot" src="{{ '/assets/img/headshot.jpg' | relative_url }}" alt="Ferran Vidal-Codina">
    </figure>
  </div>

  <div class="fv-actions">
    <a class="fv-button fv-button--primary" href="{{ '/projects/' | relative_url }}">View selected work</a>
    <a class="fv-button" href="{{ '/assets/pdf/Ferran_Vidal_Codina_Resume.pdf' | relative_url }}">Download résumé</a>
    <a class="fv-button" href="https://huggingface.co/spaces/ferranvidal/career_conversation">Ask my CV</a>
  </div>

  <section class="fv-section">
    <div class="fv-section-head"><h2>Selected projects</h2><span class="fv-section-note">Problem → approach → measurable result</span></div>
    {% assign saot_project = site.projects | where: "permalink", "/projects/saot-technology-validation/" | first %}
    {% assign eventing_project = site.projects | where: "permalink", "/projects/fifa-auto-eventing/" | first %}
    {% assign playbook_project = site.projects | where: "permalink", "/projects/playbook-digitization/" | first %}
    {% assign assistants_project = site.projects | where: "permalink", "/projects/sports-analytics-assistants/" | first %}
    <div class="fv-work-list">
      <a class="fv-work-item" href="{{ '/projects/saot-technology-validation/' | relative_url }}">
        <span class="fv-work-number">01</span>
        <span><span class="fv-work-title">Making SAOT match-ready <small class="fv-work-period">{{ saot_project.period }}</small></span><span class="fv-work-copy">Live data collection, latency assessment, and quality validation for the sensing systems behind FIFA’s offside technology.</span></span>
        <span class="fv-work-result">80+ matches<br>GCP · RabbitMQ<br>FIFA World Cup 2022</span>
      </a>
      <a class="fv-work-item" href="{{ '/projects/fifa-auto-eventing/' | relative_url }}">
        <span class="fv-work-number">02</span>
        <span><span class="fv-work-title">From tracking data to match events <small class="fv-work-period">{{ eventing_project.period }}</small></span><span class="fv-work-copy">A provider-agnostic system that converted player and ball tracking data into structured football events.</span></span>
        <span class="fv-work-result">&gt;90% detection<br>&gt;95% set pieces<br>Deployed at the 2022 World Cup</span>
      </a>
      <a class="fv-work-item" href="{{ '/projects/playbook-digitization/' | relative_url }}">
        <span class="fv-work-number">03</span>
        <span><span class="fv-work-title">Reading playbooks without labels <small class="fv-work-period">{{ playbook_project.period }}</small></span><span class="fv-work-copy">Synthetic-data generation, semantic segmentation, and route tracing for proprietary play diagrams.</span></span>
        <span class="fv-work-result">Zero real training labels<br>&gt;80% real-world IoU</span>
      </a>
      <a class="fv-work-item" href="{{ '/projects/sports-analytics-assistants/' | relative_url }}">
        <span class="fv-work-number">04</span>
        <span><span class="fv-work-title">Trustworthy sports analytics in plain language <small class="fv-work-period">{{ assistants_project.period }}</small></span><span class="fv-work-copy">Natural-language analysis grounded in accurate, structured NBA, MLB, and NCAA basketball data.</span></span>
        <span class="fv-work-result">Prefect · BigQuery<br>DuckDB · LangGraph · OpenAI</span>
      </a>
    </div>
  </section>

  <section class="fv-section fv-two-column">
    <div>
      <h2>Across the stack</h2>
      <p>I’m happiest when I can follow a problem end to end: get the data from wherever it lives, make it dependable, build the model or workflow, and give people a clear way to use it. I’ve worked in each of those layers, so I can usually spot where a handoff will get painful before it does.</p>
    </div>
    <div>
      <h2>How I work</h2>
      <p>I start small and put the work in front of the people who need it early. Then I stay close to the rough edges: the data that does not line up, the cases a model misses, and the workflow nobody will adopt. A useful result matters more to me than a tidy demo.</p>
    </div>
  </section>

  <section class="fv-section">
    <h2>Recognition</h2>
    <div class="fv-recognition">
      <div><span class="fv-recognition-year">2023</span><h3>Paper of the Year</h3><p>International Sports Engineering Association and Springer Sports Engineering, for <em>Automatic event detection in football using tracking data</em>.</p></div>
      <div><span class="fv-recognition-year">2011–2013</span><h3>La Caixa Foundation Fellowship</h3><p>$150,000 fellowship supporting graduate study at MIT.</p></div>
    </div>
  </section>

  <section class="fv-section">
    <h2>Contact</h2>
    <p>Based in Hawai‘i and working remotely across US time zones. Reach me at <a href="mailto:vc.ferran@gmail.com">vc.ferran@gmail.com</a> or on <a href="https://www.linkedin.com/in/ferranvc">LinkedIn</a>. Research record: <a href="https://orcid.org/0000-0002-8501-2910">ORCID</a>.</p>
  </section>
</div>
