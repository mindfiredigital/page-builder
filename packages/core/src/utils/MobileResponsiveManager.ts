import { Canvas } from '../canvas/Canvas';
import { CanvasSharedState } from '../canvas/CanvasCore/CanvasSharedState';
import { CanvasEventDispatcher } from '../canvas/CanvasCore/CanvasEventDispatcher';

const BREAKPOINT = 768;

/* SVG icons for the FAB bar */
const FAB_ICONS = {
  components: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  properties: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
};

export class MobileResponsiveManager {
  private backdrop: HTMLElement | null = null;
  private fabBar: HTMLElement | null = null;
  private componentsFabBtn: HTMLButtonElement | null = null;
  private propertiesFabBtn: HTMLButtonElement | null = null;
  private mediaQuery: MediaQueryList;
  private tapListenerCleanup: (() => void) | null = null;

  private constructor() {
    this.mediaQuery = window.matchMedia(`(max-width: ${BREAKPOINT}px)`);
  }

  static init(layoutMode: 'absolute' | 'grid', editable: boolean | null): void {
    if (layoutMode !== 'grid') return;

    const manager = new MobileResponsiveManager();
    manager.setup(editable);
  }

  private setup(editable: boolean | null): void {
    this.createBackdrop();
    this.injectDrawerHeaders(editable);
    this.createFabBar(editable);

    /* Apply initial state and listen for viewport changes */
    this.onViewportChange(editable);
    this.mediaQuery.addEventListener('change', () =>
      this.onViewportChange(editable)
    );
  }

  /* ── Backdrop ──────────────────────────────────────────────────────────── */

  private createBackdrop(): void {
    if (document.getElementById('mobile-drawer-backdrop')) return;

    this.backdrop = document.createElement('div');
    this.backdrop.id = 'mobile-drawer-backdrop';
    this.backdrop.addEventListener('click', () => this.closeAllDrawers());
    document.body.appendChild(this.backdrop);
  }

  /* ── Drawer headers (close button + title) injected into each sidebar ─── */

  private injectDrawerHeaders(editable: boolean | null): void {
    const sidebar = document.getElementById('sidebar');
    const customization = document.getElementById('customization');

    if (sidebar && !sidebar.querySelector('.mobile-drawer-header')) {
      const header = this.buildDrawerHeader('Components', () =>
        this.closeAllDrawers()
      );
      sidebar.insertBefore(header, sidebar.firstChild);

      /* Tap-to-add hint — only shown on mobile via CSS */
      if (editable !== false) {
        const hint = document.createElement('div');
        hint.className = 'mobile-tap-hint';
        hint.textContent = 'Tap a component to add it to the canvas';
        sidebar.insertBefore(hint, header.nextSibling);
      }
    }

    if (
      customization &&
      !customization.querySelector('.mobile-drawer-header')
    ) {
      const header = this.buildDrawerHeader('Properties', () =>
        this.closeAllDrawers()
      );
      customization.insertBefore(header, customization.firstChild);
    }
  }

  private buildDrawerHeader(title: string, onClose: () => void): HTMLElement {
    const header = document.createElement('div');
    header.className = 'mobile-drawer-header';

    const titleEl = document.createElement('h4');
    titleEl.textContent = title;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-drawer-close';
    closeBtn.innerHTML = FAB_ICONS.close;
    closeBtn.setAttribute('aria-label', `Close ${title} panel`);
    closeBtn.addEventListener('click', onClose);

    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    return header;
  }

  /* ── FAB bar ───────────────────────────────────────────────────────────── */

  private createFabBar(editable: boolean | null): void {
    if (document.getElementById('mobile-fab-bar')) return;

    this.fabBar = document.createElement('div');
    this.fabBar.id = 'mobile-fab-bar';
    this.fabBar.setAttribute('role', 'toolbar');
    this.fabBar.setAttribute('aria-label', 'Mobile editor controls');

    if (editable !== false) {
      this.componentsFabBtn = this.buildFabButton(
        'Components',
        FAB_ICONS.components,
        'components-fab',
        () => this.toggleDrawer('left')
      );
      this.fabBar.appendChild(this.componentsFabBtn);
    }

    this.propertiesFabBtn = this.buildFabButton(
      'Properties',
      FAB_ICONS.properties,
      'properties-fab',
      () => this.toggleDrawer('right')
    );
    this.fabBar.appendChild(this.propertiesFabBtn);

    document.body.appendChild(this.fabBar);
  }

