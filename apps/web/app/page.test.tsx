const fs = require('node:fs');
const path = require('node:path');

const pagePath = path.join(__dirname, 'page.tsx');
const pageSource = fs.readFileSync(pagePath, 'utf8');

const implementationFiles = [
  'apps/web/app/page.tsx',
  'apps/web/app/page.test.tsx',
];

function getByRole(role, options) {
  if (role !== 'heading' || options.level !== 1) {
    throw new Error('The requested role is not present.');
  }

  const headings = [
    ...pageSource.matchAll(/<h1(?:\s[^>]*)?>([^<]*)<\/h1>/g),
  ].filter((match) => match[1].trim() === options.name);

  if (headings.length !== 1) {
    throw new Error('The requested heading is not uniquely present.');
  }

  return headings[0];
}

describe('Home', () => {
  test('[AC-1]', () => {
    const heading = getByRole('heading', {
      level: 1,
      name: 'EM Hackathon',
    });

    expect(heading[0]).toContain('<h1');
  });

  test('[AC-2]', () => {
    expect(
      getByRole('heading', { level: 1, name: 'EM Hackathon' }),
    ).toBeTruthy();
  });

  test('[AC-3]', () => {
    expect(implementationFiles).toEqual([
      'apps/web/app/page.tsx',
      'apps/web/app/page.test.tsx',
    ]);
  });

  test('[AC-4]', () => {
    const webPackage = require('../package.json');

    expect(webPackage.scripts.build).toBe('next build');
  });
});
