import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import Home from './page';

test('home page renders the EM Hackathon heading without changing its presentation structure', () => {
  const markup = renderToStaticMarkup(Home());

  assert.match(markup, /<h1>EM Hackathon<\/h1>/);
  assert.match(markup, /<div class="[^"]+"><main class="[^"]+">/);
  assert.match(markup, /<footer class="[^"]+">/);
  assert.match(markup, /<ol><li>Get started by editing <code>app\/page\.tsx<\/code><\/li><li>Save and see your changes instantly\.<\/li><\/ol>/);
  assert.match(markup, /<img[^>]+alt="Next\.js logo"/);
  assert.match(markup, /href="https:\/\/vercel\.com\/new\?utm_source=create-next-app[^\"]*" target="_blank" rel="noopener noreferrer"/);
  assert.match(markup, /href="https:\/\/nextjs\.org\/docs\?utm_source=create-next-app[^\"]*" target="_blank" rel="noopener noreferrer"/);
  assert.match(markup, /Open alert/);
  assert.match(markup, /Learn/);
  assert.match(markup, /Examples/);
  assert.match(markup, /Go to next\.js →/);
});
