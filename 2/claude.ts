import { transformInputFileToLines } from "../utils/inputHandler";

type LevelDirection = "Increasing" | "Decreasing" | null;

function isLevelSafe(
  current: number,
  next: number,
  direction: LevelDirection
): {
  isValid: boolean;
  newDirection: LevelDirection;
} {
  // Check level difference
  const diff = Math.abs(next - current);
  if (diff < 1 || diff > 3) return { isValid: false, newDirection: direction };

  // Check direction consistency
  if (next > current) {
    if (direction === "Decreasing")
      return { isValid: false, newDirection: direction };
    return { isValid: true, newDirection: "Increasing" };
  }

  if (next < current) {
    if (direction === "Increasing")
      return { isValid: false, newDirection: direction };
    return { isValid: true, newDirection: "Decreasing" };
  }

  return { isValid: true, newDirection: direction };
}

function checkReport(report: number[], allowRemoval: boolean = false): boolean {
  // Try all possible removals if allowRemoval is true
  if (allowRemoval) {
    for (let i = 0; i < report.length; i++) {
      const modifiedReport = report.filter((_, index) => index !== i);
      if (checkReport(modifiedReport, false)) return true;
    }
    return false;
  }

  // Standard report validation
  let direction: LevelDirection = null;
  for (let i = 0; i < report.length - 1; i++) {
    const checkResult = isLevelSafe(report[i], report[i + 1], direction);

    if (!checkResult.isValid) return false;

    direction = checkResult.newDirection;
  }

  return true;
}

async function analyzeReports() {
  const input = await transformInputFileToLines("2/input.txt");
  const parsedInput = input.map((line) => line.map(Number));

  const safeReports = parsedInput.filter((report) => checkReport(report));
  const safeReportsWithDampener = parsedInput.filter((report) =>
    checkReport(report, true)
  );

  console.log("Part 1: How many reports are safe?", safeReports.length);
  console.log(
    "Part 2: How many reports are safe with problem dampener?",
    safeReportsWithDampener.length
  );
}

analyzeReports();
