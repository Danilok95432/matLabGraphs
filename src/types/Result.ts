import { Edge } from "./Edge"

export type DijkstraResult = {
  distance: number
  path: string[]
}

export type KruskalResult = {
  edges: Edge[],
  totalWeight: number
}