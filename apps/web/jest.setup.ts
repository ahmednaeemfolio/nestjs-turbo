const styles = new Proxy<Record<string, string>>(
  {},
  {
    get: (_target, property) => String(property),
  },
);

export default styles;

afterEach(() => {
  jest.clearAllMocks();
});
