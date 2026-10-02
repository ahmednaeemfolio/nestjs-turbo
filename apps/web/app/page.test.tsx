import { render, screen } from '@testing-library/react';

import Home from './page';

describe('AC-5: page.test.tsx asserts a single <h1> "EM Hackathon"', () => {
  it('AC-1: renders an <h1> with exact text "EM Hackathon"', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'EM Hackathon' }),
    ).toBeInTheDocument();
  });

  it('AC-5: renders exactly one level-1 heading', () => {
    render(<Home />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});
