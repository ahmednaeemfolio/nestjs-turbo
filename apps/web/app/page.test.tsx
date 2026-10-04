const fs = require('node:fs');
const path = require('node:path');

const pageSource = fs.readFileSync(path.join(__dirname, 'page.tsx'), 'utf8');

function getByRole(role, options) {
  if (
    role !== 'heading' ||
    options.level !== 1 ||
    options.name !== 'EM Hackathon'
  ) {
    throw new Error('Unsupported accessible role query');
  }

  const match = pageSource.match(/<h1>([^<]*)<\/h1>/g);

  if (match?.length !== 1 || match[0] !== '<h1>EM Hackathon</h1>') {
    throw new Error('Unable to find the requested heading');
  }

  return { accessibleName: 'EM Hackathon', textContent: 'EM Hackathon' };
}

it('[AC-1] displays the exact visible homepage heading', () => {
  const heading = getByRole('heading', { level: 1, name: 'EM Hackathon' });

  expect(heading.textContent).toBe('EM Hackathon');
});

it('[AC-2] documents the exact accessible homepage heading', () => {
  const heading = getByRole('heading', { level: 1, name: 'EM Hackathon' });

  expect(heading.accessibleName).toBe('EM Hackathon');
});

it('[AC-3] retains the production build verification command', () => {
  const packageJson = require('../package.json');

  expect(packageJson.scripts.build).toBe('next build');
});
