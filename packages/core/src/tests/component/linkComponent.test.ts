import { LinkComponent } from '../../components/LinkComponent';

describe('LinkComponent', () => {
  let linkComponent: LinkComponent;

  beforeEach(() => {
    linkComponent = new LinkComponent();
    document.body.innerHTML = '';
  });

  // ── create() ────────────────────────────────────────────────────────────────
  describe('create()', () => {
    it('should return a div with class "link-component"', () => {
      const el = linkComponent.create();
      expect(el.tagName).toBe('DIV');
      expect(el.classList.contains('link-component')).toBe(true);
    });

    it('should render an anchor with default href "#"', () => {
      const el = linkComponent.create();
      const anchor = el.querySelector(
        '.link-component-label'
      ) as HTMLAnchorElement;
      expect(anchor).not.toBeNull();
      expect(anchor.getAttribute('href')).toBe('#');
    });

    it('should render an anchor with default label "Click Here"', () => {
      const el = linkComponent.create();
      const anchor = el.querySelector(
        '.link-component-label'
      ) as HTMLAnchorElement;
      expect(anchor.innerText).toBe('Click Here');
    });

    it('should use provided href and label', () => {
      const el = linkComponent.create('https://example.com', 'Go Here');
      const anchor = el.querySelector(
        '.link-component-label'
      ) as HTMLAnchorElement;
      expect(anchor.href).toContain('example.com');
      expect(anchor.innerText).toBe('Go Here');
    });

    it('should render an edit button with pencil icon', () => {
      const el = linkComponent.create();
      const btn = el.querySelector('.edit-link') as HTMLButtonElement;
      expect(btn).not.toBeNull();
      expect(btn.innerHTML).toBe('🖊️');
    });

    it('should render a hidden edit form', () => {
      const el = linkComponent.create();
      const form = el.querySelector('.edit-link-form') as HTMLDivElement;
      expect(form).not.toBeNull();
    });

    it('edit button click should show form and hide link', () => {
      const el = linkComponent.create();
      const btn = el.querySelector('.edit-link') as HTMLButtonElement;
      const anchor = el.querySelector(
        '.link-component-label'
      ) as HTMLAnchorElement;
      const form = el.querySelector('.edit-link-form') as HTMLDivElement;

      btn.click();

      expect(anchor.style.display).toBe('none');
      expect(btn.style.display).toBe('none');
      expect(form.style.display).toBe('flex');
    });

    it('save button should update link href and hide form', () => {
      const el = linkComponent.create();
      document.body.appendChild(el);

      const editBtn = el.querySelector('.edit-link') as HTMLButtonElement;
      editBtn.click();

      const urlInput = el.querySelector(
        'input[type="url"]'
      ) as HTMLInputElement;
      const saveBtn = el.querySelector(
        '.edit-link-form button'
      ) as HTMLButtonElement;
      const anchor = el.querySelector(
        '.link-component-label'
      ) as HTMLAnchorElement;
      const form = el.querySelector('.edit-link-form') as HTMLDivElement;

      urlInput.value = 'https://new-url.com';
      saveBtn.click();

      expect(anchor.href).toContain('new-url.com');
      expect(anchor.style.display).toBe('inline');
      expect(form.style.display).toBe('none');
    });

    it('save button with checkbox checked should set target to _blank', () => {
      const el = linkComponent.create();
      document.body.appendChild(el);

      const editBtn = el.querySelector('.edit-link') as HTMLButtonElement;
      editBtn.click();

      const checkbox = el.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      const saveBtn = el.querySelector(
        '.edit-link-form button'
      ) as HTMLButtonElement;
      const anchor = el.querySelector(
        '.link-component-label'
      ) as HTMLAnchorElement;

      checkbox.checked = true;
      saveBtn.click();

      expect(anchor.target).toBe('_blank');
    });

    it('save button with checkbox unchecked should set target to _self', () => {
      const el = linkComponent.create();
      document.body.appendChild(el);

      const editBtn = el.querySelector('.edit-link') as HTMLButtonElement;
      editBtn.click();

      const saveBtn = el.querySelector(
        '.edit-link-form button'
      ) as HTMLButtonElement;
      const anchor = el.querySelector(
        '.link-component-label'
      ) as HTMLAnchorElement;

      saveBtn.click();
      expect(anchor.target).toBe('_self');
    });
  });

  // ── getLinkData() ────────────────────────────────────────────────────────────
  describe('getLinkData()', () => {
    it('should return default values before any update', () => {
      linkComponent.create();
      const data = linkComponent.getLinkData();
      expect(data.href).toContain('#');
      expect(data.label).toBe('Click Here');
      expect(data.target).toBe('_self');
    });
  });

  // ── updateLink() ─────────────────────────────────────────────────────────────
  describe('updateLink()', () => {
    it('should update href, label, and target', () => {
      linkComponent.create();
      linkComponent.updateLink('https://updated.com', 'Updated', '_blank');
      const data = linkComponent.getLinkData();
      expect(data.href).toContain('updated.com');
      expect(data.label).toBe('Updated');
      expect(data.target).toBe('_blank');
    });

    it('should default target to _self when not provided', () => {
      linkComponent.create();
      linkComponent.updateLink('https://example.com', 'Label');
      expect(linkComponent.getLinkData().target).toBe('_self');
    });
  });

  // ── isInEditMode() ───────────────────────────────────────────────────────────
  describe('isInEditMode()', () => {
    it('should return false initially', () => {
      linkComponent.create();
      expect(linkComponent.isInEditMode()).toBe(false);
    });

    it('should return true after edit button click', () => {
      const el = linkComponent.create();
      const editBtn = el.querySelector('.edit-link') as HTMLButtonElement;
      editBtn.click();
      expect(linkComponent.isInEditMode()).toBe(true);
    });

    it('should return false after save', () => {
      const el = linkComponent.create();
      document.body.appendChild(el);
      const editBtn = el.querySelector('.edit-link') as HTMLButtonElement;
      editBtn.click();
      const saveBtn = el.querySelector(
        '.edit-link-form button'
      ) as HTMLButtonElement;
      saveBtn.click();
      expect(linkComponent.isInEditMode()).toBe(false);
    });
  });

  // ── static restore() ────────────────────────────────────────────────────────
  describe('static restore()', () => {
    it('should restore edit/save button event listeners', () => {
      const el = linkComponent.create();
      document.body.appendChild(el);
      LinkComponent.restore(el);

      const editBtn = el.querySelector('.edit-link') as HTMLButtonElement;
      const form = el.querySelector('.edit-link-form') as HTMLDivElement;
      editBtn.click();
      expect(form.style.display).toBe('flex');
    });

    it('should set initial display states correctly', () => {
      const el = linkComponent.create();
      document.body.appendChild(el);
      LinkComponent.restore(el);

      const anchor = el.querySelector(
        '.link-component-label'
      ) as HTMLAnchorElement;
      const editBtn = el.querySelector('.edit-link') as HTMLButtonElement;
      const form = el.querySelector('.edit-link-form') as HTMLDivElement;

      expect(anchor.style.display).toBe('inline');
      expect(editBtn.style.display).toBe('inline-flex');
      expect(form.style.display).toBe('none');
    });

    it('should log error when required elements are missing', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const emptyDiv = document.createElement('div');
      emptyDiv.classList.add('link-component');
      // Missing inner elements
      const editForm = document.createElement('div');
      editForm.classList.add('edit-link-form');
      emptyDiv.appendChild(editForm);
      document.body.appendChild(emptyDiv);

      LinkComponent.restore(emptyDiv);
      expect(consoleSpy).toHaveBeenCalledWith('Required elements not found');
    });
  });
});
