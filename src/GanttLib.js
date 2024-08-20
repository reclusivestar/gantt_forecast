import React, { useState } from 'react'
import { FrappeGantt } from 'frappe-gantt-react'

const GanttLib = () => {
  let d1 = new Date()
  let d2 = new Date()
  d2.setDate(d2.getDate() + 5)
  let d3 = new Date()
  d3.setDate(d3.getDate() + 8)
  let d4 = new Date()
  d4.setDate(d4.getFullYear() + 1)

  const initialTasks = [
    {
      id: 'Task 1',
      name: 'Task 1',
      start: d1,
      end: d2,
    },
    {
      id: 'Task 2',
      name: 'Task 2',
      start: d3,
      end: d4,
    },
    {
      id: 'Task 3',
      name: 'Redesign website',
      start: new Date(),
      end: d4,
    },
  ]

  const [tasks, setNewTasks] = useState(initialTasks)

  const handleDateChange = (task, start, end) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === task.id) {
        return {
          ...t,
          start: start,
          end: end,
        }
      }
      return t
    })
    setNewTasks(updatedTasks)
  }

  return (
    <div style={{ width: '90vw', margin: '0 auto' }}>
      <FrappeGantt
        tasks={tasks}
        // viewMode={this.state.mode}
        onClick={(task) => console.log(task, 'click')}
        onDateChange={(task, start, end) => console.log(task)}
        onTasksChange={(tasks) => console.log(tasks, 'tasks')}
        viewMode='Month'
      />
    </div>
  )
}

export default GanttLib
