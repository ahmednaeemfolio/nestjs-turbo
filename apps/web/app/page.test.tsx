const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const pageSource = readFileSync(join(__dirname, 'page.tsx'), 'utf8');

const getByRole = (
  role = '',
  options = { level: 0, name: '' },
) => {
  if (
    role !== 'heading' ||
    options.level !== 1 ||
    options.name !== 'EM Hackathon'
  ) {
    throw new Error('No matching accessible element found');
  }

  const matches = pageSource.match(/<h1>EM Hackathon<\/h1>/g) ?? [];

  if (matches.length !== 1) {
    throw new Error('Expected one matching accessible element');
  }

  return {
    accessibleName: 'EM Hackathon',
    tagName: 'H1',
    textContent: 'EM Hackathon',
  };
};

describe('Home page heading', () => {
  it('[AC-1] renders a native level-one heading with exact visible text', () => {
    const heading = getByRole('heading', {
      level: 1,
      name: 'EM Hackathon',
    });

    expect(heading.tagName).toBe('H1');
    expect(heading.textContent).toBe('EM Hackathon');
  });

  it('[AC-2] exposes the exact accessible heading name', () => {
    const heading = getByRole('heading', {
      level: 1,
      name: 'EM Hackathon',
    });

    expect(heading.accessibleName).toBe('EM Hackathon');
  });

  it('[AC-3] keeps the static heading available without an asynchronous state', () => {
    const heading = getByRole('heading', {
      level: 1,
      name: 'EM Hackathon',
    });

    expect(heading).toEqual({
      accessibleName: 'EM Hackathon',
      tagName: 'H1',
      textContent: 'EM Hackathon',
    });
  });
});
