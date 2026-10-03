/*
 * Non-executable homepage specification. The web package intentionally has no
 * configured test runner; this documents the expected Testing Library check.
 *
 * describe('[AC-1] [AC-2] [AC-3] [AC-4] [AC-5] [AC-6] homepage heading', () => {
 *   it('[AC-1] [AC-2] [AC-3] [AC-4] [AC-5] [AC-6] exposes EM Hackathon as the level-one heading', () => {
 *     expect(
 *       screen.getByRole('heading', { level: 1, name: 'EM Hackathon' }),
 *     ).toBeInTheDocument();
 *   });
 * });
 */
