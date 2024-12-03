const inputString = await Bun.file("3/input.txt").text();

// MARK: - Part 1

// a reg exp to match 'mul' (without quotes) followed with open bracket '(', a 1-3 digit number, a comma, another 1-3 digit number and closed bracket ')'. no spaces allowed.
const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;

// Execute multiplications of the matches

// Regex that matches Ints
const intRegex = /\d+/g;

const sumOfMultiplications = (input = inputString) =>
  // Filter inputString by regex
  input.match(regex).reduce((acc, match) => {
    // Get the digits from each match via regex
    const [a, b] = match.match(intRegex).map(Number);
    // Multiply and sum up
    return acc + a * b;
  }, 0);

console.log("Part 1: ", sumOfMultiplications());

// MARK: - Part 2
// This is from claude
function processString(inputString) {
  const doRegex = /do\(\)/g;
  const dontRegex = /don't\(\)/g;

  // Find all occurrences of do() and don't()
  const doMatches = [...inputString.matchAll(doRegex)];
  const dontMatches = [...inputString.matchAll(dontRegex)];

  // If no don't() is found, return the entire string as valid
  if (dontMatches.length === 0) {
    return [inputString];
  }

  const results = [];

  // First, get the text before the first don't()
  results.push(inputString.slice(0, dontMatches[0].index));

  // Track valid segments after each do()
  for (const doMatch of doMatches) {
    // Only consider do() matches after the first don't() and before subsequent don't()
    const nextDontMatch = dontMatches.find(
      (dontMatch) => dontMatch.index > doMatch.index
    );

    if (nextDontMatch) {
      // Extract valid segment from do() to next don't()
      results.push(inputString.slice(doMatch.index, nextDontMatch.index));
    } else {
      // If no subsequent don't(), extract from do() to end
      results.push(inputString.slice(doMatch.index));
    }
  }
  return results;
}

function processString2(inputString) {
    const segments = [];
    let isProcessing = true; // Start by assuming the first segment is valid

    // Split input by `do()` and `don't()` markers
    const parts = inputString.split(/(do\(\)|don't\(\))/);

    for (const part of parts) {
        if (part === "do()") {
            isProcessing = true; // Enable processing
        } else if (part === "don't()") {
            isProcessing = false; // Disable processing
        } else if (isProcessing) {
            segments.push(part); // Add valid segments for processing
        }
    }

    return segments.join(""); // Combine valid segments
}
console.log(
  "Part 2: ",
  sumOfMultiplications(String(processString2(inputString)))
);

// Updated implementation to processString2. Keep old implementation for learning purposes