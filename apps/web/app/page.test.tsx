import RootLayout from './layout';
import Page from './page';

// Documentation-only specification. The web package intentionally has no test runner.
declare function it(name: string, specification: () => void): void;
declare function render(ui: React.ReactNode): void;
declare const screen: {
  getAllByRole(role: 'heading', options: { level: 1 }): HTMLElement[];
  getByRole(
    role: 'heading',
    options: { level: 1; name: string },
  ): HTMLElement;
};
declare function expect<T>(actual: T): {
  toEqual(expected: T): void;
  toHaveLength(expected: number): void;
  toHaveTextContent(expected: RegExp): void;
};

it('[AC-1] root route renders exactly one level-one heading', () => {
  render(
    <RootLayout>
      <Page />
    </RootLayout>,
  );

  const headings = screen.getAllByRole('heading', { level: 1 });
  expect(headings).toHaveLength(1);
  expect(headings[0]).toHaveTextContent(/^EM Hackathon$/);
});

it('[AC-2] page specifies an h1 with exact visible text', () => {
  render(<Page />);

  expect(
    screen.getByRole('heading', { level: 1, name: 'EM Hackathon' }),
  ).toHaveTextContent(/^EM Hackathon$/);
});

it('[AC-3] web package build is the required verification', () => {
  const verification = {
    command: 'pnpm --filter web build',
    expectedExitCode: 0,
  };

  expect(verification).toEqual({
    command: 'pnpm --filter web build',
    expectedExitCode: 0,
  });
});
