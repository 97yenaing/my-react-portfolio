const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderTagList = (items) =>
  items
    .map(
      (item) =>
        `<span class="tag">${escapeHtml(item)}</span>`
    )
    .join("");

const renderSkillGroups = (groups) =>
  groups
    .map(
      (group) => `
        <section class="skill-card">
          <h3>${escapeHtml(group.title)}</h3>
          <div class="tag-row">
            ${renderTagList(group.items)}
          </div>
        </section>
      `
    )
    .join("");

const renderExperience = (items) =>
  items
    .map(
      (item) => `
        <section class="timeline-item">
          <div class="timeline-top">
            <div>
              <h3>${escapeHtml(item.role)}</h3>
              <p class="company">${escapeHtml(item.company)} · ${escapeHtml(item.location)}</p>
            </div>
            <p class="period">${escapeHtml(item.period)}</p>
          </div>
          <p class="summary">${escapeHtml(item.summary)}</p>
          <ul>
            ${item.bullets
              .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
              .join("")}
          </ul>
        </section>
      `
    )
    .join("");

const renderProjects = (items) =>
  items
    .map(
      (item) => `
        <section class="project-card">
          <p class="eyebrow">${escapeHtml(item.stack)}</p>
          <h3>${escapeHtml(item.name)}</h3>
          <p class="role">${escapeHtml(item.role)}</p>
          <p class="summary">${escapeHtml(item.summary)}</p>
          <div class="tag-row">
            ${renderTagList(item.tags)}
          </div>
        </section>
      `
    )
    .join("");

const renderEducation = (items) =>
  items
    .map(
      (item) => `
        <section class="edu-card">
          <h3>${escapeHtml(item.degree)}</h3>
          <p>${escapeHtml(item.school)}</p>
          <p class="meta">${escapeHtml(item.meta)}</p>
        </section>
      `
    )
    .join("");

