import { Edge } from "../types/Edge"
import { NodeType } from "../types/Node"
import { DijkstraResult } from "../types/Result"


export const dijkstra = (
  nodes: NodeType[],
  edges: Edge[],
  startNodeTitle: string,
  endNodeTitle: string,
  isDirected: boolean = false
): DijkstraResult | null => {
  const nodeMap = new Map<
    string,
    { distance: number; previousNode: string | null }
  >();
  for (const node of nodes) {
    nodeMap.set(node.title, { distance: Infinity, previousNode: null });
  }

  if (!nodeMap.has(startNodeTitle)) {
    alert("Стартовая вершина не существует");
    return null;
  }
  nodeMap.get(startNodeTitle)!.distance = 0;

  const visited = new Set<string>();

  while (true) {
    let currentNodeTitle: string | null = null;
    let minDistance = Infinity;
    for (const [title, data] of nodeMap) {
      if (!visited.has(title) && data.distance < minDistance) {
        minDistance = data.distance;
        currentNodeTitle = title;
      }
    }
    if (currentNodeTitle === null) {
      break;
    }
    visited.add(currentNodeTitle);
    for (const edge of edges) {
      const isSource = edge.source === currentNodeTitle;
      const isTarget = edge.target === currentNodeTitle;
      if (isSource || (isTarget && !isDirected)) {
        const neighborTitle = isSource ? edge.target : edge.source;
        if (nodeMap.has(neighborTitle)) {
          const alt = nodeMap.get(currentNodeTitle)!.distance + edge.weight;
          if (alt < nodeMap.get(neighborTitle)!.distance) {
            nodeMap.get(neighborTitle)!.distance = alt;
            nodeMap.get(neighborTitle)!.previousNode = currentNodeTitle;
          }
        }
      }
    }
  }
  const path = [];
  let currentNodeTitle: string | null = endNodeTitle;
  while (
    currentNodeTitle !== null &&
    nodeMap.has(currentNodeTitle) &&
    nodeMap.get(currentNodeTitle)!.previousNode !== null
  ) {
    path.unshift(currentNodeTitle);
    currentNodeTitle = nodeMap.get(currentNodeTitle)!.previousNode;
  }

  if (currentNodeTitle === startNodeTitle) {
    path.unshift(startNodeTitle);
  } else {
    alert("Путь не найден");
    return null;
  }

  console.log({
    distance: nodeMap.get(endNodeTitle)?.distance || Infinity,
    path: path,
  })

  return {
    distance: nodeMap.get(endNodeTitle)?.distance || Infinity,
    path: path,
  };
};
