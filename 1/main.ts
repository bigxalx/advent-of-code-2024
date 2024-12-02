import { transformInputFileToLists } from "../utils/inputHandler";

const { list1, list2 } = await transformInputFileToLists("1/input.txt");

// MARK: - Part 1
// Calculate differences for each pair and add them up
const differences = list1.map((value, index) => Math.abs(value - list2[index]));
// Sum up all differences
const totalDifference = differences.reduce((a, b) => a + b, 0);
console.log("Part 1: Total distance: ", totalDifference);

// MARK: - Part 2
const similarityScore = list1
  // Go through each number from list1, see how many times the number occurs in list2 and multiply these
  .map((value) => value * list2.filter((num) => num === value).length)
  // Add it all up
  .reduce((a, b) => a + b, 0);
console.log("Part 2: Similarity Score: ", similarityScore);
