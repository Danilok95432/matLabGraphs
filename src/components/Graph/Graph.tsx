import { FC } from "react";
import type { Edge } from "../../types/Edge";
import type { NodeType } from "../../types/Node";
import { Node } from "../Node/Node";

import { useActions } from "../../hooks/actions/actions";
import { dijkstra } from "../../heplers/dijkstra";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Switcher } from "../Switcher/Switcher";
import { kruskal } from "../../heplers/kruskal";

import styles from "./index.module.scss";

type GraphProps = {
  initialNodes: NodeType[];
  initialEdges: Edge[];
};

export const Graph: FC<GraphProps> = ({ initialNodes, initialEdges }) => {

  const { addNode, addEdge, setResult, setResultKraskal, changeDirection } = useActions()
  const result = useSelector((state: RootState) => state.graph.result)
  const resultKruskal = useSelector((state: RootState) => state.graph.resultKruskal)
  const isDirected = useSelector((state: RootState) => state.graph.isDirected)

  const validateTextPrompt = (promptMessage: string, addingEdge?: boolean) => {
    let input: string | null = null;
    while (true) {
      input = prompt(promptMessage);

      if (!input) {
        alert("Ввод не может быть пустым. Пожалуйста, попробуйте еще раз.");
        continue;
      }

      const isValid = /^[a-zA-Zа-яА-Я]+$/.test(input);
      if (!isValid) {
        alert("Ввод должен содержать только буквы. Пожалуйста, попробуйте еще раз.");
        continue;
      }

      if(initialNodes.filter((node) => node.title === input).length == 0 && addingEdge) {
        alert("Вершина должна быть существующей. Пожалуйста, попробуйте еще раз.");
        continue;
      }

      return input;
    }
  }

  const handleAddNodes = () => {
    const title = validateTextPrompt("Введите название новой вершины:")
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
    const source = validateTextPrompt("Введите имя начальной вершины:", true)
    const target = validateTextPrompt("Введите имя конечной вершины:", true)
    const weightStr = prompt("Введите вес ребра:");

    if (source && target && weightStr) {
      const weight = parseFloat(weightStr);
      if (!isNaN(weight) && weight > 0) {
        const newEdge: Edge = {
          id: Date.now().toString(),
          source,
          target,
          weight,
        };
        addEdge(newEdge);
      } else {
        alert("Вес должен быть неотрицательным числом.");
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

  const handleDirect = (edge: Edge) => {
    if(isDirected){
      return `${edge.weight}( ${edge.source} -> ${edge.target} )`
    }
    else return edge.weight
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
                    width: "90px",
                    left: (x1 + x2) / 2 + 45,
                    top: (y1 + y2) / 2,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {handleDirect(edge)}
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
