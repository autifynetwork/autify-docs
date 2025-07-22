
// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const config = {
  title: 'Autify Network Docs',
  tagline: 'Documentation for Autify Network',
  url: 'https://docs.autifynetwork.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'favicon.ico',
  organizationName: 'autifynetwork',
  projectName: 'autify-docs',
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
};

module.exports = config;
