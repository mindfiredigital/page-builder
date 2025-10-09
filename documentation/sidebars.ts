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
        'configuration/features/drag-drop',
        'configuration/features/design-export',
        'configuration/features/styling-components',
        'configuration/features/view-mode',
        'configuration/features/attributes-formulas',
        'configuration/features/custom-components',
        'configuration/features/state-management',
        'configuration/features/event-handling',
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
