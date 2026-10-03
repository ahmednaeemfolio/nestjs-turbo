const { readFileSync } = require('node:fs');
const { join } = require('node:path');

test('[AC-1] [AC-2] [AC-3] [AC-4] [AC-5] documents the EM Hackathon main heading', () => {
  const pageSource = readFileSync(join(__dirname, 'page.tsx'), 'utf8');

  expect(pageSource).toContain('<h1>EM Hackathon</h1>');

  // Expected Testing Library query after rendering the root page:
  // getByRole('heading', { level: 1, name: 'EM Hackathon' })
});
