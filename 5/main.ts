const samplePath = "5/input.txt";
async function transformInputFileToLines(
  inputPath: string = samplePath
): Promise<{ pageOrderingRules: number[][]; pagesToProduce: number[][] }> {
  // Read the list from inputPath
  const inputString = await Bun.file(inputPath).text();

  // The file contains two parts, split by an empty line.
  const [rawPageOrderingRules, rawPagesToProduce] = inputString
    .trim()
    .split("\n\n");

  // Split the page ordering rules into lines, and then extract the numbers
  const pageOrderingRulesLines = rawPageOrderingRules
    .trim()
    .split("\n")
    .map((line) => line.split("|").map(Number));

  // Split the pages to produce into lines, and then extract the numbers
  const pagesToProduceLines = rawPagesToProduce
    .trim()
    .split("\n")
    .map((line) => line.split(",").map(Number));

  return {
    pageOrderingRules: pageOrderingRulesLines,
    pagesToProduce: pagesToProduceLines,
  };
}

const { pageOrderingRules, pagesToProduce } = await transformInputFileToLines();

function createGraph(dependencies: number[][]): {
  graph: Map<number, Set<number>>;
  inDegree: Map<number, number>;
} {
  const graph = new Map<number, Set<number>>();
  const inDegree = new Map<number, number>();

  for (const [first, second] of dependencies) {
    if (!graph.has(first)) graph.set(first, new Set());
    if (!graph.has(second)) graph.set(second, new Set());

    graph.get(first)!.add(second);

    // Track in-degrees
    inDegree.set(first, inDegree.get(first) || 0);
    inDegree.set(second, (inDegree.get(second) || 0) + 1);
  }

  return { graph, inDegree };
}

function topologicalSort(dependencies: number[][]): number[] {
  const { graph, inDegree } = createGraph(dependencies);

  // Step 1: Find initial nodes with zero in-degree
  const zeroInDegree = Array.from(graph.keys()).filter(
    (node) => (inDegree.get(node) || 0) === 0
  );

  const result: number[] = [];
  const workingInDegree = new Map(inDegree);

  // Step 2: Process nodes with zero in-degree
  while (zeroInDegree.length > 0) {
    const current = zeroInDegree.shift()!;
    result.push(current);

    // Step 3: Process neighbors of current node
    const neighbors = graph.get(current) || new Set();

    for (const neighbor of neighbors) {
      const currentInDegree = workingInDegree.get(neighbor)!;

      // Decrease the in-degree of the neighbor
      workingInDegree.set(neighbor, currentInDegree - 1);

      // If the neighbor's in-degree becomes 0, it's ready to be processed
      if (workingInDegree.get(neighbor) === 0) {
        zeroInDegree.push(neighbor);
      }
    }
  }

  // Step 4: Check for a cycle
  if (result.length !== graph.size) {
    throw new Error(
      "Graph contains a cycle and cannot be topologically sorted"
    );
  }

  return result;
}

// Example usage with your input
const { graph: _graph } = createGraph(pageOrderingRules);

function isOrderValidUsingGraph(
  order: number[],
  graph: Map<number, Set<number>> = _graph
): boolean {
  // Create a position map for fast lookup
  const positionMap = new Map<number, number>();
  order.forEach((page, index) => {
    positionMap.set(page, index);
  });

  // Step through each node in the graph
  for (const [page, neighbors] of graph) {
    for (const neighbor of neighbors) {
      // If the page appears after its dependent neighbor, return false
      if (positionMap.get(page)! > positionMap.get(neighbor)!) {
        return false;
      }
    }
  }

  // If all dependencies are respected, return true
  return true;
}

const addMiddleElements = (pages) =>
  pages.reduce((acc, line) => {
    if (isOrderValidUsingGraph(line)) {
      const middleValue = line[Math.floor(line.length / 2)];
      return acc + middleValue; //
    }
    return acc;
  }, 0);

const part1 = addMiddleElements(pagesToProduce);

console.log("Part 1: ", part1);

const invalidPages = pagesToProduce.filter(
  (line) => !isOrderValidUsingGraph(line)
);

function correctInvalidOrder(
  order: number[],
  graph: Map<number, Set<number>>
): number[] {
  // Build a subgraph for the pages in the current invalid order
  const subgraph = new Map<number, Set<number>>();

  for (const page of order) {
    if (graph.has(page)) {
      const neighbors = [...(graph.get(page) || [])].filter((neighbor) =>
        order.includes(neighbor)
      );

      subgraph.set(page, new Set(neighbors));
    }
  }

  // Perform a topological sort on the subgraph
  const edges = [...subgraph.entries()].flatMap(([from, toSet]) =>
    [...toSet].map((to) => [from, to])
  );

  try {
    const sortedOrder = topologicalSort(edges);

    // Return only the sorted pages present in the current invalid order
    return sortedOrder.filter((page) => order.includes(page));
  } catch (err) {
    console.error("Error sorting subgraph for order:", order);
    console.error("Subgraph edges:", edges);
    throw err;
  }
}
// Correct all invalid pages
const correctedInvalidPages = invalidPages.map((line) =>
  correctInvalidOrder(line, _graph)
);

const part2 = addMiddleElements(correctedInvalidPages);
console.log("Part 2: ", part2);
