declare const afterEach: (callback: () => void) => void;
declare const jest: { restoreAllMocks: () => void };

afterEach(() => {
  jest.restoreAllMocks();
});
