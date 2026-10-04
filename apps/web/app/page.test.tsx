import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Homepage', () => {
  it('[AC-1] renders the exact visible main heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'EM Hackathon',
    });

    expect(heading.tagName).toBe('H1');
    expect(heading.textContent).toBe('EM Hackathon');
  });

  it('[AC-2] exposes the exact accessible main heading name', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'EM Hackathon' }),
    ).toBeInTheDocument();
  });

  it('[AC-3] renders the production page component', () => {
    const { container } = render(<Home />);

    expect(container).not.toBeEmptyDOMElement();
  });
});
