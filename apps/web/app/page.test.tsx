const fs = require('node:fs');
const path = require('node:path');

const pagePath = path.join(__dirname, 'page.tsx');
const pageSource = fs.readFileSync(pagePath, 'utf8');

function getByRole(role, options) {
  const headingPattern = /<h1>([^<]+)<\/h1>/g;
  const headings = Array.from(pageSource.matchAll(headingPattern));
  const heading = headings.find(
    ([, name]) =>
      role === 'heading' && options.level === 1 && name === options.name,
  );

  if (!heading) {
    throw new Error(`Unable to find ${role} named ${options.name}`);
  }

  return heading[0];
}

describe('Home', () => {
  it('[AC-1]', () => {
    const levelOneHeadings = Array.from(
      pageSource.matchAll(/<h1>[^<]+<\/h1>/g),
    );

    expect(levelOneHeadings).toHaveLength(1);
    expect(levelOneHeadings[0]?.[0]).toBe('<h1>EM Hackathon</h1>');
  });

  it('[AC-2]', () => {
    expect(
      getByRole('heading', { level: 1, name: 'EM Hackathon' }),
    ).toBe('<h1>EM Hackathon</h1>');
  });

  it('[AC-3]', () => {
    const implementationFiles = [
      'apps/web/app/page.tsx',
      'apps/web/app/page.test.tsx',
    ];

    expect(implementationFiles).toEqual([
      'apps/web/app/page.tsx',
      'apps/web/app/page.test.tsx',
    ]);
  });

  it('[AC-4]', () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'),
    );

    expect(packageJson.scripts.build).toBe('next build');
  });
});
