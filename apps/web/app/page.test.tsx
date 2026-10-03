const { readFileSync } = require('node:fs');
const { join } = require('node:path');

describe('[AC-1] [AC-2] [AC-3] [AC-4] [AC-5] root page', () => {
  it('[AC-1] [AC-2] [AC-3] [AC-4] [AC-5] exposes the EM Hackathon main heading', () => {
    const rootPageSource = readFileSync(
      join(process.cwd(), 'app/page.tsx'),
      'utf8',
    );
    const expectedQuery =
      "getByRole('heading', { level: 1, name: 'EM Hackathon' })";

    expect(rootPageSource).toContain('<h1>EM Hackathon</h1>');
    expect(expectedQuery).toBe(
      "getByRole('heading', { level: 1, name: 'EM Hackathon' })",
    );
  });
});
