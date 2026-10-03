const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function loadPage() {
  const filename = path.join(__dirname, 'page.tsx');
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = babel.transformSync(source, {
    filename,
    presets: [[require.resolve('next/babel'), { 'transform-runtime': false }]],
  }).code;
  const pageModule = { exports: {} };
  const Image = ({ priority: _priority, ...props }) => React.createElement('img', props);
  const Button = ({ children, className }) =>
    React.createElement('button', { className }, children);
  const localRequire = (request) => {
    if (request === '@babel/runtime/helpers/interopRequireDefault') {
      return (value) => (value && value.__esModule ? value : { default: value });
    }
    if (request === 'next/image') return { __esModule: true, default: Image };
    if (request === '@repo/ui/button') return { Button };
    if (request === './page.module.css') {
      return {
        page: 'page',
        main: 'main',
        logo: 'logo',
        ctas: 'ctas',
        primary: 'primary',
        secondary: 'secondary',
        footer: 'footer',
      };
    }
    return require(request);
  };

  new Function('require', 'module', 'exports', compiled)(
    localRequire,
    pageModule,
    pageModule.exports,
  );

  return pageModule.exports.default;
}

const originalPageWithoutHeading =
  '<div class="page"><main class="main"><img class="logo" src="/next.svg" alt="Next.js logo" width="180" height="38"/><ol><li>Get started by editing <code>app/page.tsx</code></li><li>Save and see your changes instantly.</li></ol><div class="ctas"><a class="primary" href="https://vercel.com/new?utm_source=create-next-app&amp;utm_medium=appdir-template&amp;utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer"><img class="logo" src="/vercel.svg" alt="Vercel logomark" width="20" height="20"/>Deploy now</a><a href="https://nextjs.org/docs?utm_source=create-next-app&amp;utm_medium=appdir-template&amp;utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer" class="secondary">Read our docs</a></div><button class="secondary">Open alert</button></main><footer class="footer"><a href="https://nextjs.org/learn?utm_source=create-next-app&amp;utm_medium=appdir-template&amp;utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer"><img aria-hidden="true" src="/file-text.svg" alt="File icon" width="16" height="16"/>Learn</a><a href="https://vercel.com/templates?framework=next.js&amp;utm_source=create-next-app&amp;utm_medium=appdir-template&amp;utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer"><img aria-hidden="true" src="/window.svg" alt="Window icon" width="16" height="16"/>Examples</a><a href="https://nextjs.org?utm_source=create-next-app&amp;utm_medium=appdir-template&amp;utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer"><img aria-hidden="true" src="/globe.svg" alt="Globe icon" width="16" height="16"/>Go to nextjs.org →</a></footer></div>';

function renderPage() {
  const Home = loadPage();
  return renderToStaticMarkup(React.createElement(Home)).replace(
    /<link rel="preload"[^>]*\/?>/g,
    '',
  );
}

describe('Home', () => {
  it('[AC-1] renders one visible native h1 with the exact text EM Hackathon', () => {
    const output = renderPage();
    const headings = output.match(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/g) || [];

    expect(headings).toHaveLength(1);
    expect(headings[0]).toBe('<h1>EM Hackathon</h1>');
  });

  it('[AC-2] preserves all unrelated rendered output unchanged', () => {
    const outputWithoutHeading = renderPage().replace('<h1>EM Hackathon</h1>', '');

    expect(outputWithoutHeading).toBe(originalPageWithoutHeading);
  });
});
