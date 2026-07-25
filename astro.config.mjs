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
          ],
        },
        {
          label: 'Laravel',
          items: [
            { label: 'Overview', slug: 'laravel/overview' },
          ],
        },
        {
          label: 'Native mobile',
          items: [
            { label: 'Overview', slug: 'native/overview' },
          ],
        },
        {
          label: 'Mobile UI',
          items: [
            { label: 'Overview', slug: 'mobile-ui/overview' },
          ],
        },
        {
          label: 'Desktop',
          items: [
            { label: 'Overview', slug: 'desktop/overview' },
          ],
        },
        {
          label: 'Packages',
          items: [
            { label: 'Package ecosystem', slug: 'packages/overview' },
          ],
        },
        {
          label: 'Community',
          items: [
            { label: 'Contributing', slug: 'community/contributing' },
            { label: 'Roadmap', slug: 'community/roadmap' },
          ],
        },
      ],
    }),
  ],
});
