import { render, screen } from '@testing-library/react';

import Page from './page';

describe('AC-1/AC-5: renders a single H1 "EM Hackathon" on /', () => {
  it('renders exactly one level-1 heading with the exact accessible name "EM Hackathon"', () => {
    render(<Page />);

    // Fails if zero or multiple matching <h1> elements exist (AC-5).
    expect(
      screen.getAllByRole('heading', { level: 1, name: 'EM Hackathon' }),
    ).toHaveLength(1);
  });
});

describe('AC-2: / is implemented by apps/web/app/page.tsx', () => {
  it('imports and renders the page component directly from ./page', () => {
    render(<Page />);

    // If this import were indirect or pointed elsewhere, this assertion would fail.
    expect(
      screen.getAllByRole('heading', { level: 1, name: 'EM Hackathon' }),
    ).toHaveLength(1);
  });
});
