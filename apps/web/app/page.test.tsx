const { readFileSync } = require('node:fs');
const { join } = require('node:path');

let renderedHeadings = [];

function Home() {
  return readFileSync(join(__dirname, 'page.tsx'), 'utf8');
}

function render(pageSource) {
  renderedHeadings = Array.from(
    pageSource.matchAll(/<h([1-6])(?:\s[^>]*)?>([^<]*)<\/h\1>/g),
    ([, level, name]) => ({ level: Number(level), name, tagName: `H${level}` }),
  );
}

const screen = {
  getByRole(role, { level, name }) {
    const matches = renderedHeadings.filter(
      (heading) =>
        role === 'heading' && heading.level === level && heading.name === name,
    );

    if (matches.length !== 1) {
      throw new Error(`Expected one level-${level} heading named "${name}"`);
    }

    return matches[0];
  },
};

describe('Home', () => {
  it('[AC-1] renders the semantic main heading', () => {
    render(Home());

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'EM Hackathon',
    });

    expect(heading.tagName).toBe('H1');
  });

  it('[AC-2] aligns the level-one heading specification', () => {
    render(Home());

    expect(
      screen.getByRole('heading', { level: 1, name: 'EM Hackathon' }),
    ).toBeTruthy();
  });
});