export const createCvHtml = (data) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
    />
    <title>Ye Naing CV</title>
    <style>
      :root {
        --ink: #0f172a;
        --muted: #475569;
        --soft: #f8fafc;
        --line: #dbe4f0;
        --panel: #ffffff;
        --accent: #c5f169;
        --accent-deep: #0b5d50;
      }

      * {
        box-sizing: border-box;
      }

      @page {
        size: A4;
        margin: 16mm;
      }

      body {
        margin: 0;
        font-family: "Aptos", "Trebuchet MS", "Segoe UI", sans-serif;
        color: var(--ink);
        background: #eef3f8;
      }

      .page {
        max-width: 960px;
        margin: 0 auto;
        background: var(--panel);
      }

      .hero {
        padding: 40px 42px 28px;
        background:
          radial-gradient(circle at top right, rgba(197, 241, 105, 0.35), transparent 34%),
          linear-gradient(135deg, #08111f 0%, #0f172a 55%, #133b38 100%);
        color: #f8fafc;
      }

      .eyebrow {
        margin: 0 0 10px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        font-size: 11px;
        opacity: 0.74;
      }

      h1 {
        margin: 0;
        font-size: 38px;
        line-height: 1;
        letter-spacing: -0.04em;
      }

      .hero h2 {
        margin: 10px 0 14px;
        font-size: 18px;
        font-weight: 600;
        color: #d4f8e8;
      }

      .hero p {
        margin: 0;
        color: rgba(248, 250, 252, 0.84);
        line-height: 1.65;
      }

      .contact-strip {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 20px;
      }

      .contact-pill,
      .tag {
        display: inline-flex;
        align-items: center;
        padding: 9px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.02em;
      }

      .contact-pill {
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.14);
        color: #f8fafc;
      }

      .layout {
        display: grid;
        grid-template-columns: 0.94fr 1.4fr;
        gap: 0;
      }

      .sidebar {
        background: #f8fbff;
        padding: 28px 30px 34px;
        border-right: 1px solid var(--line);
      }

      .content {
        padding: 28px 34px 34px;
      }

      .section-title {
        margin: 0 0 16px;
        font-size: 13px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--accent-deep);
      }

      .stat-grid,
      .tag-row,
      .skill-stack {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .stat-grid {
        margin-bottom: 28px;
      }

      .stat-card {
        min-width: 110px;
        padding: 14px 16px;
        border-radius: 18px;
        background: linear-gradient(180deg, #ffffff 0%, #f1f6fb 100%);
        border: 1px solid var(--line);
      }

      .stat-card strong {
        display: block;
        font-size: 22px;
        line-height: 1;
      }

      .stat-card span {
        display: block;
        margin-top: 8px;
        color: var(--muted);
        font-size: 12px;
      }

      .tag {
        background: #eff7df;
        color: #234434;
      }

      .sidebar-section + .sidebar-section,
      .content-section + .content-section {
        margin-top: 28px;
      }

      .sidebar p,
      .content p,
      li {
        color: var(--muted);
        line-height: 1.6;
        font-size: 14px;
      }

      .strength-list {
        padding-left: 18px;
        margin: 0;
      }

      .skill-card,
      .project-card,
      .edu-card,
      .timeline-item {
        padding: 0;
        border: 0;
      }

      .skill-card + .skill-card,
      .project-card + .project-card,
      .timeline-item + .timeline-item {
        margin-top: 18px;
      }

      .skill-card h3,
      .project-card h3,
      .timeline-item h3,
      .edu-card h3 {
        margin: 0 0 6px;
        font-size: 18px;
        letter-spacing: -0.02em;
        color: var(--ink);
      }

      .timeline-top {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: flex-start;
      }

      .company,
      .role,
      .meta,
      .period {
        margin: 0;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--accent-deep);
      }

      .summary {
        margin: 10px 0 10px;
      }

      ul {
        margin: 0;
        padding-left: 18px;
      }

      li + li {
        margin-top: 6px;
      }

      .footer {
        padding: 0 34px 34px;
        color: var(--muted);
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header class="hero">
        <p class="eyebrow">Software Engineer</p>
        <h1>${escapeHtml(data.profile.name)}</h1>
        <h2>${escapeHtml(data.profile.title)} · ${escapeHtml(data.profile.location)}</h2>
        <p>${escapeHtml(data.profile.summary)}</p>
        <div class="contact-strip">
          <span class="contact-pill">${escapeHtml(data.profile.email)}</span>
          <span class="contact-pill">${escapeHtml(data.profile.phone)}</span>
          <span class="contact-pill">${escapeHtml(data.profile.location)}</span>
        </div>
      </header>

      <section class="layout">
        <aside class="sidebar">
          <section class="sidebar-section">
            <h2 class="section-title">Highlights</h2>
            <div class="stat-grid">
              ${data.highlights
                .map(
                  (item) => `
                    <div class="stat-card">
                      <strong>${escapeHtml(item.value)}</strong>
                      <span>${escapeHtml(item.label)}</span>
                    </div>
                  `
                )
                .join("")}
            </div>
          </section>

          <section class="sidebar-section">
            <h2 class="section-title">Core Strengths</h2>
            <ul class="strength-list">
              ${data.strengths
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("")}
            </ul>
          </section>

          <section class="sidebar-section">
            <h2 class="section-title">Skills</h2>
            ${renderSkillGroups(data.skillGroups)}
          </section>

          <section class="sidebar-section">
            <h2 class="section-title">Education</h2>
            ${renderEducation(data.education)}
          </section>
        </aside>

        <div class="content">
          <section class="content-section">
            <h2 class="section-title">Profile</h2>
            <p>${escapeHtml(data.profile.focus)}</p>
          </section>

          <section class="content-section">
            <h2 class="section-title">Experience</h2>
            ${renderExperience(data.experience)}
          </section>

          <section class="content-section">
            <h2 class="section-title">Selected Projects</h2>
            ${renderProjects(data.projects)}
          </section>
        </div>
      </section>

      <footer class="footer">
        Modern resume layout generated from portfolio data for Ye Naing.
      </footer>
    </main>
  </body>
</html>`;
