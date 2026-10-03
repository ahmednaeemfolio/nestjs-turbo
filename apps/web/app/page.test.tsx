import { render, screen } from '@testing-library/react';

import Page from './page';

describe('Home page (/) — heading spec [AC-1][AC-2][AC-4]', () => {
  it('[AC-4] renders a level-1 heading with accessible name exactly "EM Hackathon"', () => {
    render(<Page />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'EM Hackathon' }),
    ).toBeInTheDocument();
  });
});
