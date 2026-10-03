const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');

const pagePath = path.join(__dirname, 'page.tsx');
const pageSource = fs.readFileSync(pagePath, 'utf8');
const transpiledPage = ts.transpileModule(pageSource, {
  compilerOptions: {
    esModuleInterop: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2019,
  },
}).outputText;

const styles = new Proxy(
  {},
  {
    get: (_target, property) => String(property),
  },
);

const localRequire = (request) => {
  if (request === './page.module.css') {
    return { __esModule: true, default: styles };
  }

  if (request === 'next/image') {
    return {
      __esModule: true,
      default: ({ priority: _priority, ...props }) =>
        React.createElement('img', props),
    };
  }

  if (request === '@repo/ui/button') {
    return {
      Button: ({ appName: _appName, ...props }) =>
        React.createElement('button', props),
    };
  }

  return require(request);
};

const pageModule = { exports: {} };
new Function('require', 'module', 'exports', transpiledPage)(
  localRequire,
  pageModule,
  pageModule.exports,
);
const Home = pageModule.exports.default;

const renderHome = () => renderToStaticMarkup(React.createElement(Home));

describe('Home', () => {
  it('[AC-1] renders EM Hackathon as the root page level-one heading', () => {
    expect(renderHome()).toContain('<h1>EM Hackathon</h1>');
  });

  it('[AC-2] specifies the exact accessible heading name', () => {
    const heading = renderHome().match(/<h1([^>]*)>(.*?)<\/h1>/);

    expect(heading).not.toBeNull();
    expect(heading[1]).toBe('');
    expect(heading[2]).toBe('EM Hackathon');
  });
});
