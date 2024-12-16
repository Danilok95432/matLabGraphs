export type NodeType = {
  id: string
  title: string
  visited: boolean
  positionX: number
  positionY: number
  distance?: number | typeof Infinity
  previousNode?: string | null
}