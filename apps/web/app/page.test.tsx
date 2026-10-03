import { renderToStaticMarkup } from 'react-dom/server';
import Home from './page';

type HeadingQuery = {
  level: number;
  name?: RegExp;
};

function getAllByRole(
  markup: string,
  role: 'heading',
  { level, name }: HeadingQuery,
) {
  const headingPattern = new RegExp(
    `<h${level}(?:\\s[^>]*)?>(.*?)</h${level}>`,
    'gs',
  );
  const headings = Array.from(markup.matchAll(headingPattern), ([, content]) =>
    content.replace(/<[^>]*>/g, ''),
  );

  return name ? headings.filter((heading) => name.test(heading)) : headings;
}

describe('[AC-1] [AC-2] [AC-3] [AC-4] root page specification', () => {
  it('[AC-1] [AC-2] [AC-3] [AC-4] renders one visible level-1 heading named exactly EM Hackathon', () => {
    const page = renderToStaticMarkup(<Home />);

    expect(getAllByRole(page, 'heading', { level: 1 })).toHaveLength(1);
    expect(
      getAllByRole(page, 'heading', {
        level: 1,
        name: /^EM Hackathon$/,
      }),
    ).toEqual(['EM Hackathon']);
  });
});
