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

export async function transformInputFileToRowsColsAndDiagonals(
  inputPath: string
): Promise<{
  rows: string[];
  cols: string[];
  diagonalsTopLeftToBottomRight: string[];
  diagonalsTopRightToBottomLeft: string[];
}> {
  const inputString = await Bun.file(inputPath).text();

  const rows = inputString.trim().split("\n");
  const cols = rows[0]
    .split("")
    .map((_, colIndex) => rows.map((row) => row[colIndex]).join(""));

  // Generate diagonals
  const diagonalsTopLeftToBottomRight: string[] = [];
  const diagonalsTopRightToBottomLeft: string[] = [];
  const height = rows.length;
  const width = rows[0].length;

  // Top-left to bottom-right diagonals (positive slope)
  // Starting from top row
  for (let colStart = 0; colStart < width; colStart++) {
    let diagonal = "";
    let r = 0;
    let c = colStart;
    while (r < height && c < width) {
      const char = rows[r][c] as String & { possiblyXMAS?: boolean };
      if (char === "a") {
        // Must be at least one character from the edge
        if (r > 0 && r < height - 1 && c > 0 && c < width - 1) {
          // The characters surrounding the A in the other direction must be M and S
          if (
            (rows[r - 1][c + 1] === "m" && rows[r + 1][c - 1] === "s") ||
            (rows[r - 1][c + 1] === "s" && rows[r + 1][c - 1] === "m")
          ) {
            char.possiblyXMAS = true;
          }
        }
      }
      diagonal += char;
      r++;
      c++;
    }
    if (diagonal.length > 1) {
      diagonalsTopLeftToBottomRight.push(diagonal);
    }
  }

  // Starting from leftmost column (excluding top row which we've already covered)
  for (let rowStart = 1; rowStart < height; rowStart++) {
    let diagonal = "";
    let r = rowStart;
    let c = 0;
    while (r < height && c < width) {
      diagonal += rows[r][c];
      r++;
      c++;
    }
    if (diagonal.length > 1) {
      diagonalsTopLeftToBottomRight.push(diagonal);
    }
  }

  // Top-right to bottom-left diagonals (negative slope)
  // Starting from top row
  for (let colStart = 0; colStart < width; colStart++) {
    let diagonal = "";
    let r = 0;
    let c = colStart;
    while (r < height && c >= 0) {
      diagonal += rows[r][c];
      r++;
      c--;
    }
    if (diagonal.length > 1) {
      diagonalsTopRightToBottomLeft.push(diagonal);
    }
  }

  // Starting from rightmost column (excluding top row which we've already covered)
  for (let rowStart = 1; rowStart < height; rowStart++) {
    let diagonal = "";
    let r = rowStart;
    let c = width - 1;
    while (r < height && c >= 0) {
      diagonal += rows[r][c];
      r++;
      c--;
    }
    if (diagonal.length > 1) {
      diagonalsTopRightToBottomLeft.push(diagonal);
    }
  }

  return {
    rows,
    cols,
    diagonalsTopLeftToBottomRight,
    diagonalsTopRightToBottomLeft,
  };
}
