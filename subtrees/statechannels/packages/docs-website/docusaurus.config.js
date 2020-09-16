module.exports = {
  title: 'statechannels docs',
  tagline: 'A tech stack for state channel applications and networks',
  url: 'https://docs.statechannels.org',
  baseUrl: '/',
  organizationName: 'statechannels',
  projectName: 'docs-website',
  scripts: ['https://buttons.github.io/buttons.js'],
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Chivo&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css'
  ],
  favicon: 'img/favicon.ico',
  customFields: {
    users: [
      {
        caption: 'User1',
        image: '/img/undraw_open_source.svg',
        infoLink: 'https://www.facebook.com',
        pinned: true
      }
    ],
    markdownPlugins: [null],
    fonts: {
      myFont: ['Chivo', 'sans-serif']
    },
    repoUrl: 'https://github.com/statechannels/statechannels',
    packageUrl: 'https://www.npmjs.com/package/@statechannels/nitro-protocol'
  },
  onBrokenLinks: 'log',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/', // Set this value to '/'.
          homePageId: 'overview',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          sidebarPath: require.resolve('./sidebars.json')
        },
        blog: {
          path: 'blog'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],
  plugins: [],
  themeConfig: {
    navbar: {
      title: 'statechannels docs',
      logo: {
        src: 'img/logo.svg'
      },
      items: [
        {
          to: '/',
          label: 'Docs',
          position: 'left'
        },
        {
          to: '/typescript-api/index',
          label: 'Typescript API',
          position: 'left'
        },
        {
          to: '/contract-api/contract-inheritance',
          label: 'Contract API',
          position: 'left'
        }
      ]
    },
    image: 'img/undraw_online.svg',
    footer: {
      links: [],
      copyright: 'Copyright © 2020',
      logo: {
        src: 'img/logo.svg'
      }
    },
    algolia: {
      apiKey: '1868e7d6465afaecbff245a9bd7627bb',
      indexName: 'statechannels'
    },
    prism: {
      additionalLanguages: ['solidity'],
      theme: require('prism-react-renderer/themes/oceanicNext')
    }
  }
};
