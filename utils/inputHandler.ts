export async function transformInputFileToLists(
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

export async function transformInputFileToLines(
  inputPath: string
): Promise<number[][]> {
  // Read the list from inputPath
  const inputString = await Bun.file(inputPath).text();
  // Split the input string into lines
  const lines = inputString.trim().split("\n");
  // Split the lines to get individual numbers. Return an array of array of numbers.
  return lines.map((line) =>
    line.split(/\s+/).map((number) => parseInt(number))
  );
}