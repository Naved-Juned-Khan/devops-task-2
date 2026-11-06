const http = require("node:http");

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f5f6f8">
    <title>Pipeline Desk | DevOps Task 02</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #17212b;
        --muted: #78838f;
        --line: #e8ebef;
        --green: #16875b;
        --green-soft: #e8f6ef;
        --blue: #2874d0;
        --canvas: #f5f6f8;
        --card: #fff;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        background: var(--canvas);
        color: var(--ink);
        font: 15px/1.5 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      button { font: inherit; }

      .shell { max-width: 1180px; margin: 0 auto; padding: 28px 34px 48px; }

      .topbar, .brand, .top-actions, .eyebrow, .run-meta, .section-heading, .stage-heading, .activity-item, .footer {
        display: flex;
        align-items: center;
      }

      .topbar { justify-content: space-between; margin-bottom: 48px; }
      .brand { gap: 11px; font-size: 15px; font-weight: 750; letter-spacing: -.03em; }
      .brand-mark {
        display: grid;
        width: 34px;
        height: 34px;
        place-items: center;
        border-radius: 10px;
        background: #192936;
        color: #fff;
      }

      .brand-mark svg { width: 19px; }
      .top-actions { gap: 10px; color: var(--muted); font-size: 13px; }
      .top-label { padding: 6px 10px; border: 1px solid var(--line); border-radius: 7px; background: #fff; }
      .online-dot, .status-dot, .step-check { display: inline-block; border-radius: 50%; }
      .online-dot { width: 7px; height: 7px; margin-right: 7px; background: #27a36b; }

      .hero { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 30px; }
      .eyebrow { gap: 8px; margin-bottom: 12px; color: var(--green); font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
      .eyebrow svg { width: 16px; height: 16px; }
      h1 { margin: 0; font-size: clamp(30px, 4vw, 42px); letter-spacing: -.055em; line-height: 1.12; }
      .subtitle { max-width: 580px; margin: 12px 0 0; color: var(--muted); font-size: 15px; }
      .run-button {
        display: inline-flex;
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        gap: 9px;
        min-height: 43px;
        padding: 0 16px;
        border: 0;
        border-radius: 8px;
        background: #192936;
        color: #fff;
        cursor: pointer;
        font-size: 13px;
        font-weight: 700;
        transition: background .2s, transform .2s;
      }
      .run-button:hover { background: #263d4e; transform: translateY(-1px); }
      .run-button:disabled { cursor: wait; opacity: .75; transform: none; }
      .run-button svg { width: 15px; height: 15px; }

      .run-card, .pipeline-card, .activity-card { border: 1px solid var(--line); border-radius: 13px; background: var(--card); box-shadow: 0 5px 22px rgb(23 33 43 / 3%); }
      .run-card { padding: 20px 22px; }
      .run-meta { gap: 10px; flex-wrap: wrap; color: var(--muted); font-size: 12px; }
      .run-meta strong { color: var(--ink); font-size: 14px; }
      .run-meta .divider { width: 1px; height: 14px; margin: 0 3px; background: var(--line); }
      .success-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 9px; border-radius: 20px; background: var(--green-soft); color: var(--green); font-size: 11px; font-weight: 750; }
      .success-pill .status-dot { width: 6px; height: 6px; background: currentColor; }

      .pipeline-card { margin-top: 16px; padding: 24px 24px 20px; }
      .section-heading { justify-content: space-between; gap: 14px; margin-bottom: 28px; }
      .section-heading h2, .activity-card h2 { margin: 0; font-size: 15px; letter-spacing: -.02em; }
      .section-heading span { color: var(--muted); font-size: 12px; }

      .pipeline { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .stage { position: relative; min-width: 0; }
      .stage:not(:last-child)::after {
        position: absolute;
        top: 24px;
        left: calc(50% + 28px);
        width: calc(100% - 56px);
        height: 2px;
        background: #b7dfca;
        content: "";
      }
      .stage-top { position: relative; z-index: 1; display: flex; justify-content: center; margin-bottom: 13px; }
      .stage-icon { display: grid; width: 50px; height: 50px; place-items: center; border: 1px solid #dcefe4; border-radius: 15px; background: #f1faf5; color: var(--green); }
      .stage-icon svg { width: 24px; height: 24px; }
      .stage-name { margin: 0; text-align: center; font-size: 13px; font-weight: 750; }
      .stage-detail { margin: 4px 0 0; color: var(--muted); text-align: center; font-size: 11px; }
      .stage-status { display: flex; justify-content: center; align-items: center; gap: 5px; margin-top: 10px; color: var(--green); font-size: 10px; font-weight: 750; letter-spacing: .04em; text-transform: uppercase; }
      .step-check { width: 13px; height: 13px; background: var(--green); color: #fff; font-size: 9px; line-height: 13px; text-align: center; }

      .bottom-grid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 16px; margin-top: 16px; }
      .activity-card { padding: 21px 22px; }
      .activity-card h2 { margin-bottom: 16px; }
      .activity-item { gap: 12px; padding: 12px 0; border-top: 1px solid #f0f1f3; }
      .activity-icon { display: grid; flex: 0 0 32px; width: 32px; height: 32px; place-items: center; border-radius: 9px; background: #f2f5f8; color: #475b6b; }
      .activity-icon svg { width: 16px; height: 16px; }
      .activity-copy { min-width: 0; flex: 1; }
      .activity-copy strong { display: block; overflow: hidden; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
      .activity-copy span, .activity-time { color: var(--muted); font-size: 11px; }
      .activity-time { flex: 0 0 auto; }
      .deploy-box { padding: 15px; border: 1px solid #e4eee8; border-radius: 10px; background: #f7fbf8; }
      .deploy-label { display: flex; align-items: center; gap: 7px; color: var(--green); font-size: 11px; font-weight: 800; text-transform: uppercase; }
      .deploy-url { display: block; margin-top: 8px; color: var(--ink); font-size: 13px; font-weight: 700; }
      .deploy-note { margin: 5px 0 0; color: var(--muted); font-size: 11px; }
      .footer { justify-content: space-between; gap: 12px; margin-top: 25px; color: #929ba4; font-size: 11px; }
      .footer span:last-child { display: inline-flex; align-items: center; gap: 6px; }
      .footer svg { width: 14px; height: 14px; }

      body.is-running .success-pill { background: #fff4df; color: #9c6710; }
      body.is-running .success-pill .status-dot { animation: pulse 1s infinite; }
      body.is-running .stage-status { color: #9c6710; }
      body.is-running .stage:not(.is-done) .stage-icon { border-color: #f1dfb8; background: #fff9ed; color: #b17a18; }
      body.is-running .stage:not(.is-done)::after { background: #e4e8ec; }
      @keyframes pulse { 50% { opacity: .35; } }

      @media (max-width: 680px) {
        .shell { padding: 20px 17px 32px; }
        .topbar { margin-bottom: 34px; }
        .hero { align-items: flex-start; flex-direction: column; margin-bottom: 23px; }
        .run-button { width: 100%; }
        .pipeline-card { padding: 20px 14px; }
        .pipeline { grid-template-columns: 1fr; gap: 0; }
        .stage { display: grid; grid-template-columns: 44px 1fr; column-gap: 13px; align-items: center; min-height: 75px; }
        .stage:not(:last-child)::after { top: 48px; left: 21px; width: 2px; height: calc(100% - 23px); }
        .stage-top { grid-row: 1 / span 3; justify-content: flex-start; margin: 0; }
        .stage-icon { width: 43px; height: 43px; border-radius: 13px; }
        .stage-name, .stage-detail, .stage-status { text-align: left; justify-content: flex-start; }
        .stage-name { align-self: end; }
        .stage-detail { align-self: center; margin: 0; }
        .stage-status { align-self: start; margin-top: 2px; }
        .bottom-grid { grid-template-columns: 1fr; }
        .section-heading { align-items: flex-start; flex-direction: column; gap: 4px; }
        .footer { align-items: flex-start; flex-direction: column; }
        .activity-time { display: none; }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <header class="topbar">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5m4 14V9m4 10V4m4 15v-8m4 8V7"/><path d="M2 21h20"/></svg>
          </span>
          <span>Pipeline Desk</span>
        </div>
        <div class="top-actions"><span class="top-label">DevOps Task 02</span><span><i class="online-dot"></i>Jenkins connected</span></div>
      </header>

      <section class="hero" aria-labelledby="page-title">
        <div>
          <div class="eyebrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/><path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"/></svg>
            Continuous integration &amp; delivery
          </div>
          <h1 id="page-title">Code in. App out.</h1>
          <p class="subtitle">A clear view of the Jenkins pipeline that builds this app, packages it into a Docker image, and deploys it.</p>
        </div>
        <button class="run-button" id="run-button" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 5 12 7-12 7V5Z"/></svg>
          Run demo pipeline
        </button>
      </section>

      <section class="run-card" aria-label="Latest pipeline run">
        <div class="run-meta">
          <span class="success-pill" id="run-status"><i class="status-dot"></i><span>Pipeline successful</span></span>
          <span class="divider"></span>
          <strong id="run-number">Build #42</strong>
          <span>main</span>
          <span class="divider"></span>
          <span id="run-duration">Completed in 1m 24s</span>
          <span class="divider"></span>
          <span>Sample run</span>
        </div>
      </section>

      <section class="pipeline-card" aria-labelledby="pipeline-heading">
        <div class="section-heading">
          <h2 id="pipeline-heading">The delivery pipeline</h2>
          <span>Every commit travels the same path to production</span>
        </div>
        <div class="pipeline" id="pipeline">
          <article class="stage is-done" data-stage="0">
            <div class="stage-top"><span class="stage-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 9v12m12-6a9 9 0 0 0-9-9"/></svg>
            </span></div>
            <h3 class="stage-name">Git commit</h3>
            <p class="stage-detail">Code pushed to main</p>
            <div class="stage-status"><i class="step-check">✓</i><span>Passed</span></div>
          </article>
          <article class="stage is-done" data-stage="1">
            <div class="stage-top"><span class="stage-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v5c0 5 3.4 8.3 8 10 4.6-1.7 8-5 8-10V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>
            </span></div>
            <h3 class="stage-name">Jenkins build</h3>
            <p class="stage-detail">Tests run and pass</p>
            <div class="stage-status"><i class="step-check">✓</i><span>Passed</span></div>
          </article>
          <article class="stage is-done" data-stage="2">
            <div class="stage-top"><span class="stage-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"/><path d="m4.5 7.8 7.5 4.4 7.5-4.4M12 12.2V21"/></svg>
            </span></div>
            <h3 class="stage-name">Docker image</h3>
            <p class="stage-detail">Image built and tagged</p>
            <div class="stage-status"><i class="step-check">✓</i><span>Passed</span></div>
          </article>
          <article class="stage is-done" data-stage="3">
            <div class="stage-top"><span class="stage-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15.5h17.5c0 3-2.5 5.5-5.5 5.5H8.5A5.5 5.5 0 0 1 3 15.5Z"/><path d="M5 12h3v3H5zm4 0h3v3H9zm4 0h3v3h-3zm-4-4h3v3H9zm4 0h3v3h-3zm4 4h3v3h-3z"/><path d="M18 10c1-.7 2-.7 3 0"/></svg>
            </span></div>
            <h3 class="stage-name">Deploy</h3>
            <p class="stage-detail">App running on port 3000</p>
            <div class="stage-status"><i class="step-check">✓</i><span>Live</span></div>
          </article>
        </div>
      </section>

      <div class="bottom-grid">
        <section class="activity-card" aria-labelledby="activity-heading">
          <h2 id="activity-heading">Latest activity</h2>
          <div class="activity-item">
            <span class="activity-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v5c0 5 3.4 8.3 8 10 4.6-1.7 8-5 8-10V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg></span>
            <span class="activity-copy"><strong>Jenkins pipeline completed</strong><span>All stages passed successfully</span></span>
            <time class="activity-time">just now</time>
          </div>
          <div class="activity-item">
            <span class="activity-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"/><path d="m4.5 7.8 7.5 4.4 7.5-4.4M12 12.2V21"/></svg></span>
            <span class="activity-copy"><strong>Docker image published</strong><span>devops-task-2:latest</span></span>
            <time class="activity-time">1 min ago</time>
          </div>
          <div class="activity-item">
            <span class="activity-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 9v12m12-6a9 9 0 0 0-9-9"/></svg></span>
            <span class="activity-copy"><strong>Source committed to main</strong><span>Trigger: push to repository</span></span>
            <time class="activity-time">2 min ago</time>
          </div>
        </section>
        <section class="activity-card" aria-labelledby="deploy-heading">
          <h2 id="deploy-heading">Deployment</h2>
          <div class="deploy-box">
            <span class="deploy-label"><i class="online-dot"></i>Application is live</span>
            <strong class="deploy-url">devops-task-2 · port 3000</strong>
            <p class="deploy-note">Container image built and deployed by the Jenkins pipeline.</p>
          </div>
          <p class="deploy-note" style="margin-top: 14px">Each new commit can trigger the same automated build, test, and deployment flow.</p>
        </section>
      </div>

      <footer class="footer">
        <span>DevOps Task 02 · Jenkins CI/CD demonstration</span>
        <span><i class="online-dot"></i>All systems operational</span>
      </footer>
    </main>
    <script>
      const button = document.getElementById("run-button");
      const statusText = document.querySelector("#run-status span");
      const stages = [...document.querySelectorAll(".stage")];
      let runNumber = 42;
      let running = false;

      button.addEventListener("click", () => {
        if (running) return;
        running = true;
        runNumber += 1;
        document.body.classList.add("is-running");
        button.disabled = true;
        button.lastChild.textContent = " Running pipeline...";
        statusText.textContent = "Pipeline running";
        document.getElementById("run-number").textContent = "Build #" + runNumber;
        document.getElementById("run-duration").textContent = "In progress";

        stages.forEach((stage) => {
          stage.classList.remove("is-done");
          stage.querySelector(".stage-status").innerHTML = "<i class='step-check'>•</i><span>Waiting</span>";
        });

        let current = 0;
        const advance = () => {
          if (current > 0) {
            const previous = stages[current - 1];
            previous.classList.add("is-done");
            previous.querySelector(".stage-status").innerHTML = "<i class='step-check'>✓</i><span>Passed</span>";
          }
          if (current < stages.length) {
            stages[current].querySelector(".stage-status").innerHTML = "<i class='step-check'>•</i><span>Running</span>";
            current += 1;
            window.setTimeout(advance, 700);
            return;
          }

          stages[stages.length - 1].classList.add("is-done");
          stages[stages.length - 1].querySelector(".stage-status").innerHTML = "<i class='step-check'>✓</i><span>Live</span>";
          document.body.classList.remove("is-running");
          statusText.textContent = "Pipeline successful";
          document.getElementById("run-duration").textContent = "Completed just now";
          button.disabled = false;
          button.lastChild.textContent = " Run again";
          running = false;
        };
        advance();
      });
    </script>
  </body>
</html>`;

function createServer() {
  return http.createServer((request, response) => {
    const pathname = new URL(request.url, "http://localhost").pathname;

    if (request.method === "GET" && pathname === "/health") {
      response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }

    if (request.method === "GET" && pathname === "/") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(page);
      return;
    }

    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, "0.0.0.0", () => {
    console.log(`Pipeline Desk is running on port ${port}`);
  });
}

module.exports = { createServer };
