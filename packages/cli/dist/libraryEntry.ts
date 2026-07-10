/* Bundled with esbuild (see bundleLibrary.ts). Registers the `page-builder`
   custom element as a side effect — the served harness page then talks to
   it directly (pb.applyDesign / pb.generateOutput), no window hooks needed
   since a real browser is loading this, not a headless page.evaluate(). */
import '@mindfiredigital/page-builder-web-component';
