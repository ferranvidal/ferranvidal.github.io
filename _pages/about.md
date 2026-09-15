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
    <img class="fv-headshot" src="{{ '/assets/img/headshot.jpg' | relative_url }}" alt="Ferran Vidal-Codina">
  </div>

  <div class="fv-actions">
    <a class="fv-button fv-button--primary" href="{{ '/projects/' | relative_url }}">View selected work</a>
    <a class="fv-button" href="{{ '/assets/pdf/Ferran_Vidal_Codina_Resume.pdf' | relative_url }}">Download résumé</a>
    <a class="fv-button" href="https://huggingface.co/spaces/ferranvidal/career_conversation">Ask my CV</a>
  </div>

  <section class="fv-section">
    <div class="fv-section-head"><h2>Selected work</h2><span class="fv-section-note">Problem → approach → measurable result</span></div>
    <div class="fv-work-list">
      <a class="fv-work-item" href="{{ '/projects/fifa-auto-eventing/' | relative_url }}">
        <span class="fv-work-number">01</span>
        <span><span class="fv-work-title">Automatic event detection at the FIFA World Cup</span><span class="fv-work-copy">A provider-agnostic system that converted player and ball tracking data into structured football events.</span></span>
        <span class="fv-work-result">&gt;90% detection<br>&gt;95% set pieces<br>Deployed at the 2022 World Cup</span>
      </a>
      <a class="fv-work-item" href="{{ '/projects/playbook-digitization/' | relative_url }}">
        <span class="fv-work-number">02</span>
        <span><span class="fv-work-title">Digitizing football playbooks without labeled data</span><span class="fv-work-copy">Synthetic-data generation, semantic segmentation, and route tracing for proprietary play diagrams.</span></span>
        <span class="fv-work-result">Zero real training labels<br>&gt;80% real-world IoU</span>
      </a>
      <a class="fv-work-item" href="{{ '/projects/sports-analytics-assistants/' | relative_url }}">
        <span class="fv-work-number">03</span>
        <span><span class="fv-work-title">Three open-source sports analytics assistants</span><span class="fv-work-copy">NBA, MLB, and NCAA basketball chatbots with a shared data and agent architecture.</span></span>
        <span class="fv-work-result">Prefect · BigQuery<br>DuckDB · LangGraph · OpenAI</span>
      </a>
      <a class="fv-work-item" href="{{ '/projects/saot-technology-validation/' | relative_url }}">
        <span class="fv-work-number">04</span>
        <span><span class="fv-work-title">Validating the technology behind SAOT</span><span class="fv-work-copy">Live data collection, latency assessment, and technology accuracy validation for FIFA's officiating technology.</span></span>
        <span class="fv-work-result">80+ matches<br>GCP · RabbitMQ</span>
      </a>
    </div>
  </section>

  <section class="fv-section fv-two-column">
    <div>
      <h2>Across the stack</h2>
      <p>I’m comfortable moving between the layers of a system: pulling data from an awkward API, shaping it into something people can query, and putting a useful interface on top. I’ve worked on the infrastructure, the models, and the product around them.</p>
    </div>
    <div>
      <h2>How I work</h2>
      <p>I like to get a small version working early, then learn from the places where it breaks. I talk to the people who will use the system, look at the failures myself, and keep the difference between a good metric and a good outcome in view.</p>
    </div>
  </section>

  <section class="fv-section">
    <h2>Recognition</h2>
    <p>My automatic event-detection research received the International Sports Engineering Association Paper of the Year award in 2023. I was also awarded a $150,000 La Caixa Foundation Fellowship for graduate study at MIT.</p>
  </section>

  <section class="fv-section">
    <h2>Contact</h2>
    <p>Based in Hawai‘i and working remotely across US time zones. Reach me at <a href="mailto:vc.ferran@gmail.com">vc.ferran@gmail.com</a> or on <a href="https://www.linkedin.com/in/ferranvc">LinkedIn</a>. Research record: <a href="https://orcid.org/0000-0002-8501-2910">ORCID</a>.</p>
  </section>
</div>
