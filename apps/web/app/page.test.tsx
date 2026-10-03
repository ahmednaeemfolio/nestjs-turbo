/**
 * Home page heading spec (documentation test)
 *
 * NOTE: Per repo constraints, the web app may not have a test runner configured.
 * This file is intended to be deterministic documentation/spec for the DOM
 * contract of `apps/web/app/page.tsx`.
 */

import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('Home page heading contract (documentation spec)', () => {
  describe('AC-1: renders an <h1> with exact text EM Hackathon', () => {
    it('AC-5: asserts a single H1 with exact text', () => {
      const { container } = render(<HomePage />);

      // Role-based assertion: accessible name must match exactly (case/whitespace-sensitive)
      expect(
        screen.getByRole('heading', { level: 1, name: 'EM Hackathon' }),
      ).toBeInTheDocument();

      // DOM count check: ensure exactly one <h1> exists on the page
      expect(container.querySelectorAll('h1')).toHaveLength(1);
    });
  });

  it('AC-2: / remains implemented by apps/web/app/page.tsx (documentation)', () => {
    // Documentation-only invariant:
    // - The home route `/` must remain implemented by `apps/web/app/page.tsx`.
    // - Do not add new route files for `/`.
    expect(typeof HomePage).toBe('function');
  });
});
