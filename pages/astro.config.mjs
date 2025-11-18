import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeMermaid from 'rehype-mermaid';

// https://astro.build/config
export default defineConfig({
  site: 'https://pantheon-org.github.io',
  base: '/opencode-font',
  outDir: './dist',
  markdown: {
    rehypePlugins: [[rehypeMermaid, { strategy: 'img-svg' }]],
  },
  integrations: [
    starlight({
      title: 'OpenCode Font',
      description: 'Blocky pixel-art font and text-to-SVG conversion library',
      logo: {
        light: './src/assets/logo-dark.svg',
        dark: './src/assets/logo-light.svg',
        replacesTitle: false,
      },
      expressiveCode: {
        themes: ['github-dark', 'github-light'],
        defaultProps: {
          wrap: true,
        },
        styleOverrides: {
          borderRadius: '0.5rem',
          codePaddingBlock: '1rem',
          frames: {
            shadowColor: 'transparent',
          },
        },
      },
      head: [
        {
          tag: 'meta',
          attrs: {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
          },
        },
      ],
      components: {
        Header: './src/components/Header.astro',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/pantheon-org/opencode-font',
        },
        {
          icon: 'discord',
          label: 'Discord',
          href: 'https://discord.gg/opencode',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/pantheon-org/opencode-font/edit/main/',
      },
      customCss: ['./src/styles/custom.css'],
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
      },
      sidebar: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Interactive Demo',
          link: '/demo/',
        },
        {
          label: 'Glyph Showcase',
          link: '/glyphs/',
        },
      ],
    }),
  ],
});
