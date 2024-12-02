import { transformInputFileToLines } from "../utils/inputHandler";

const input = await transformInputFileToLines("2/input.txt");

// MARK: - Part 1

function checkReport(report: number[]): boolean {
  let increasingOrDeacreasing: "Increasing" | "Decreasing" | null = null;
  for (let i = 0; i < report.length - 1; i++) {
    const level = report[i];
    const nextLevel = report[i + 1];

    // Check if the difference between levels is within the acceptable range
    if (Math.abs(nextLevel - level) < 1 || Math.abs(nextLevel - level) > 3) {
      return false;
    }

    // Track the increasing or decreasing trend
    if (nextLevel > level) {
      if (increasingOrDeacreasing === "Decreasing") return false;
      increasingOrDeacreasing = "Increasing";
    } else if (nextLevel < level) {
      if (increasingOrDeacreasing === "Increasing") return false;
      increasingOrDeacreasing = "Decreasing";
    }
  }
  return true;
}

function calculateNumberOfSafeReports(
  input: number[][],
  problemDampener = false
): number {
  let safeReportCount = 0;

  for (const report of input) {
    if (checkReport(report)) {
      safeReportCount++;
    } else if (problemDampener) {
      // Try removing one level to see if the report becomes safe
      for (let i = 0; i < report.length; i++) {
        const reportWithoutLevel = [
          ...report.slice(0, i),
          ...report.slice(i + 1),
        ];
        if (checkReport(reportWithoutLevel)) {
          safeReportCount++;
          break;
        }
      }
    }
  }

  return safeReportCount;
}

console.log(
  "Part 1: How many reports are safe? ",
  calculateNumberOfSafeReports(input)
);

// MARK: - Part 2
console.log(
  "Part 2: How many report are safe with problem dampener: ",
  calculateNumberOfSafeReports(input, true)
);
