import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home page (AC-1, AC-2, AC-4)', () => {
  it('renders a single visible level-1 heading named exactly "EM Hackathon" (AC-1, AC-2, AC-4)', () => {
    render(<Home />);

    // Testing Library-style assertion documenting the requirement.
    expect(
      screen.getByRole('heading', { level: 1, name: 'EM Hackathon' }),
    ).toBeInTheDocument();
  });
});
