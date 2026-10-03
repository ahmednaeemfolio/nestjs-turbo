import { renderToStaticMarkup } from 'react-dom/server';
import Home from './page';

const hasDom = typeof document !== 'undefined';
const testingLibrary: typeof import('@testing-library/react') | null = hasDom
  ? require('@testing-library/react')
  : null;
const renderMarkup = () => renderToStaticMarkup(Home());

describe('root page verification contract', () => {
  test('[AC-1] [AC-4] exposes exactly one native level-one heading named EM Hackathon', () => {
    if (!testingLibrary) {
      const headings = renderMarkup().match(/<h1>EM Hackathon<\/h1>/g);
      expect(headings).toHaveLength(1);
      return;
    }

    testingLibrary.render(<Home />);
    const heading = testingLibrary.screen.getByRole('heading', {
      level: 1,
      name: 'EM Hackathon',
    });

    expect(heading.tagName).toBe('H1');
    expect(heading).toHaveTextContent(/^EM Hackathon$/);
    expect(testingLibrary.screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  test('[AC-2] preserves the existing root content and its order around the heading', () => {
    if (!testingLibrary) {
      const markup = renderMarkup();
      const orderedContent = [
        'alt="Next.js logo"',
        '<h1>EM Hackathon</h1>',
        'Get started by editing',
        'Deploy now',
        'Read our docs',
        'Open alert',
        'Learn',
        'Examples',
        'Go to nextjs.org →',
      ];
      const positions = orderedContent.map((content) => markup.indexOf(content));

      expect(positions.every((position) => position >= 0)).toBe(true);
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
      return;
    }

    const { container } = testingLibrary.render(<Home />);
    const main = testingLibrary.within(container).getByRole('main');
    const footer = container.querySelector('footer');

    expect(Array.from(main.children, ({ tagName }) => tagName)).toEqual([
      'IMG',
      'H1',
      'OL',
      'DIV',
      'BUTTON',
    ]);
    expect(testingLibrary.within(main).getByAltText('Next.js logo')).toBeInTheDocument();
    expect(testingLibrary.within(main).getAllByRole('listitem')).toHaveLength(2);
    expect(
      testingLibrary.within(main).getByRole('link', { name: /Deploy now/ }),
    ).toBeInTheDocument();
    expect(
      testingLibrary.within(main).getByRole('link', { name: 'Read our docs' }),
    ).toBeInTheDocument();
    expect(
      testingLibrary.within(main).getByRole('button', { name: 'Open alert' }),
    ).toBeInTheDocument();
    expect(footer).not.toBeNull();
    expect(
      testingLibrary
        .within(footer!)
        .getAllByRole('link')
        .map((link) => link.textContent?.trim()),
    ).toEqual(['Learn', 'Examples', 'Go to nextjs.org →']);
  });

  test('[AC-3] keeps the heading change isolated from status UI and existing interactions', () => {
    if (!testingLibrary) {
      const markup = renderMarkup();

      expect(markup).not.toMatch(/role="(?:status|alert|progressbar)"/);
      expect(markup.match(/<a /g)).toHaveLength(5);
      expect(markup).toContain('<button');
      expect(markup).toContain('Open alert</button>');
      return;
    }

    testingLibrary.render(<Home />);
    expect(testingLibrary.screen.queryByRole('status')).not.toBeInTheDocument();
    expect(testingLibrary.screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(testingLibrary.screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(testingLibrary.screen.getByRole('button', { name: 'Open alert' })).toBeEnabled();
    expect(testingLibrary.screen.getAllByRole('link')).toHaveLength(5);
  });

  test('[AC-5] remains synchronously renderable for the production web build', () => {
    expect(Home()).not.toBeInstanceOf(Promise);
  });
});
