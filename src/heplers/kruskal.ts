import { type Edge } from "../types/Edge";
import { type NodeType } from "../types/Node";
import { type KruskalResult } from "../types/Result";


export const kruskal = (nodes: NodeType[], edges: Edge[]): KruskalResult | null =>{

  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  
  const parent: { [key: string]: string } = {};
  nodes.forEach(node => {
    parent[node.title] = node.title;
  });

  const find = (i: string): string => {
    if (parent[i] === i) return i;
    return parent[i] = find(parent[i]); 
  };

  const union = (i: string, j: string) => {
    const rootI = find(i);
    const rootJ = find(j);
    parent[rootI] = rootJ;
  };

  const mstEdges: Edge[] = [];
  let mstWeight = 0;
  for (const edge of sortedEdges) {
    const rootSource = find(edge.source);
    const rootTarget = find(edge.target);

    if (rootSource !== rootTarget) {
        mstEdges.push(edge);
      mstWeight += edge.weight;
      union(edge.source, edge.target);
    }
  }

  if(mstEdges.length !== nodes.length -1){
      alert("Граф не связный");
      return null;
  }
  return { edges: mstEdges, totalWeight: mstWeight };
}