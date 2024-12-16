import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Edge } from "../types/Edge";
import { NodeType } from "../types/Node";
import { DijkstraResult, KruskalResult } from "../types/Result";

type GraphSliceState = {
  nodes: NodeType[]
  edges: Edge[]
  result: DijkstraResult
  resultKruskal: KruskalResult
  isDirected: boolean
};

const initialState: GraphSliceState = {
  nodes: [{ id: "1", title: "A", visited: false, positionX: 0, positionY: 0 }],
  edges: [],
  result: { distance: 0, path: [] },
  resultKruskal: { edges: [], totalWeight: 0 },
  isDirected: false
};

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    changeDirection: (state, action: PayloadAction<boolean>) => {
      state.isDirected = action.payload
    },
    addNode: (state, action: PayloadAction<NodeType>) => {
      state.nodes.push(action.payload);
    },
    deleteNode: (state, action: PayloadAction<string>) => {
      const nodeIdToDelete = action.payload;
      let deleteInd = -1;

      // Поиск индекса удаляемого узла
      state.nodes.forEach((node, index) => {
        if (node.title === nodeIdToDelete) {
          deleteInd = index;
        }
      });

      // Удаление ребер, связанных с удаляемым узлом
      state.edges = state.edges.filter(
        (edge) =>
          edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete
      );

      // Удаление узла, если он был найден
      if (deleteInd !== -1) {
        state.nodes.splice(deleteInd, 1);
      }
    },
    changePositionNode: (
      state,
      action: PayloadAction<{ x: number; y: number; id: string }>
    ) => {
      state.nodes = state.nodes.map((node) => {
        if (node.id === action.payload.id) {
          return {
            ...node,
            positionX: action.payload.x,
            positionY: action.payload.y,
          };
        }
        return node;
      });
    },
    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
    },
    setResult: (state, action: PayloadAction<DijkstraResult | null>) => {
      if (action.payload !== null) {
        state.result.distance = action.payload.distance;
        state.result.path = [...action.payload.path];
      }
    },
    setResultKraskal: (state, action: PayloadAction<KruskalResult | null>) => {
      if(action.payload !== null) {
        state.resultKruskal.edges = [...action.payload.edges]
        state.resultKruskal.totalWeight = action.payload.totalWeight
      }
    }
  },
});

export const graphActions = graphSlice.actions;

export const graphReducer = graphSlice.reducer;
