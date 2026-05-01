export const withMockDelay = <T>(getData: () => T, delayMs: number): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(getData());
    }, delayMs);
  });
