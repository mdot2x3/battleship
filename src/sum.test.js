// import jest test function
import { sum } from "./sum.js";

// run sample jest test
test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
