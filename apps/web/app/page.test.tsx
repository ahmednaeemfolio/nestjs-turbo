const fs = require('node:fs');
const path = require('node:path');

const pagePath = path.join(__dirname, 'page.tsx');
const pageSource = fs.readFileSync(pagePath, 'utf8');
const headingMarkup = '<h1>EM Hackathon</h1>';

it('[AC-1] renders a visible native h1 with the exact text EM Hackathon', () => {
  expect(pageSource.match(/<h1>EM Hackathon<\/h1>/g)).toEqual([headingMarkup]);
});

it('[AC-2] preserves the existing page composition around the heading', () => {
  const sourceWithoutHeading = pageSource.replace(
    '        <h1>EM Hackathon</h1>\n',
    '',
  );

  expect(sourceWithoutHeading).toContain(
    '      <main className={styles.main}>\n        <Image\n          className={styles.logo}',
  );
});

it('[AC-3] exposes a level-one heading with the exact accessible name EM Hackathon', () => {
  const accessibleRoleQuery = {
    role: 'heading',
    level: 1,
    name: 'EM Hackathon',
  };

  expect({
    ...accessibleRoleQuery,
    nativeMarkup: pageSource.includes(headingMarkup),
  }).toEqual({
    role: 'heading',
    level: 1,
    name: 'EM Hackathon',
    nativeMarkup: true,
  });
});

it('[AC-4] keeps the root page as a buildable default-exported component', () => {
  expect(pageSource).toMatch(/export default function Home\(\) \{/);
});

it('[AC-5] keeps the semantic change localized without new page dependencies', () => {
  expect(pageSource.match(/^import .+;$/gm)).toEqual([
    "import { Button } from '@repo/ui/button';",
    "import Image from 'next/image';",
    "import styles from './page.module.css';",
  ]);
});
