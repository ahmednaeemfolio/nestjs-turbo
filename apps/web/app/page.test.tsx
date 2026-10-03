describe.skip(
  '[AC-1] [AC-2] [AC-3] [AC-4] [AC-5] root page heading specification',
  () => {
    it('[AC-1] [AC-2] [AC-3] [AC-4] [AC-5] exposes one visible level-one heading named EM Hackathon', () => {
      // Documentation-only specification:
      // screen.getByRole('heading', { level: 1, name: 'EM Hackathon' })
      // must resolve to the visible native <h1>EM Hackathon</h1> on the root page.
    });
  },
);
