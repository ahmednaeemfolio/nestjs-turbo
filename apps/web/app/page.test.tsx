const fs = require('node:fs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');

function loadHomePage() {
  const source = fs.readFileSync(`${__dirname}/page.tsx`, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const pageModule = { exports: {} };
  const styles = new Proxy({}, { get: (_, property) => property });
  const localRequire = (request) => {
    if (request === './page.module.css') {
      return { __esModule: true, default: styles };
    }

    if (request === 'next/image') {
      const MockImage = ({ priority, ...props }) =>
        React.createElement('img', props);
      return { __esModule: true, default: MockImage };
    }

    if (request === '@repo/ui/button') {
      const Button = ({ appName, ...props }) =>
        React.createElement('button', props);
      return { Button };
    }

    return require(request);
  };

  new Function('require', 'module', 'exports', outputText)(
    localRequire,
    pageModule,
    pageModule.exports,
  );

  return pageModule.exports.default;
}

const Home = loadHomePage();

describe('Home', () => {
  it('[AC-1] renders EM Hackathon as the root page level-one heading', () => {
    const markup = renderToStaticMarkup(React.createElement(Home));

    expect(markup).toContain('<h1>EM Hackathon</h1>');
  });

  it('[AC-2] specifies the exact accessible heading name', () => {
    const markup = renderToStaticMarkup(React.createElement(Home));
    const headings = markup.match(/<h1[^>]*>.*?<\/h1>/g);

    expect(headings).toEqual(['<h1>EM Hackathon</h1>']);
    expect(headings[0]).not.toContain('aria-label');
  });
});
