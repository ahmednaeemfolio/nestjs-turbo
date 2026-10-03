/**
 * Home page heading spec (documentation test)
 *
 * Note: Per repo constraints, this file primarily documents the expected DOM/a11y contract.
 * A test runner may or may not execute it in CI, but it should remain deterministic and
 * aligned with `apps/web/app/page.tsx`.
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Page from './page';

describe("AC-2: / remains implemented by apps/web/app/page.tsx (documentation)", () => {
  it('AC-2: renders the default export from apps/web/app/page.tsx', () => {
    // If this import/usage breaks, it is strong evidence the / route implementation moved.
    // (This is documentation + a build-time signal, not a routing integration test.)
    const { container } = render(<Page />);

    expect(container).toBeInstanceOf(HTMLElement);
  });
});

describe('AC-1: renders an <h1> with exact text EM Hackathon', () => {
  it("AC-1: exposes a level-1 heading with accessible name exactly 'EM Hackathon'", () => {
    render(<Page />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'EM Hackathon',
      }),
    ).toBeInTheDocument();
  });
});

describe('AC-5: asserts a single H1 with exact text', () => {
  it('AC-5: asserts a single <h1> exists in the rendered DOM', () => {
    const { container } = render(<Page />);

    expect(container.querySelectorAll('h1')).toHaveLength(1);
  });
});
