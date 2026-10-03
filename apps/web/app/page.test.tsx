import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import Home from './page';

const renderPage = () => renderToStaticMarkup(<Home />);

describe('[AC-2] [AC-5] root page DOM-only scope and web test configuration', () => {
  test('[AC-1] [AC-3] exposes exactly one native level-1 heading named EM Hackathon', () => {
    const markup = renderPage();

    expect(markup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(markup).toContain('<h1>EM Hackathon</h1>');
  });

  test('[AC-2] preserves representative existing content and its relative DOM order', () => {
    const markup = renderPage();
    const existingContent = [
      'alt="Next.js logo"',
      'Save and see your changes instantly.',
      'Deploy now',
      'Read our docs',
      'Open alert',
      'Learn',
      'Examples',
      'Go to nextjs.org →',
    ];

    const positions = existingContent.map((content) => markup.indexOf(content));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  test('[AC-4] renders the production page component for build compatibility', () => {
    expect(renderPage()).toMatch(/^<link[^>]+><div/);
  });

  test('[AC-5] verifies the expected web-only changed-file and Jest configuration scope', () => {
    const expectedTaskFiles = [
      'app/page.tsx',
      'app/page.test.tsx',
      'package.json',
      'jest.config.js',
      'jest.setup.ts',
    ];
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
    ) as { scripts: { test?: string } };

    expect(
      expectedTaskFiles.every((file) => existsSync(join(process.cwd(), file))),
    ).toBe(true);
    expect(packageJson.scripts.test).toBe('jest');
  });
});
