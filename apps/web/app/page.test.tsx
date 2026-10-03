const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');

function createPageHarness() {
  const source = fs.readFileSync(path.join(__dirname, 'page.tsx'), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const pageModule = { exports: {} };
  const styles = {
    ctas: 'ctas',
    footer: 'footer',
    logo: 'logo',
    main: 'main',
    page: 'page',
    primary: 'primary',
    secondary: 'secondary',
  };
  const Image = ({ priority, ...props }) => React.createElement('img', props);
  const Button = ({ appName, children, ...props }) =>
    React.createElement(
      'button',
      {
        ...props,
        onClick: () => globalThis.alert(`Hello from your ${appName} app!`),
      },
      children,
    );
  const localRequire = (request) => {
    if (request === '@repo/ui/button') return { Button };
    if (request === 'next/image') return { __esModule: true, default: Image };
    if (request === './page.module.css') return styles;
    return require(request);
  };

  Function('require', 'module', 'exports', compiled)(
    localRequire,
    pageModule,
    pageModule.exports,
  );

  return { Button, Home: pageModule.exports.default };
}

const { Button, Home } = createPageHarness();

it('[AC-1] renders one visible native h1 with the exact text EM Hackathon', () => {
  const markup = renderToStaticMarkup(React.createElement(Home));
  const headings = markup.match(/<h1(?:\s[^>]*)?>.*?<\/h1>/g) ?? [];

  expect(headings).toHaveLength(1);
  expect(headings[0]).toBe('<h1>EM Hackathon</h1>');
});

it('[AC-2] preserves all unrelated rendered output and interaction behavior', () => {
  const markup = renderToStaticMarkup(React.createElement(Home));
  const unrelatedMarkup = markup.replace('<h1>EM Hackathon</h1>', '');
  const expectedUnrelatedMarkup =
    '<link rel="preload" as="image" href="/next.svg"/><link rel="preload" as="image" href="/vercel.svg"/><link rel="preload" as="image" href="/file-text.svg"/><link rel="preload" as="image" href="/window.svg"/><link rel="preload" as="image" href="/globe.svg"/><div class="page"><main class="main"><img class="logo" src="/next.svg" alt="Next.js logo" width="180" height="38"/><ol><li>Get started by editing <code>app/page.tsx</code></li><li>Save and see your changes instantly.</li></ol><div class="ctas"><a class="primary" href="https://vercel.com/new?utm_source=create-next-app&amp;utm_medium=appdir-template&amp;utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer"><img class="logo" src="/vercel.svg" alt="Vercel logomark" width="20" height="20"/>Deploy now</a><a href="https://nextjs.org/docs?utm_source=create-next-app&amp;utm_medium=appdir-template&amp;utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer" class="secondary">Read our docs</a></div><button class="secondary">Open alert</button></main><footer class="footer"><a href="https://nextjs.org/learn?utm_source=create-next-app&amp;utm_medium=appdir-template&amp;utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer"><img aria-hidden="true" src="/file-text.svg" alt="File icon" width="16" height="16"/>Learn</a><a href="https://vercel.com/templates?framework=next.js&amp;utm_source=create-next-app&amp;utm_medium=appdir-template&amp;utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer"><img aria-hidden="true" src="/window.svg" alt="Window icon" width="16" height="16"/>Examples</a><a href="https://nextjs.org?utm_source=create-next-app&amp;utm_medium=appdir-template&amp;utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer"><img aria-hidden="true" src="/globe.svg" alt="Globe icon" width="16" height="16"/>Go to nextjs.org →</a></footer></div>';

  expect(unrelatedMarkup).toBe(expectedUnrelatedMarkup);

  const alert = jest.fn();
  globalThis.alert = alert;
  const button = Button({
    appName: 'web',
    children: 'Open alert',
    className: 'secondary',
  });
  button.props.onClick();
  expect(alert).toHaveBeenCalledTimes(1);
  expect(alert).toHaveBeenCalledWith('Hello from your web app!');
});
