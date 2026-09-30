import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const pagePath = join(dirname(fileURLToPath(import.meta.url)), 'page.tsx');
const page = readFileSync(pagePath, 'utf8');

test('main page has the approved heading in the expected position', () => {
  assert.equal((page.match(/<h1\b/g) ?? []).length, 1);

  const heading = page.match(/<h1>(.*?)<\/h1>/);
  assert.ok(heading);
  assert.equal(heading[1], 'EM hackathon');

  const mainStart = page.indexOf('<main');
  const mainEnd = page.indexOf('</main>', mainStart);
  const logoStart = page.indexOf('src="/next.svg"', mainStart);
  const logoEnd = page.indexOf('/>', logoStart);
  const headingStart = heading.index;
  const orderedListStart = page.indexOf('<ol>', headingStart);

  assert.ok(mainStart >= 0 && mainEnd > mainStart);
  assert.ok(logoStart > mainStart && logoEnd < headingStart);
  assert.ok(headingStart > logoEnd && headingStart < orderedListStart);
  assert.ok(orderedListStart < mainEnd);
});

test('main page keeps its existing list items, actions, and footer links', () => {
  assert.match(
    page,
    /<li>\s*Get started by editing <code>app\/page\.tsx<\/code>\s*<\/li>/,
  );
  assert.match(page, /<li>Save and see your changes instantly\.<\/li>/);

  assert.match(
    page,
    /href="https:\/\/vercel\.com\/new\?[^\"]+"[\s\S]*?Deploy now\s*<\/a>/,
  );
  assert.match(
    page,
    /href="https:\/\/nextjs\.org\/docs\?[^\"]+"[\s\S]*?Read our docs\s*<\/a>/,
  );
  assert.match(
    page,
    /<Button appName="web" className={styles\.secondary}>\s*Open alert\s*<\/Button>/,
  );

  assert.match(
    page,
    /href="https:\/\/nextjs\.org\/learn\?[^\"]+"[\s\S]*?Learn\s*<\/a>/,
  );
  assert.match(
    page,
    /href="https:\/\/vercel\.com\/templates\?[^\"]+"[\s\S]*?Examples\s*<\/a>/,
  );
  assert.match(
    page,
    /href="https:\/\/nextjs\.org\?[^\"]+"[\s\S]*?Go to nextjs\.org →\s*<\/a>/,
  );
});
