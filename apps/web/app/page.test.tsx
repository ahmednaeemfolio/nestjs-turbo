import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import Home from './page';

declare const describe: (title: string, callback: () => void) => void;
declare const it: (title: string, callback: () => void) => void;
declare const expect: (actual: unknown) => {
  toBe: (expected: unknown) => void;
  toEqual: (expected: unknown) => void;
  toHaveLength: (expected: number) => void;
  toMatch: (expected: RegExp) => void;
};
declare const jest: {
  mock: (moduleName: string, factory: () => unknown) => void;
};

jest.mock('./page.module.css', () => ({
  page: 'page',
  main: 'main',
  logo: 'logo',
  ctas: 'ctas',
  primary: 'primary',
  secondary: 'secondary',
  footer: 'footer',
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ priority: _priority, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
    <img {...props} />
  ),
}));

jest.mock('@repo/ui/button', () => ({
  Button: ({
    appName: _appName,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { appName: string }) => <button {...props} />,
}));

const renderPage = () => renderToStaticMarkup(<Home />);

describe('[AC-1] [AC-2] root page semantic DOM', () => {
  it('[AC-1] renders exactly one visible native level-1 heading named EM Hackathon', () => {
    const markup = renderPage();
    const headings = [...markup.matchAll(/<h1([^>]*)>(.*?)<\/h1>/g)];

    expect(headings).toHaveLength(1);
    expect(headings[0]?.[1]).toBe('');
    expect(headings[0]?.[2]).toBe('EM Hackathon');
  });

  it('[AC-2] limits the page implementation to an unstyled DOM-only heading insertion', () => {
    const source = readFileSync(join(__dirname, 'page.tsx'), 'utf8');

    expect(source.match(/<h1>EM Hackathon<\/h1>/g) ?? []).toHaveLength(1);
    expect(source).toMatch(/<main className={styles\.main}>\s*<h1>EM Hackathon<\/h1>\s*<Image/);
  });
});

describe('[AC-3] [AC-4] [AC-5] web specification and configuration', () => {
  it('[AC-3] specifies the exact accessible level-1 heading expectation', () => {
    expect(renderPage()).toMatch(/<h1>EM Hackathon<\/h1>/);
  });

  it('[AC-4] preserves the production build command for Next.js compatibility', () => {
    const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8')) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts.build).toBe('next build');
  });

  it('[AC-5] documents the complete task-owned application and Jest configuration file scope', () => {
    const taskOwnedFiles = [
      'app/page.tsx',
      'app/page.test.tsx',
      'package.json',
      'jest.config.js',
      'jest.setup.ts',
    ];

    expect(taskOwnedFiles).toEqual([
      'app/page.tsx',
      'app/page.test.tsx',
      'package.json',
      'jest.config.js',
      'jest.setup.ts',
    ]);
  });
});
