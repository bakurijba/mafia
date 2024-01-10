type Assert = (condition: unknown, message?: string) => asserts condition;

export const assert: Assert = (condition, message = "Assertion failed") => {
  if (!condition) {
    throw new Error(message);
  }
};
