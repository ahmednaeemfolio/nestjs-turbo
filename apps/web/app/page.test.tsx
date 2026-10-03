import { renderToStaticMarkup } from 'react-dom/server';

import Home from './page';

test('[AC-1] [AC-2] [AC-3] [AC-4] [AC-5] renders the root page with its exact sole level-1 heading contract', () => {
  const page = renderToStaticMarkup(<Home />);
  const headings = page.match(/<h1(?:\s[^>]*)?>.*?<\/h1>/g);

  expect(headings).toEqual(['<h1>EM Hackathon</h1>']);
});
