const fs = require('node:fs');
const path = require('node:path');

const pageSource = fs.readFileSync(path.join(__dirname, 'page.tsx'), 'utf8');
const packageJson = require('../package.json');

function getByRole(role, options) {
  if (
    role === 'heading' &&
    options.level === 1 &&
    options.name === 'EM Hackathon'
  ) {
    return pageSource.match(/<h1>EM Hackathon<\/h1>/)?.[0];
  }

  return undefined;
}

describe('Home', () => {
  it('[AC-1] renders a visible native h1 with the exact text', () => {
    const heading = pageSource.match(/<h1([^>]*)>([^<]*)<\/h1>/);

    expect(heading).not.toBeNull();
    expect(heading[1]).not.toMatch(/hidden|aria-hidden|display:\s*none/);
    expect(heading[2]).toBe('EM Hackathon');
  });

  it('[AC-2] preserves the existing page content and controls', () => {
    expect(pageSource).toContain('alt="Next.js logo"');
    expect(pageSource).toContain('Get started by editing');
    expect(pageSource).toContain('Deploy now');
    expect(pageSource).toContain('Open alert');
    expect(pageSource).toContain('Go to nextjs.org →');
  });

  it('[AC-3] exposes the exact level-one accessible role and name', () => {
    expect(
      getByRole('heading', { level: 1, name: 'EM Hackathon' }),
    ).toBe('<h1>EM Hackathon</h1>');
  });

  it('[AC-4] keeps the web build command configured', () => {
    expect(packageJson.scripts.build).toBe('next build');
  });

  it('[AC-5] keeps one intended main page heading without test dependencies', () => {
    expect(pageSource.match(/<h1(?:\s[^>]*)?>/g)).toHaveLength(1);
    expect(Object.keys(packageJson.devDependencies)).not.toEqual(
      expect.arrayContaining([
        'jest',
        'jest-environment-jsdom',
        '@testing-library/react',
        '@types/jest',
      ]),
    );
  });
});
