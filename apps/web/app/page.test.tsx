import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const pageSource = readFileSync(fileURLToPath(new URL('./page.tsx', import.meta.url)), 'utf8');
const pageStyles = readFileSync(fileURLToPath(new URL('./page.module.css', import.meta.url)), 'utf8');

test('home page renders the EM Hackathon heading without changing its existing presentation', () => {
  assert.match(pageSource, /<h1>EM Hackathon<\/h1>/);

  // Retain the existing page hierarchy, CSS hooks, and surrounding copy/actions.
  assert.match(pageSource, /<div className=\{styles\.page\}>\s*<main className=\{styles\.main\}>/);
  assert.match(pageSource, /<Image\s+className=\{styles\.logo\}[\s\S]*?alt="Next\.js logo"[\s\S]*?priority\s*\/>\s*<h1>EM Hackathon<\/h1>\s*<ol>/);
  assert.match(pageSource, /Get started by editing <code>app\/page\.tsx<\/code>/);
  assert.match(pageSource, /<li>Save and see your changes instantly\.<\/li>/);
  assert.match(pageSource, /<div className=\{styles\.ctas\}>[\s\S]*?Deploy now[\s\S]*?Read our docs[\s\S]*?<\/div>/);
  assert.match(pageSource, /<Button appName="web" className=\{styles\.secondary\}>\s*Open alert\s*<\/Button>/);
  assert.match(pageSource, /<footer className=\{styles\.footer\}>[\s\S]*?Learn[\s\S]*?Examples[\s\S]*?Go to next\.js →[\s\S]*?<\/footer>/);

  // Preserve the layout, alignment, spacing, and responsive CSS contract.
  assert.match(pageStyles, /\.page\s*\{[\s\S]*?display: grid;[\s\S]*?align-items: center;[\s\S]*?justify-items: center;[\s\S]*?padding: 80px;[\s\S]*?gap: 64px;/);
  assert.match(pageStyles, /\.main\s*\{[\s\S]*?display: flex;[\s\S]*?flex-direction: column;[\s\S]*?gap: 32px;/);
  assert.match(pageStyles, /@media \(max-width: 600px\)[\s\S]*?\.page\s*\{[\s\S]*?padding: 32px;[\s\S]*?\.main\s*\{[\s\S]*?align-items: center;/);
  assert.match(pageStyles, /\.ctas\s*\{[\s\S]*?display: flex;[\s\S]*?gap: 16px;/);
  assert.match(pageStyles, /\.footer\s*\{[\s\S]*?display: flex;[\s\S]*?gap: 24px;/);
});
