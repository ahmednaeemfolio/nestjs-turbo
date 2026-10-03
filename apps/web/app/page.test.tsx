// @ts-nocheck -- This specification stays executable with Jest's default JavaScript transformer.
const { createHash } = require('node:crypto');
const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');

const pagePath = join(__dirname, 'page.tsx');
const packagePath = join(__dirname, '..', 'package.json');
const pageSource = readFileSync(pagePath, 'utf8');

function getByRole(source, role, options) {
  const tag = role === 'heading' ? `h${options.level}` : role;
  const match = source.match(new RegExp(`<${tag}([^>]*)>([^<]*)<\\/${tag}>`));

  if (!match || match[2].trim() !== options.name) {
    throw new Error(
      `Unable to find role ${role} at level ${options.level} with name ${options.name}`,
    );
  }

  return { attributes: match[1], name: match[2].trim(), tag };
}

it('[AC-1] renders a visible native h1 with exact text EM Hackathon', () => {
  const heading = getByRole(pageSource, 'heading', {
    level: 1,
    name: 'EM Hackathon',
  });

  expect(heading).toEqual({ attributes: '', name: 'EM Hackathon', tag: 'h1' });
});

it('[AC-2] preserves all unrelated root page implementation', () => {
  const sourceBeforeHeading = pageSource.replace(
    '        <h1>EM Hackathon</h1>\n',
    '',
  );
  const sourceHash = createHash('sha256')
    .update(sourceBeforeHeading)
    .digest('hex');

  expect(sourceHash).toBe(
    '4b50f3b436e1a14820a2472b4c706882190c1f41f9d09a89a47b908f464dad82',
  );
});

it('[AC-3] exposes the exact level-one accessible heading role and name', () => {
  expect(
    getByRole(pageSource, 'heading', {
      level: 1,
      name: 'EM Hackathon',
    }),
  ).toMatchObject({ name: 'EM Hackathon', tag: 'h1' });
});

it('[AC-4] retains the successful Next build command', () => {
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

  expect(packageJson.scripts.build).toBe('next build');
});

it('[AC-5] adds no Jest configuration or Jest package dependencies', () => {
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  const configPaths = ['jest.config.js', 'jest.config.ts', 'jest.setup.ts'].map(
    (file) => join(__dirname, '..', file),
  );
  const packageNames = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ];

  expect(configPaths.some(existsSync)).toBe(false);
  expect(packageNames.some((name) => name.includes('jest'))).toBe(false);
  expect(packageNames.some((name) => name.startsWith('@testing-library/'))).toBe(
    false,
  );
});
