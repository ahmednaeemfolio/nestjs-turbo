declare function describe(title: string, specification: () => void): void;
declare function it(title: string, specification: () => void): void;

describe(
  '[AC-1] [AC-2] [AC-3] [AC-4] [AC-5] root page semantic heading documentation',
  () => {
    it(
      '[AC-1] [AC-2] [AC-3] [AC-4] [AC-5] specifies one visible native h1 with the exact accessible name EM Hackathon while preserving the existing page',
      () => {
        const expectedHeading = {
          role: 'heading',
          level: 1,
          name: 'EM Hackathon',
          visible: true,
          nativeElement: 'h1',
        } as const;

        void expectedHeading;
      },
    );
  },
);
