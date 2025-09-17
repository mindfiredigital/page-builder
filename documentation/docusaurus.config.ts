import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Page Builder',
  tagline:
    'Lightweight page builder library designed for creating static web pages with a drag-and-drop interface. This component library generates HTML output and supports customization options. Built with TypeScript and vanilla JavaScript for performance, it includes modular components, responsive previews, and data handling for layout storage and retrieval.',
  favicon: 'img/logo.png',

  url: 'https://mindfiredigital.github.io',
  baseUrl: '/page-builder',

  organizationName: 'mindfiredigital',
  projectName: 'page-builder',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Page Builder',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentaion',
        },
        {
          href: 'https://github.com/mindfiredigital/page-builder',
          className: 'header--github-link',
          'aria-label': 'GitHub repository',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [],
      copyright: ` © ${new Date().getFullYear()} Mindfire FOSS`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
