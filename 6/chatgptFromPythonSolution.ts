type Position = { x: number; y: number };
type Direction = { dx: number; dy: number };

const UP: Direction = { dx: -1, dy: 0 };
const DOWN: Direction = { dx: 1, dy: 0 };
const LEFT: Direction = { dx: 0, dy: -1 };
const RIGHT: Direction = { dx: 0, dy: 1 };

const parseInput = async (
  filePath: string
): Promise<{ grid: Map<string, string>; start: Position }> => {
  const inputString = await Bun.file(filePath).text();
  const grid = new Map<string, string>();
  let start: Position | undefined;

  inputString.split("\n").forEach((line, x) => {
    line.split("").forEach((char, y) => {
      grid.set(`${x},${y}`, char);
      if ("^v<>".includes(char)) {
        start = { x, y };
      }
    });
  });

  if (!start) throw new Error("No guard position found in input");
  return { grid, start };
};

const turnRight = (dir: Direction): Direction => {
  if (dir === UP) return RIGHT;
  if (dir === RIGHT) return DOWN;
  if (dir === DOWN) return LEFT;
  if (dir === LEFT) return UP;
  throw new Error("Invalid direction");
};

const walk = (
  grid: Map<string, string>,
  start: Position
): { path: Set<string>; isLoop: boolean } => {
  const path = new Set<string>();
  let dir: Direction = UP; // Start facing up
  let pos = { ...start };
  let seen = new Set<string>();

  const toKey = (p: Position) => `${p.x},${p.y}`;
  const toSeenKey = (p: Position, d: Direction) =>
    `${p.x},${p.y},${d.dx},${d.dy}`;

  while (grid.has(toKey(pos)) && !seen.has(toSeenKey(pos, dir))) {
    seen.add(toSeenKey(pos, dir));
    path.add(toKey(pos));

    const nextPos = { x: pos.x + dir.dx, y: pos.y + dir.dy };
    if (grid.get(toKey(nextPos)) === "#") {
      dir = turnRight(dir); // Turn right if obstacle
    } else {
      pos = nextPos; // Move forward
    }
  }

  const isLoop = seen.has(toSeenKey(pos, dir));
  return { path, isLoop };
};

const computeResults = async (filePath: string) => {
  const { grid, start } = await parseInput(filePath);
  const { path, isLoop } = walk(grid, start);

  const obstacleResults = [...path].reduce((count, key) => {
    const [x, y] = key.split(",").map(Number);
    const testGrid = new Map(grid);
    testGrid.set(key, "#"); // Add obstacle

    if (walk(testGrid, start).isLoop) count += 1;
    return count;
  }, 0);

  console.log(path.size, obstacleResults);
};

// Run the script with the input file
computeResults("6/input.txt");
