const input = "6/input.txt";

type Position = {
  lineNumber: number;
  colNumber: number;
};
type Guard = Position & { orientation: "up" | "down" | "left" | "right" };
const parseInput = async (
  inputPath = input
): Promise<{
  guard: Guard;
  obstacles: Position[];
  mapSize: { lines: number; cols: number };
}> => {
  const inputString = await Bun.file(inputPath).text();
  let guard: Guard | undefined;
  let obstacles: Position[] = [];
  let mapSize: { lines: number; cols: number } = { lines: 0, cols: 0 };

  const lines = inputString.split("\n");
  mapSize.lines = lines.length;
  lines.forEach((line, lineNumber) => {
    if (lineNumber === 0) {
      mapSize.cols = line.length;
    }
    line.split("").forEach((char, colNumber) => {
      // Find guard
      if (char === "^") {
        guard = { lineNumber, colNumber, orientation: "up" };
      }
      if (char === ">") {
        guard = { lineNumber, colNumber, orientation: "right" };
      }
      if (char === "v") {
        guard = { lineNumber, colNumber, orientation: "down" };
      }
      if (char === "<") {
        guard = { lineNumber, colNumber, orientation: "left" };
      }
      // Find obstacles
      if (char === "#") {
        obstacles.push({ lineNumber, colNumber });
      }
    });
  });
  if (!guard) {
    throw new Error("No guard position found in input");
  }
  return {
    guard,
    obstacles,
    mapSize,
  };
};
const { guard, obstacles, mapSize } = await parseInput();

function turn(currentGuard: Guard): Guard {
  switch (currentGuard.orientation) {
    case "up":
      return { ...currentGuard, orientation: "right" };
    case "right":
      return { ...currentGuard, orientation: "down" };
    case "down":
      return { ...currentGuard, orientation: "left" };
    case "left":
      return { ...currentGuard, orientation: "up" };
  }
}
function inFrontOf(currentGuard: Guard, onlyPosition: true): Position;
function inFrontOf(currentGuard: Guard, onlyPosition?: false): Guard;
function inFrontOf(
  currentGuard: Guard,
  onlyPosition = false
): Guard | Position {
  let inFrontOfGuard;
  switch (currentGuard.orientation) {
    case "up": {
      // Check if there is an obstacle in front

      inFrontOfGuard = {
        lineNumber: currentGuard.lineNumber - 1,
        colNumber: currentGuard.colNumber,
        orientation: currentGuard.orientation,
      };
      break;
    }
    case "right": {
      inFrontOfGuard = {
        lineNumber: currentGuard.lineNumber,
        colNumber: currentGuard.colNumber + 1,
        orientation: currentGuard.orientation,
      };
      break;
    }
    case "down": {
      inFrontOfGuard = {
        lineNumber: currentGuard.lineNumber + 1,
        colNumber: currentGuard.colNumber,
        orientation: currentGuard.orientation,
      };
      break;
    }

    case "left": {
      inFrontOfGuard = {
        lineNumber: currentGuard.lineNumber,
        colNumber: currentGuard.colNumber - 1,
        orientation: currentGuard.orientation,
      };
      break;
    }
  }
  if (onlyPosition) {
    return {
      lineNumber: inFrontOfGuard.lineNumber,
      colNumber: inFrontOfGuard.colNumber,
    };
  }
  return inFrontOfGuard;
}

const letTheGuardWalk = (
  inputGuard = guard,
  inputObstacles = obstacles,
  inpuMapSize = mapSize
): { distinctPositions: number; newObstacles: number } => {
  let currentGuard = inputGuard;
  const positions = new Set<string>();
  const positionsIncludingOrientation = new Set<string>();
  const newObstacles = new Set<string>();
  const obstacleSet = new Set(
    inputObstacles.map((o) =>
      JSON.stringify({ lineNumber: o.lineNumber, colNumber: o.colNumber })
    )
  );

  while (
    currentGuard.lineNumber >= 0 &&
    currentGuard.lineNumber < inpuMapSize.lines &&
    currentGuard.colNumber >= 0 &&
    currentGuard.colNumber < inpuMapSize.cols
  ) {
    positions.add(
      JSON.stringify({
        lineNumber: currentGuard.lineNumber,
        colNumber: currentGuard.colNumber,
      })
    );
    positionsIncludingOrientation.add(JSON.stringify(currentGuard));

    const obstacleInFront = obstacleSet.has(
      JSON.stringify(inFrontOf(currentGuard, true))
    );
    if (!obstacleInFront) {
      currentGuard = inFrontOf(currentGuard);
    } else {
      currentGuard = turn(currentGuard);
    }
  }

  // Walk through again and look for possible new obstacles
  currentGuard = inputGuard;
  while (
    currentGuard.lineNumber >= 0 &&
    currentGuard.lineNumber < inpuMapSize.lines &&
    currentGuard.colNumber >= 0 &&
    currentGuard.colNumber < inpuMapSize.cols
  ) {
    function lookToTheRight(
      currentGuard: Guard,
      inputVisitedPositions?: Set<string>
    ) {
      let lookingRight = turn(currentGuard);
      const visitedPositions = inputVisitedPositions ?? new Set<string>();

      while (
        lookingRight.lineNumber >= 0 &&
        lookingRight.lineNumber < inpuMapSize.lines &&
        lookingRight.colNumber >= 0 &&
        lookingRight.colNumber < inpuMapSize.cols
      ) {
        // Stop if we've already visited this position
        if (visitedPositions.has(JSON.stringify(lookingRight))) {
          break;
        }

        if (positionsIncludingOrientation.has(JSON.stringify(lookingRight))) {
          newObstacles.add(JSON.stringify(inFrontOf(currentGuard, true)));
          break;
        }

        // If there's an obstacle in front
        if (obstacleSet.has(JSON.stringify(inFrontOf(lookingRight, true)))) {
          lookToTheRight(lookingRight, visitedPositions);
        }
        // Move one step forward
        visitedPositions.add(JSON.stringify(lookingRight));
        lookingRight = inFrontOf(lookingRight);
      }
    }
    lookToTheRight(currentGuard);
    const obstacleInFront = obstacleSet.has(
      JSON.stringify(inFrontOf(currentGuard, true))
    );
    if (!obstacleInFront) {
      currentGuard = inFrontOf(currentGuard);
    } else {
      currentGuard = turn(currentGuard);
    }
  }

  return { distinctPositions: positions.size, newObstacles: newObstacles.size };
};
console.log(letTheGuardWalk());
