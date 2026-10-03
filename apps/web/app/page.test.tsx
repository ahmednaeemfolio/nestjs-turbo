import { renderToStaticMarkup } from 'react-dom/server';
import Home from './page';

describe('[AC-1] [AC-2] [AC-3] [AC-4] [AC-5] root page heading contract', () => {
  it('[AC-1] [AC-3] renders one level-1 heading named EM Hackathon', () => {
    const page = renderToStaticMarkup(<Home />);
    const levelOneHeadings = page.match(/<h1(?:\s[^>]*)?>.*?<\/h1>/g);

    expect(levelOneHeadings).toEqual(['<h1>EM Hackathon</h1>']);
  });
});