  private buildFabButton(
    label: string,
    icon: string,
    extraClass: string,
    onClick: () => void
  ): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = `mobile-fab-btn ${extraClass}`;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = `${icon}<span>${label}</span>`;
    btn.addEventListener('click', onClick);
    return btn;
  }

  /* ── Drawer open / close ───────────────────────────────────────────────── */

  private toggleDrawer(side: 'left' | 'right'): void {
    const sidebar = document.getElementById('sidebar');
    const customization = document.getElementById('customization');

    if (side === 'left') {
      const isOpen = sidebar?.classList.contains('mobile-open');
      this.closeAllDrawers();
      if (!isOpen) {
        sidebar?.classList.add('mobile-open');
        this.backdrop?.classList.add('active');
        this.componentsFabBtn?.classList.add('active');
        document.body.classList.add('drawer-open');
      }
    } else {
      const isOpen = customization?.classList.contains('mobile-open');
      this.closeAllDrawers();
      if (!isOpen) {
        customization?.classList.add('mobile-open');
        this.backdrop?.classList.add('active');
        this.propertiesFabBtn?.classList.add('active');
        document.body.classList.add('drawer-open');
      }
    }
  }

  private closeAllDrawers(): void {
    document.getElementById('sidebar')?.classList.remove('mobile-open');
    document.getElementById('customization')?.classList.remove('mobile-open');
    this.backdrop?.classList.remove('active');
    this.componentsFabBtn?.classList.remove('active');
    this.propertiesFabBtn?.classList.remove('active');
    document.body.classList.remove('drawer-open');
  }

  /* ── Tap-to-add ────────────────────────────────────────────────────────── */

  private enableTapToAdd(): void {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const handler = (e: Event) => {
      if (!this.mediaQuery.matches) return;

      const target = (e.target as HTMLElement).closest(
        '.draggable'
      ) as HTMLElement | null;
      if (!target) return;

      e.preventDefault();
      e.stopPropagation();

      const componentType = target.id;
      const customSettingsAttr = target.getAttribute('data-component-settings');

      this.addComponentToCanvas(componentType, customSettingsAttr);
      this.closeAllDrawers();
    };

    sidebar.addEventListener('click', handler);
    this.tapListenerCleanup = () =>
      sidebar.removeEventListener('click', handler);
  }

  private disableTapToAdd(): void {
    this.tapListenerCleanup?.();
    this.tapListenerCleanup = null;
  }

  private addComponentToCanvas(
    componentType: string,
    customSettings: string | null
  ): void {
    const canvasEl = CanvasSharedState.canvasElement;
    if (!canvasEl || CanvasSharedState.editable === false) return;

    let resolvedSettings = customSettings;

    /* Fall back to globally registered custom component settings */
    if (!resolvedSettings || resolvedSettings.trim() === '') {
      const customComponents = (
        window as Window & {
          customComponents?: Record<string, { settings?: object }>;
        }
      ).customComponents;
      if (customComponents?.[componentType]?.settings) {
        resolvedSettings = JSON.stringify(
          customComponents[componentType].settings
        );
      }
    }

    const component = Canvas.createComponent(componentType, resolvedSettings);
    if (!component) return;

    const uniqueClass = Canvas.generateUniqueClass(componentType);
    component.id = uniqueClass;
    component.classList.add(uniqueClass);

    /* Grid mode: no absolute positioning, no draggable */
    component.style.position = '';
    if (component.hasAttribute('draggable')) {
      component.removeAttribute('draggable');
      component.style.cursor = 'default';
    }

    /* Set stable initial width for block-display components */
    const computedDisplay = window.getComputedStyle(component).display;
    if (computedDisplay === 'block' && !component.style.width) {
      component.style.width = '100%';
    }

    CanvasSharedState.components.push(component);

    /* Insert before the scroll spacer so it always stays last */
    const spacer = canvasEl.querySelector('#canvas-scroll-spacer');
    if (spacer) {
      canvasEl.insertBefore(component, spacer);
    } else {
      canvasEl.appendChild(component);
    }

    CanvasSharedState.updateCanvasScrollSpace();
    CanvasSharedState.historyManager.captureState();
    CanvasEventDispatcher.dispatchDesignChange();

    /* Auto-switch sidebar to the newly added component */
    import('../sidebar/CustomizationSidebar').then(
      ({ CustomizationSidebar }) => {
        CustomizationSidebar.showSidebar(component.id);
        /* Open the properties drawer so user can immediately customise */
        if (this.mediaQuery.matches) {
          setTimeout(() => this.toggleDrawer('right'), 150);
        }
      }
    );
  }

  /* ── Viewport change handler ───────────────────────────────────────────── */

  private onViewportChange(editable: boolean | null): void {
    if (this.mediaQuery.matches) {
      /* Switched to mobile */
      if (editable !== false) {
        this.enableTapToAdd();
      }
      /* Ensure drawers are closed on initial mobile render */
      this.closeAllDrawers();
    } else {
      /* Switched back to desktop — restore normal sidebar visibility */
      this.disableTapToAdd();
      this.closeAllDrawers();

      const sidebar = document.getElementById('sidebar');
      const customization = document.getElementById('customization');

      /* Reset any inline display overrides the drawer may have applied */
      if (sidebar) sidebar.style.display = '';
      if (customization) customization.style.display = '';
    }
  }
}
