// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://9bow.github.io',
  base: '/learn-rl-for-llms',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    starlight({
      title: 'RL for LLMs',
      defaultLocale: 'root',
      locales: {
        root: { label: '한국어', lang: 'ko' },
      },
      sidebar: [
        { label: '01. 강화학습 기초', autogenerate: { directory: '01-rl-fundamentals' } },
        { label: '02. LLM과 RL의 만남', autogenerate: { directory: '02-rl-meets-llm' } },
        { label: '03. RLHF', autogenerate: { directory: '03-rlhf' } },
        { label: '04. 직접 선호 최적화', autogenerate: { directory: '04-direct-preference' } },
        { label: '05. Reasoning과 RL', autogenerate: { directory: '05-reasoning-rl' } },
        { label: '06. RLVR', autogenerate: { directory: '06-rlvr' } },
        { label: '07. 코드 생성과 RL', autogenerate: { directory: '07-code-rl' } },
        { label: '08. Vision 모델과 RL', autogenerate: { directory: '08-vision-rl' } },
        { label: '09. 에이전트 RL', autogenerate: { directory: '09-agent-rl' } },
        { label: '10. RL 인프라', autogenerate: { directory: '10-infrastructure' } },
        { label: '11. 안전성과 미래', autogenerate: { directory: '11-safety-future' } },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        MarkdownContent: './src/overrides/MarkdownContent.astro',
      },
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
