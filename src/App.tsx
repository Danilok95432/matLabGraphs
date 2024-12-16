import { useSelector } from 'react-redux'
import './App.css'
import { Graph } from './components/Graph/Graph'
import { RootState } from './store/store'

export const App = () => {

  const nodes = useSelector((state:RootState) => state.graph.nodes)
  const edges = useSelector((state:RootState) => state.graph.edges)

  return (
    <>
      <Graph initialNodes={nodes} initialEdges={edges} />
    </>
  )
}
