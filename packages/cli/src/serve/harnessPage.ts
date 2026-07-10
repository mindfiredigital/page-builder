export function buildHarnessPage(): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>pagebuilder serve</title>
<link rel="stylesheet" href="/bundle.css" />
<style>
  #pb-status {
    padding: 6px 12px;
    background: #111;
    color: #0f0;
    font-family: monospace;
    font-size: 12px;
  }
</style>
</head>
<body>
<div id="pb-status">connecting...</div>
<page-builder id="pb"></page-builder>
<script src="/bundle.js"></script>
<script>
  const pb = document.getElementById('pb');
  const statusEl = document.getElementById('pb-status');

  // layoutMode is a JS property, not an HTML attribute, and the underlying
  // PageBuilder core defaults to 'grid' when it's left unset — which
  // silently breaks pagectl's absolute x/y positions in the live preview.
  // pagectl v1 is absolute-mode only; pin it before anything initializes.
  pb.layoutMode = 'absolute';

  fetch('/design')
    .then(r => r.json())
    .then(design => {
      pb.initialDesign = design;
      pb.configData = { Basic: [], Extra: [], Custom: [] };
    });

  const source = new EventSource('/events');
  source.onopen = () => (statusEl.textContent = 'live — connected to sidecar');
  source.onmessage = event => {
    const design = JSON.parse(event.data);
    if (pb.generateOutput) {
      try {
        pb.applyDesign(design);
      } catch {
        /* not initialized yet — fall back to (re)setting initialDesign */
        pb.initialDesign = design;
        pb.configData = { Basic: [], Extra: [], Custom: [] };
      }
    }
    statusEl.textContent = 'updated at ' + new Date().toLocaleTimeString();
  };
  source.onerror = () => (statusEl.textContent = 'disconnected from sidecar');
</script>
</body>
</html>`;
}
