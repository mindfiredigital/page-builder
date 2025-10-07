module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: ['introduction', 'quick-start'],
    },
    {
      type: 'category',
      label: 'Configuration',
      collapsed: false,
      items: [
        'core/features/drag-drop',
        'core/features/design-export',
        'core/features/styling-components',
        'core/features/view-mode',
        'core/features/attributes-formulas',
        'core/features/custom-components',
        'core/features/state-management',
        'core/features/event-handling',
      ],
    },
    {
      type: 'category',
      label: ' React Wrapper',
      collapsed: false,
      items: ['react/examples'],
    },

    {
      type: 'category',
      label: 'Guides',
      items: ['guides/best-practices', 'guides/accessibility'],
    },
  ],
};
