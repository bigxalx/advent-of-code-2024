import { transformInputFileToRowsColsAndDiagonals } from "../utils/inputHandler";

const {
  rows: inputRows,
  cols: inputCols,
  diagonalsTopLeftToBottomRight: inputDiagonalsTopLeftToBottomRight,
  diagonalsTopRightToBottomLeft: inputDiagonalsTopRightToBottomLeft,
} = await transformInputFileToRowsColsAndDiagonals("4/input.txt");

// MARK: - Part 1

// Count all the ways XMAS (or SAMX) appears in the rows, cols, diagonals with regex

const countXmasInRowsColsAndDiagonals = (
  rows: string[] = inputRows,
  cols: string[] = inputCols,
  diagonals: string[] = inputDiagonalsTopLeftToBottomRight.concat(
    inputDiagonalsTopRightToBottomLeft
  ),
  regex: RegExp = /(?=(xmas|samx))/gi
) => {
  let count = 0;

  rows.forEach((row) => {
    const matches = row.match(regex);
    if (matches) {
      count += matches.length;
    }
  });

  cols.forEach((col) => {
    const matches = col.match(regex);
    if (matches) {
      count += matches.length;
    }
  });

  diagonals.forEach((diagonal) => {
    const matches = diagonal.match(regex);
    if (matches) {
      count += matches.length;
    }
  });

  return count;
};

console.log("Part 1: ", countXmasInRowsColsAndDiagonals());

// MARK: - Part 2

const countXmases = async (
  inputPath = "4/input.txt",
  regex: RegExp = /(?=(mas|sam))/gi
) => {
  let count = 0;
  const inputString = (await Bun.file(inputPath).text()).toLowerCase();
  const rows = inputString.trim().split("\n");
  const height = rows.length;
  const width = rows[0].length;

  const xMasesContained = (diagonal, r, c) => {
    const [...matches] = diagonal.matchAll(regex);
    if (matches) {
      let count = 0;
      matches.forEach(
        (match) => {
          const { index } = match;
          // We look for the "A" and check if it could possibly be an X-MAS
          // First we get the coordinates of the character
          const charRow = r + index + 1;
          const charCol = c + index + 1;

          // The characters surrounding the A in the other direction must be M and S
          if (
            (rows[charRow - 1][charCol + 1] === "m" &&
              rows[charRow + 1][charCol - 1] === "s") ||
            (rows[charRow - 1][charCol + 1] === "s" &&
              rows[charRow + 1][charCol - 1] === "m")
          ) {
            count += 1;
          }
        }
        // });
      );
      return count;
    }
  };

  // Top-left to bottom-right diagonals (positive slope)
  // Starting from top row
  for (let colStart = 0; colStart < width; colStart++) {
    let diagonal = "";
    let r = 0;
    let c = colStart;
    while (r < height && c < width) {
      diagonal += rows[r][c];
      r++;
      c++;
    }
    if (diagonal.length > 1) {
      count += xMasesContained(diagonal, 0, colStart);
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
      count += xMasesContained(diagonal, rowStart, 0);
    }
  }

  return count;
};

console.log("Part 2: ", await countXmases());
