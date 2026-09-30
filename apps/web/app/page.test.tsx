import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const pagePath = resolve(process.cwd(), 'app/page.tsx');
const originalPageHash =
  '4b50f3b436e1a14820a2472b4c706882190c1f41f9d09a89a47b908f464dad82';

test('the main page exposes the exact accessible heading without changing its presentation', () => {
  const page = readFileSync(pagePath, 'utf8');
  const heading =
    '<li role="heading" aria-level={1}>\n            EM Hackathon\n          </li>';

  assert.equal(page.split('EM Hackathon').length - 1, 1);
  assert.ok(page.includes(heading));

  const restoredPage = page
    .replace('<li role="heading" aria-level={1}>', '<li>')
    .replace(
      heading.replace('<li role="heading" aria-level={1}>', '<li>'),
      '<li>\n            Get started by editing <code>app/page.tsx</code>\n          </li>',
    );
  const restoredHash = createHash('sha256').update(restoredPage).digest('hex');

  assert.equal(
    restoredHash,
    originalPageHash,
    'restoring the original copy and removing the heading semantics must reproduce the original page source exactly',
  );
});
