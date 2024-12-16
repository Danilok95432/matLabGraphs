import { FC } from "react";
import type { Edge } from "../../types/Edge";
import type { NodeType } from "../../types/Node";
import { Node } from "../Node/Node";

import styles from "./index.module.scss";
import { useActions } from "../../hooks/actions/actions";
import { dijkstra } from "../../heplers/dijkstra";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Switcher } from "../Switcher/Switcher";
import { kruskal } from "../../heplers/kruskal";

type GraphProps = {
  initialNodes: NodeType[];
  initialEdges: Edge[];
};

export const Graph: FC<GraphProps> = ({ initialNodes, initialEdges }) => {
  const { addNode, addEdge, setResult, setResultKraskal, changeDirection } = useActions()
  const result = useSelector((state: RootState) => state.graph.result)
  const resultKruskal = useSelector((state: RootState) => state.graph.resultKruskal)
  const isDirected = useSelector((state: RootState) => state.graph.isDirected)

  const handleAddNodes = () => {
    const title = prompt("Введите название новой вершины:");
    if (title) {
      const newNode: NodeType = {
        id: Date.now().toString(),
        title,
        visited: false,
        positionX: 0,
        positionY: 0,
        distance: 0,
        previousNode: null,
      };
      addNode(newNode);
    }
  }

  const handleAddEdges = () => {
    const source = prompt("Введите имя начальной вершины:");
    const target = prompt("Введите имя конечной вершины:");
    const weightStr = prompt("Введите вес ребра:");

    if (source && target && weightStr) {
      const weight = parseFloat(weightStr);
      if (!isNaN(weight)) {
        const newEdge: Edge = {
          id: Date.now().toString(),
          source,
          target,
          weight,
        };
        addEdge(newEdge);
      } else {
        alert("Вес должен быть числом.");
      }
    }
  }

  const handleFindRoute = () => {
    const start = prompt("Введите имя начальной вершины:");
    const end = prompt("Введите имя конечной вершины:");
    if (start != null && end != null) {
      setResult(dijkstra(initialNodes, initialEdges, start, end, isDirected))
    }
  }

  const handleFindMinOst = () => {
    setResultKraskal(kruskal(initialNodes, initialEdges))
  }

  const handleSwitchChange = (value: boolean) => {
    changeDirection(value)
  }

  return (
    <>
      <div className={styles.graphZone}>
        <div className={styles.rightMenu}>
          <button onClick={handleAddNodes}>Добавить вершину</button>
          <button onClick={handleAddEdges}>Добавить ребро</button>
          <button onClick={handleFindRoute}>Дейкстра</button>
          <button onClick={handleFindMinOst}>Краскал</button>
          <Switcher
            isOn={isDirected}
            onChange={handleSwitchChange}
            disabled={false}
          />
          <div className={styles.resultBlock}>
            <h2>Результаты</h2>
            <div className={styles.distance}>
              <h3>Дистанция кратчайшего пути</h3>
              {result?.distance}
            </div>
            <div className={styles.path}>
              <h3>Путь</h3>
              {result?.path && <span>{result.path.join(" --> ")} </span>}
            </div>
            {
              resultKruskal.edges.length > 0 && (
                <>
                  <div className={styles.distance}>
                    <h3>Минимальный вес остовного дерева</h3>
                    {resultKruskal?.totalWeight}
                  </div>
                </>
              )
            }
          </div>
        </div>
        <div>
          {initialNodes &&
            initialNodes.map((node) => {
              return (
                <Node
                  key={node.id}
                  id={node.id}
                  title={node.title}
                  visited={result.path.includes(node.title)}
                />
              );
            })}
        </div>
        {initialEdges.map((edge) => {
          const sourceNode = initialNodes.find(
            (node) => node.title === edge.source
          );
          const targetNode = initialNodes.find(
            (node) => node.title === edge.target
          );

          if (sourceNode && targetNode) {
            const x1 = sourceNode.positionX;
            const y1 = sourceNode.positionY;
            const x2 = targetNode.positionX;
            const y2 = targetNode.positionY;

            const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

            return (
              <div key={edge.id} style={{ position: "absolute" }}>
                <div
                  style={{
                    position: "absolute",
                    width: length - 10,
                    height: "2px",
                    backgroundColor: `${resultKruskal?.edges.includes(edge) ? "orange" : "black"}`,
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: "0 0",
                    left: x1 + 50,
                    top: y1 + 40,
                    zIndex: 1000,
                  }}
                />
                <div
                  className={styles.weight}
                  style={{
                    position: "absolute",
                    left: (x1 + x2) / 2 + 45,
                    top: (y1 + y2) / 2,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {edge.weight}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
};
