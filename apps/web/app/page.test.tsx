const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, 'page.tsx'), 'utf8');
const headingMarkup = '<h1>EM Hackathon</h1>';
const headingSourceLine = '        <h1>EM Hackathon</h1>\n';
const styles = new Proxy({}, { get: (_, property) => String(property) });
const Image = ({ priority: _priority, ...props }) =>
  React.createElement('img', props);
const Button = ({ children, className }) =>
  React.createElement('button', { className }, children);

const renderPageSource = (pageSource) => {
  const compiledPage = ts.transpileModule(pageSource, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const pageModule = { exports: {} };
  const requireForPage = (moduleName) => {
    if (moduleName === '@repo/ui/button') return { Button };
    if (moduleName === 'next/image') return Image;
    if (moduleName === './page.module.css') return styles;
    return require(moduleName);
  };

  new Function('require', 'module', 'exports', compiledPage)(
    requireForPage,
    pageModule,
    pageModule.exports,
  );

  return renderToStaticMarkup(React.createElement(pageModule.exports.default));
};

it('[AC-1] renders one visible native h1 with the exact main heading', () => {
  const markup = renderPageSource(source);
  const headings = markup.match(/<h1(?:\s[^>]*)?>.*?<\/h1>/g) ?? [];

  expect(headings).toEqual([headingMarkup]);
});

it('[AC-2] preserves unrelated rendered output and ordering', () => {
  const markup = renderPageSource(source);
  const baselineMarkup = renderPageSource(source.replace(headingSourceLine, ''));
  const linkPositions = [
    'Deploy now',
    'Read our docs',
    'Learn',
    'Examples',
    'Go to nextjs.org →',
  ].map((text) => markup.indexOf(text));

  expect(source.split(headingSourceLine)).toHaveLength(2);
  expect(markup.replace(headingMarkup, '')).toBe(baselineMarkup);
  expect(markup).toContain('Get started by editing <code>app/page.tsx</code>');
  expect(markup).toContain('Save and see your changes instantly.');
  expect(markup).toContain('Open alert');
  expect(linkPositions.every((position) => position >= 0)).toBe(true);
  expect(linkPositions).toEqual([...linkPositions].sort((a, b) => a - b));
});
