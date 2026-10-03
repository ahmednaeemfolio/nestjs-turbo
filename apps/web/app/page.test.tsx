import { render, screen } from '@testing-library/react';

import Home from './page';

describe('Home page (AC-1, AC-2, AC-4)', () => {
  it('renders a visible semantic level-1 heading named exactly “EM Hackathon” (AC-1, AC-2, AC-4)', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'EM Hackathon' }),
    ).toBeInTheDocument();
  });
});
