import { buildHarnessPage } from '../serve/harnessPage.js';
import { CANVAS } from '../schema.js';

describe('buildHarnessPage', () => {
  const html = buildHarnessPage();

  it('mounts the page-builder element', () => {
    expect(html).toContain('<page-builder id="pb"></page-builder>');
  });

  /* Regression guard for a real bug: core's own #canvas.preview-printable
     rule uses max-width (responsive — shrinks on a narrow browser window),
     but pagectl's absolute x/y/width coordinates all assume a canvas that
     is always exactly CANVAS.width wide. A narrower real render put every
     already-correct position past the real (shrunk) right edge — confirmed
     live with Playwright at a narrower viewport. The harness must force a
     fixed `width`, not just raise the `max-width` cap. */
  it('forces the canvas to a fixed width matching CANVAS.width, not a responsive cap', () => {
    expect(html).toMatch(new RegExp(`#canvas\\.preview-printable\\.preview-desktop\\s*\\{[^}]*width:\\s*${CANVAS.width}px`));
    expect(html).toMatch(/#canvas\.preview-printable\.preview-desktop\s*\{[^}]*max-width:\s*none/);
  });

  /* Regression guard: width alone doesn't fix the canvas size — #canvas
     also has flex-grow: 1 from core's own CSS, which adds any remaining
     flex-row free space on top of the width regardless of !important
     (flex-grow operates after width sets the flex-basis). Confirmed live:
     without flex-grow/flex-shrink: 0, the canvas still rendered at
     whatever space the flex row happened to have, never CANVAS.width. */
  it('pins flex-grow and flex-shrink to 0 so flex layout cannot resize the canvas away from CANVAS.width', () => {
    expect(html).toMatch(/#canvas\.preview-printable\.preview-desktop\s*\{[^}]*flex-grow:\s*0/);
    expect(html).toMatch(/#canvas\.preview-printable\.preview-desktop\s*\{[^}]*flex-shrink:\s*0/);
  });

  /* Regression guard for a real bug: pinning #canvas's flex-shrink to 0
     above means #sidebar + fixed-width #canvas + open #customization panel
     can together exceed a narrower browser window's width, with nothing
     left able to shrink. #app's own overflow: hidden (core's base CSS)
     then silently clips whatever doesn't fit, with no way to scroll to it
     — confirmed live: at a 1500px window with the settings panel open,
     ~206px of it was genuinely unreachable, not just off-screen.
     overflow-x (not the shorthand, so overflow-y/rounded-corner clipping
     is untouched) makes that reachable by horizontal scroll instead. */
  it('makes #app horizontally scrollable so a too-narrow window never makes part of the UI unreachable', () => {
    expect(html).toMatch(/#app\s*\{[^}]*overflow-x:\s*auto/);
  });

  /* Regression guard for a real bug: without an explicit height/flex
     constraint on <page-builder>, it grows to its full content height
     instead of filling the viewport. Since core's own CSS sets
     html/body { overflow: hidden } (only #canvas inside the component is
     meant to scroll), that left the page silently clipped with no way to
     scroll to the hidden content anywhere on the page — confirmed live
     with Playwright. packages/example/test-react/src/index.css shows the
     "page-builder { flex: 1; min-height: 0; ... }" pattern every other
     consumer already applies; the harness must apply the same one. */
  it('constrains html/body/page-builder to the viewport so #canvas can scroll internally', () => {
    expect(html).toMatch(/html,\s*body\s*\{[^}]*height:\s*100%/);
    expect(html).toMatch(/html,\s*body\s*\{[^}]*overflow:\s*hidden/);
    expect(html).toMatch(/page-builder\s*\{[^}]*flex:\s*1/);
    expect(html).toMatch(/page-builder\s*\{[^}]*min-height:\s*0/);
  });
});
