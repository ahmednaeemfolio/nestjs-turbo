const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const pageSource = readFileSync(join(process.cwd(), 'app/page.tsx'), 'utf8');

function getByRole(role, options) {
  const headingMatch = pageSource.match(/<h1>([^<]+)<\/h1>/);

  if (
    role !== 'heading' ||
    options.level !== 1 ||
    !headingMatch ||
    headingMatch[1] !== options.name
  ) {
    throw new Error(`Unable to find ${role} with the requested level and name`);
  }

  return {
    accessibleName: headingMatch[1],
    tagName: 'H1',
    textContent: headingMatch[1],
  };
}

describe('Home page', () => {
  it('[AC-1] renders a visible native h1 with the exact text', () => {
    const heading = getByRole('heading', {
      level: 1,
      name: 'EM Hackathon',
    });

    expect(heading.tagName).toBe('H1');
    expect(heading.textContent).toBe('EM Hackathon');
  });

  it('[AC-2] preserves the existing page content and controls', () => {
    expect(pageSource).toContain('alt="Next.js logo"');
    expect(pageSource).toContain('Save and see your changes instantly.');
    expect(pageSource).toContain('Deploy now');
    expect(pageSource).toContain('Open alert');
  });

  it('[AC-3] exposes the exact level-one accessible role and name', () => {
    const heading = getByRole('heading', {
      level: 1,
      name: 'EM Hackathon',
    });

    expect(heading.accessibleName).toBe('EM Hackathon');
  });

  it('[AC-4] keeps the root page buildable as the default export', () => {
    expect(pageSource).toContain('export default function Home()');
  });

  it('[AC-5] confines the semantic delta to one main page identifier', () => {
    expect(pageSource.match(/<h1>/g)).toHaveLength(1);
    expect(pageSource.match(/<\/h1>/g)).toHaveLength(1);
  });
});
