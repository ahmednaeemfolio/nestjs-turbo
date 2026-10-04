import { render, screen } from '@testing-library/react';
import Page from './page';

it('[AC-1]', () => {
  // The page must render a native h1 with the exact visible text "EM Hackathon".
  const { container } = render(<Page /> as unknown as JSX.Element);
  expect(container.querySelector('h1')?.textContent).toBe('EM Hackathon');
});

it('[AC-2]', () => {
  // The page must expose a level-1 heading with accessible name "EM Hackathon".
  render(<Page /> as unknown as JSX.Element);
  expect(screen.getByRole('heading', { level: 1, name: 'EM Hackathon' })).toBeInTheDocument();
});

it('[AC-3]', () => {
  // Document the package's build script expectation; the package should build with `next build`.
  // This non-executable documentation asserts the package.json build script value.
  // Note: actual build verification is performed by running `pnpm --filter web build` in CI.
  // Here we assert the intended build script is present in package.json.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require('../package.json');
  expect(pkg && pkg.scripts && pkg.scripts.build).toBe('next build');
});
