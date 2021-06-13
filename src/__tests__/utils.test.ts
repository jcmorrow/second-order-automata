import {
  toBinary,
  bitPositionFromPredecessors,
  nextFromPredecessors,
  nextRow,
} from "../utils";

test("toBinary", () => {
  expect(toBinary(1)).toEqual([0, 0, 0, 0, 0, 0, 0, 1]);
  expect(toBinary(8)).toEqual([0, 0, 0, 0, 1, 0, 0, 0]);
  expect(toBinary(255)).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
});

test("bitPositionFromPredecessors", () => {
  expect(bitPositionFromPredecessors([1, 0, 1])).toEqual(2);
});

test("nextFromPredecessors", () => {
  expect(nextFromPredecessors([1, 0, 1], toBinary(30))).toEqual(0);
  expect(nextFromPredecessors([0, 1, 0], toBinary(30))).toEqual(1);
});

test("nextRow", () => {
  expect(nextRow([1, 0, 1], [1, 0, 1], true, 30)).toEqual([1, 0, 1]);
  expect(nextRow([1, 0, 1], [1, 0, 1], false, 30)).toEqual([0, 0, 0]);

  expect(nextRow([0, 0, 0], [1, 1, 1], true, 30)).toEqual([1, 1, 1]);
  expect(nextRow([0, 0, 0], [1, 1, 1], false, 30)).toEqual([0, 0, 0]);
});
