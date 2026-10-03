const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const pageSource = readFileSync(join(__dirname, 'page.tsx'), 'utf8');
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf8'),
);

function renderRootPage() {
  const headings = Array.from(
    pageSource.matchAll(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/g),
    (match) => match[1].replace(/<[^>]+>/g, '').trim(),
  );

  return {
    getByRole(role, options) {
      if (role !== 'heading' || options.level !== 1) {
        throw new Error('No matching role');
      }

      const matches = headings.filter((heading) => heading === options.name);
      if (matches.length !== 1) {
        throw new Error(`Expected one matching heading, received ${matches.length}`);
      }

      return matches[0];
    },
    headings,
  };
}

describe('Home', () => {
  it('[AC-1]', () => {
    const screen = renderRootPage();

    expect(
      screen.getByRole('heading', { level: 1, name: 'EM Hackathon' }),
    ).toBe('EM Hackathon');
  });

  it('[AC-2]', () => {
    const screen = renderRootPage();

    expect(
      screen.getByRole('heading', { level: 1, name: 'EM Hackathon' }),
    ).toBeDefined();
  });

  it('[AC-3]', () => {
    expect(renderRootPage().headings).toEqual(['EM Hackathon']);
    expect(packageJson.devDependencies).not.toHaveProperty('jest');
    expect(packageJson.devDependencies).not.toHaveProperty(
      'jest-environment-jsdom',
    );
    expect(packageJson.devDependencies).not.toHaveProperty(
      '@testing-library/react',
    );
  });

  it('[AC-4]', () => {
    expect(packageJson.scripts.build).toBe('next build');
  });
});
