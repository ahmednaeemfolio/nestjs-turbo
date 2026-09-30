import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const page = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('./page.module.css', import.meta.url), 'utf8');

test('home page renders the exact event heading without changing its presentation', () => {
  assert.match(page, /<h1>EM Hackathon<\/h1>/);
  assert.equal((page.match(/<h[1-6]\b/g) ?? []).length, 1);
  assert.match(page, /<main className=\{styles\.main\}>[\s\S]*?<h1>EM Hackathon<\/h1>[\s\S]*?<ol>/);

  // Keep the existing page structure, styling hooks, surrounding content, and interactions.
  for (const marker of [
    '<div className={styles.page}>',
    '<Image',
    'className={styles.logo}',
    '<ol>',
    'Get started by editing',
    'Save and see your changes instantly.',
    '<div className={styles.ctas}>',
    'className={styles.primary}',
    'className={styles.secondary}',
    '<Button appName="web" className={styles.secondary}>',
    'Open alert',
    '<footer className={styles.footer}>',
    'Learn',
    'Examples',
    'Go to nextjs.org →',
    'rel="noopener noreferrer"',
  ]) {
    assert.ok(page.includes(marker), `Expected existing page marker: ${marker}`);
  }

  // Existing layout and responsive rules remain the source of truth for presentation.
  for (const marker of [
    'grid-template-rows: 20px 1fr 20px;',
    'align-items: center;',
    'justify-items: center;',
    'padding: 80px;',
    'gap: 64px;',
    '.main {\n  display: flex;\n  flex-direction: column;\n  gap: 32px;',
    '@media (max-width: 600px)',
    'align-items: center;',
    'text-align: center;',
    'flex-direction: column;',
    'flex-wrap: wrap;',
  ]) {
    assert.ok(styles.includes(marker), `Expected existing presentation rule: ${marker}`);
  }
});
