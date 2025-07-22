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
      }),
    ],
  ],
};

module.exports = config;

