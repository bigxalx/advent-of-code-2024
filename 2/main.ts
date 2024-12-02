import { transformInputFileToLines } from "../utils/inputHandler";

const input = await transformInputFileToLines("2/input.txt");
const verbose = false;

// MARK: - Part 1

// The input is an array of reports. Each report is an array of levels.

function checkReport(report: number[]): boolean {
  if (verbose) console.log("report: ", report);
  let increasingOrDeacreasing: "Increasing" | "Decreasing" | null;
  let isThisReportSafe = true;
  report.map((level, index) => {
    // If we are at the last level, we are already done
    if (index === report.length - 1) {
      return;
    }
    // If we already have unsafe levels in this report, we don't need to check any further
    if (!isThisReportSafe) return;

    const nextLevel = report[index + 1];
    if (verbose) {
      console.log("level: ", level, " next level: ", nextLevel);
    }

    // First check that levels are either all increasing or all decreasing
    if (nextLevel > level) {
      // Is Increasing. Check if it was not decreasing before.
      if (increasingOrDeacreasing === "Decreasing") {
        // This level is unsafe and should be ignored
        if (verbose) console.log("Was decreasing before. Therefore is UNSAFE");
        isThisReportSafe = false;
      }
      increasingOrDeacreasing = "Increasing";
    }

    if (nextLevel < level) {
      // Is decreasing. Check if it was not increasing before.
      if (increasingOrDeacreasing === "Increasing") {
        // This level is unsafe and should be ignored
        if (verbose) console.log("Was increasing before. Therefore is UNSAFE");
        isThisReportSafe = false;
      }
      increasingOrDeacreasing = "Decreasing";
    }

    // Otherwise check if the difference is at least one and at most three
    if (Math.abs(nextLevel - level) > 3 || Math.abs(nextLevel - level) < 1) {
      // This level is unsafe and should be ignored
      if (verbose)
        console.log(
          "Adjacent levels differ by less than one or more than three"
        );
      isThisReportSafe = false;
    }
  });
  if (verbose) console.log(`Report is ${isThisReportSafe ? "SAFE" : "UNSAFE"}`);
  return isThisReportSafe;
}

function calculateNumberOfSafeReports(
  input: number[][],
  problemDampener = false
): number {
  let numberOfSafeReports = 0;
  input.map((report) => {
    let isThisReportSafe = checkReport(report);
    if (isThisReportSafe) {
      numberOfSafeReports++;
    } else {
      if (problemDampener) {
        if (verbose) console.log("Trying problem dampener");
        // Try removing one level of the report and see if the report ist now safe
        let reportIsNowSafe = false;
        report.map((_, index) => {
          if (reportIsNowSafe) return;
          const reportWithoutLevel = report.filter((_, i) => i !== index);
          if (verbose) console.log("reportWithoutLevel: ", reportWithoutLevel);
          if (checkReport(reportWithoutLevel)) {
            if (verbose) console.log("Report is SAFE after removing level");
            reportIsNowSafe = true;
          }
        });
        if (reportIsNowSafe) {
          numberOfSafeReports++;
        }
      }
    }
  });
  return numberOfSafeReports;
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
