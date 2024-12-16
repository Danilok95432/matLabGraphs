import { FC, useState, useEffect } from "react"
import cn from 'classnames'
import styles from './index.module.scss'
import { useActions } from "../../hooks/actions/actions"

type NodeProps = {
  title: string
  className?: string
  visited?: boolean
  id: string
}

export const Node: FC<NodeProps> = ({ title, className, visited, id }) => {
  const [position, setPosition] = useState({x: 0, y: 0})
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({x: 0, y: 0})

  const { changePositionNode, deleteNode } = useActions()

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if(event.button == 1) {
      event.preventDefault()
      deleteNode(title)
    }
    setIsDragging(true)
    setOffset({x: event.clientX - position.x, y: event.clientY - position.y})
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      setPosition({x: event.clientX - offset.x, y: event.clientY - offset.y})
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    changePositionNode({x: position.x, y: position.y, id: id})
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset, position])

  return(
    <div onMouseDown={handleMouseDown} className={cn({[styles._active]: visited === true},className, styles.node)} style={{top: position.y, left: position.x}}>
      {title}
    </div>
  )
}
