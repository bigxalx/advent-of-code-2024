async function transformInputFileToLists(
  inputPath: string
): Promise<{ list1: number[]; list2: number[] }> {
  // Read the list from inputPath
  const inputString = await Bun.file(inputPath).text();
  // Split the input string into lines
  const lines = inputString.trim().split("\n");

  // Use map to create two separate lists
  // Finally sort in asc order
  const list1 = lines
    .map((line) => parseInt(line.split(/\s+/)[0], 10))
    .sort((a, b) => a - b);
  const list2 = lines
    .map((line) => parseInt(line.split(/\s+/)[1], 10))
    .sort((a, b) => a - b);

  // Sort and return
  return { list1, list2 };
}

// MARK: - Part 1
const { list1, list2 } = await transformInputFileToLists("input.txt");
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
