import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const page = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('./page.module.css', import.meta.url), 'utf8');

describe('main page regression', () => {
  it('renders the approved copy in a level-one heading', () => {
    assert.match(page, /<h1>EM Hackathon<\/h1>/);
    assert.equal((page.match(/<h1\b/g) ?? []).length, 1);
  });

  it('preserves the surrounding page composition and content', () => {
    for (const content of [
      'Next.js logo',
      'Get started by editing',
      'Save and see your changes instantly.',
      'Deploy now',
      'Read our docs',
      'Open alert',
      'Learn',
      'Examples',
      'Go to nextjs.org →',
    ]) {
      assert.ok(page.includes(content), `Expected page content: ${content}`);
    }

    assert.match(page, /<main className=\{styles\.main\}>[\s\S]*?<\/main>/);
    assert.match(page, /<ol>[\s\S]*?<li>[\s\S]*?<\/li>[\s\S]*?<\/ol>/);
    assert.match(page, /<footer className=\{styles\.footer\}>/);
  });

  it('retains the layout rules at the supported responsive viewport sizes', () => {
    assert.match(styles, /\.page\s*\{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-rows:\s*20px 1fr 20px;[\s\S]*?padding:\s*80px;/);
    assert.match(styles, /\.main\s*\{[\s\S]*?display:\s*flex;[\s\S]*?flex-direction:\s*column;[\s\S]*?gap:\s*32px;/);
    assert.match(styles, /@media\s*\(max-width:\s*600px\)/);
    assert.match(styles, /@media\s*\(max-width:\s*600px\)\s*\{[\s\S]*?\.page\s*\{[\s\S]*?padding:\s*32px;/);
    assert.match(styles, /@media\s*\(max-width:\s*600px\)\s*\{[\s\S]*?\.main\s*\{[\s\S]*?align-items:\s*center;/);

    const breakpoint = Number(styles.match(/@media\s*\(max-width:\s*(\d+)px\)/)?.[1]);
    assert.equal(breakpoint, 600);
    assert.deepEqual(
      [375, 768, 1024, 1440].map((width) => width <= breakpoint),
      [true, false, false, false],
    );
  });

  it('preserves existing links, labels, and the alert button behavior', () => {
    assert.equal((page.match(/<a\b/g) ?? []).length, 5);
    assert.equal((page.match(/<Button\b/g) ?? []).length, 1);
    assert.match(page, /<Button appName="web" className=\{styles\.secondary\}>\s*Open alert\s*<\/Button>/);
    assert.match(page, /target="_blank"\s+rel="noopener noreferrer"/);
  });
});
