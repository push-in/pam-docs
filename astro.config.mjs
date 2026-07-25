import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://pam.dev',
  integrations: [
    starlight({
      title: 'PAM',
      description: 'The persistent PHP runtime for servers, native mobile, and desktop applications.',
      logo: {
        src: './src/assets/pam-mark.svg',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/push-in/pam' },
      ],
      editLink: {
        baseUrl: 'https://github.com/push-in/pam-docs/edit/main/',
      },
      customCss: ['./src/styles/pam.css'],
      components: {
        Header: './src/components/PamHeader.astro',
      },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Introduction', slug: 'introduction' },
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Create your first app', slug: 'getting-started/first-app' },
            { label: 'Choose a target', slug: 'getting-started/choose-a-target' },
            { label: 'Project status', slug: 'project/status' },
          ],
        },
        {
          label: 'Server runtime',
          items: [
            { label: 'How PAM works', slug: 'runtime/how-pam-works' },
            { label: 'HTTP applications', slug: 'runtime/http' },
            { label: 'Async I/O', slug: 'runtime/async-io' },
            { label: 'WebSockets', slug: 'runtime/websockets' },
            { label: 'Composer', slug: 'runtime/composer' },
            { label: 'Production', slug: 'runtime/production' },
            { label: 'Compatibility', slug: 'runtime/compatibility' },
          ],
        },
        {
          label: 'Laravel',
          items: [
            { label: 'Overview', slug: 'laravel/overview' },
            { label: 'Request lifecycle', slug: 'laravel/request-lifecycle' },
            { label: 'Artisan & workers', slug: 'laravel/artisan-and-workers' },
            { label: 'Package matrix', slug: 'laravel/package-matrix' },
            { label: 'Deploy Laravel', slug: 'laravel/deployment' },
          ],
        },
        {
          label: 'Native mobile',
          items: [
            { label: 'Overview', slug: 'native/overview' },
            { label: 'Components', slug: 'native/components' },
            { label: 'State & lifecycle', slug: 'native/state-and-lifecycle' },
            { label: 'Navigation', slug: 'native/navigation' },
            { label: 'Native views', slug: 'native/native-views' },
            { label: 'Plugin SDK', slug: 'native/plugins' },
            { label: 'DevTools', slug: 'native/devtools' },
            { label: 'Protocol & limits', slug: 'native/protocol' },
          ],
        },
        {
          label: 'Mobile UI',
          items: [
            { label: 'Overview', slug: 'mobile-ui/overview' },
            { label: 'Authoring', slug: 'mobile-ui/authoring' },
            { label: 'Component catalog', slug: 'mobile-ui/components' },
            { label: 'Themes & utilities', slug: 'mobile-ui/themes' },
            { label: 'Parity contract', slug: 'mobile-ui/parity' },
            { label: 'Performance', slug: 'mobile-ui/performance' },
          ],
        },
        {
          label: 'Desktop',
          items: [
            { label: 'Overview', slug: 'desktop/overview' },
            { label: 'Windows & commands', slug: 'desktop/windows-and-commands' },
            { label: 'Native capabilities', slug: 'desktop/capabilities' },
            { label: 'Security model', slug: 'desktop/security' },
            { label: 'Distribution', slug: 'desktop/distribution' },
          ],
        },
        {
          label: 'Packages',
          items: [
            { label: 'Package ecosystem', slug: 'packages/overview' },
            { label: 'pam/api', slug: 'packages/api' },
            { label: 'pam/socket', slug: 'packages/socket' },
            { label: 'pam/psr-bridge', slug: 'packages/psr-bridge' },
            { label: 'pam/testing', slug: 'packages/testing' },
            { label: 'pam/core-api', slug: 'packages/core-api' },
          ],
        },
        {
          label: 'Community',
          items: [
            { label: 'Contributing', slug: 'community/contributing' },
            { label: 'Roadmap', slug: 'community/roadmap' },
            { label: 'Security', slug: 'community/security' },
            { label: 'Licensing', slug: 'community/licensing' },
          ],
        },
      ],
    }),
  ],
});
