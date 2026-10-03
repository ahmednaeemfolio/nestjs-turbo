import { renderToStaticMarkup } from 'react-dom/server';
import Home from './page';

const renderPage = () => renderToStaticMarkup(<Home />);
const levelOneHeadings = (html: string) =>
  Array.from(html.matchAll(/<h1(?:\s[^>]*)?>(.*?)<\/h1>/g), (match) => match[1]);

describe('root page heading contract', () => {
  test('[AC-1] renders the exact visible EM Hackathon level-1 heading', () => {
    expect(levelOneHeadings(renderPage())).toContain('EM Hackathon');
  });

  test('[AC-2] preserves the existing root-page content and controls', () => {
    const page = renderPage();

    expect(page).toContain('Save and see your changes instantly.');
    expect(page).toContain('Deploy now');
    expect(page).toContain('Open alert');
  });

  test('[AC-3] exposes the heading with the accessible name EM Hackathon', () => {
    expect(renderPage()).toContain('<h1>EM Hackathon</h1>');
  });

  test('[AC-4] renders the production page component without an error', () => {
    expect(renderPage).not.toThrow();
  });

  test('[AC-5] keeps EM Hackathon as the sole primary heading', () => {
    expect(levelOneHeadings(renderPage())).toEqual(['EM Hackathon']);
  });
});
