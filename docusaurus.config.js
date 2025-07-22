// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const config = {
  title: 'Autify Network Docs',
  tagline: 'Documentation for Autify Network',
  url: 'https://docs.autifynetwork.com', // Your website URL
  baseUrl: '/', // Serves docs at root
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico', // Make sure this file exists under static/img/

  organizationName: 'autifynetwork', // GitHub org/user name
  projectName: 'autify-docs', // GitHub repo name

  themeConfig: {
    metadata: [
      { name: 'keywords', content: 'Autify Network, Climate Credits, Blockchain, ESG, Documentation' },
      { name: 'description', content: 'Documentation for Autify Network — tokenized ESG credits and climate infrastructure on Web3.' },
      { name: 'author', content: 'Autify Network' },
    ],

    navbar: {
      logo: {
        alt: 'Autify Network Logo',
        src: 'img/logo.png', // Place logo here: static/img/logo.png
      },
      items: [
        {
          href: 'https://autifynetwork.com',
          label: 'Main Website',
          position: 'right',
        },
        {
          href: 'https://github.com/autifynetwork/autify-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Introduction', to: '/' },
            { label: 'API Reference', to: '/API_DOCUMENTATION' },
            { label: 'Component Guide', to: '/COMPONENT_DOCUMENTATION' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/autifynetwork/autify-docs' },
            { label: 'Website', href: 'https://autifynetwork.com' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Autify Network. All rights reserved.`,
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/', // Serve docs at root
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],
};

module.exports = config;
