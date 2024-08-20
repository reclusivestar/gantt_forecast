import React, { useState } from 'react'
import GridLayout from 'react-grid-layout'
import TimelineChart from './TimelineChart'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './GanttChart.css'

const GanttChart = () => {
  const initialSections = [
    {
      label: 'Section 1',
      tasks: [
        { i: 'a', x: 0, y: 0, w: 4, h: 1 },
        { i: 'b', x: 2, y: 1, w: 6, h: 1 },
        // Add tasks for Section 1 as needed
      ],
    },
    {
      label: 'Section 2',
      tasks: [
        { i: 'c', x: 0, y: 0, w: 4, h: 1 },
        { i: 'd', x: 2, y: 1, w: 6, h: 1 },
        // Add tasks for Section 2 as needed
      ],
    },
    // Add more sections as needed
  ]

  const [contractTypes, setContractTypes] = useState({
    a: { type: 'doneDeal', name: 'Netflix' },
    b: { type: 'doneDeal', name: 'Hulu' },
    c: { type: 'doneDeal', name: 'P+' },
    d: { type: 'doneDeal', name: 'Pluto TV' },
  })

  const [newTaskName, setNewTaskName] = useState('')
  const [startDate, setStartDate] = useState(new Date()) // Default start date
  const [increment, setIncrement] = useState('daily')
  const [forecastStart, setForecastStart] = useState(new Date())
  const [forecastEnd, setForecastEnd] = useState(new Date())
  const [sections, setSections] = useState(initialSections)
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0) // Initialize with the first section index
  const [newSectionLabel, setNewSectionLabel] = useState('')
  const [printedContent, setPrintedContent] = useState([]) // State to hold printed content
  const [header, setHeader] = useState('NCIS')
  const [headerInput, setHeaderInput] = useState('')
  const [contractType, setContractType] = useState('doneDeal')
  const [taskIdCounter, setTaskIdCounter] = useState(1)

  const handleAddSection = () => {
    if (newSectionLabel.trim() !== '') {
      const newSection = {
        label: newSectionLabel,
        tasks: [], // Initially, the new section has no tasks
      }
      setSections([...sections, newSection])
      setNewSectionLabel('')
    }
  }

  const handleAddShow = () => {
    setHeader(headerInput)
  }

  const handleRemoveSection = (sectionIndex) => {
    const updatedSections = sections.filter(
      (_, index) => index !== sectionIndex
    )
    setSections(updatedSections)
  }

  // Handler for selecting a section from the dropdown
  const handleSectionSelect = (e) => {
    const index = parseInt(e.target.value, 10) // Get the selected section index
    setSelectedSectionIndex(index)
  }

  const calculateStartDate = (xPosition) => {
    // Calculation of start date based on x-axis position
    return formatDate(calculateIncrement(xPosition))
  }

  const calculateIncrement = (position) => {
    const currentDate = new Date() // Replace with your start date logic
    currentDate.setDate(startDate.getDate())
    if (increment === 'daily') {
      currentDate.setDate(startDate.getDate() + position)
    }
    if (increment === 'monthly') {
      currentDate.setMonth(startDate.getMonth() + position)
    }
    if (increment === 'quarterly') {
      currentDate.setMonth(startDate.getMonth() + 3 * position)
    }
    if (increment === 'yearly') {
      currentDate.setFullYear(startDate.getFullYear() + position)
    }
    return currentDate
  }

  const calculateEndDate = (xPosition, width) => {
    return formatDate(calculateIncrement(xPosition + width - 1))
  }

  function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function convertDateFormat(dateString) {
    const parts = dateString.split('-')
    const year = parts[0]
    const month = parts[1]
    const day = parts[2]
    return `${month}-${day}-${year}`
  }

  const renderTimeline = () => {
    const timelineItems = []
    for (let i = 0; i < 12; i++) {
      timelineItems.push(
        <div key={`timeline-${i}`} className='timeline-item'>
          {convertDateFormat(calculateStartDate(i))}
        </div>
      )
    }
    return timelineItems
  }

  const handleAddTask = () => {
    if (newTaskName.trim() !== '') {
      const newTask = {
        i: taskIdCounter.toString(),
        x: 0,
        y: sections[selectedSectionIndex].tasks.length,
        w: 4,
        h: 1,
      }
      setTaskIdCounter(taskIdCounter + 1)

      const updatedSections = [...sections]
      updatedSections[selectedSectionIndex].tasks.push(newTask)

      setSections(updatedSections)
      setContractTypes((prevGridItemData) => ({
        ...prevGridItemData,
        [newTask.i]: { type: contractType, name: newTaskName },
      }))
      setNewTaskName('')
    }
  }

  function parseDateStringToDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const printTasks = (tasks) => {
    const blocksInRange = tasks.filter((block) => {
      const startDate = parseDateStringToDate(calculateStartDate(block.x))
      const endDate = parseDateStringToDate(calculateEndDate(block.x, block.w))
      endDate.setDate(endDate.getDate() + 1)
      return startDate <= forecastEnd && endDate >= forecastStart
    })

    const printedBlocks = blocksInRange.map((block) => printBlock(block)) // Store printed content

    if (printedBlocks.length > 0) {
      setPrintedContent((prevContent) => [...prevContent, ...printedBlocks]) // Update state with printed content if available
    }
  }

  const handleForecast = () => {
    setPrintedContent([])
    sections.forEach((section) => printTasks(section.tasks))
  }

  const handleTaskRemove = (taskId, sectionIndex) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections]
      const updatedTasks = updatedSections[sectionIndex].tasks.filter(
        (item) => item.i !== taskId
      )
      updatedSections[sectionIndex].tasks = updatedTasks
      return updatedSections
    })

    // Update grid item data by removing the task ID from the map
    setContractTypes((prevGridItemData) => {
      const updatedGridItemData = { ...prevGridItemData }
      delete updatedGridItemData[taskId]
      return updatedGridItemData
    })
  }

  // Function to handle changing the start date
  const handleStartDateChange = (date) => {
    const [year, month, day] = date.split('-').map(Number)
    // Month in JavaScript's Date object is 0-indexed, so subtract 1 from the month
    const newDate = new Date(year, month - 1, day)
    setStartDate(newDate)
  }

  // Function to handle selecting increment options
  const handleIncrementChange = (increment) => {
    setIncrement(increment)
  }

  const handleForecastStart = (date) => {
    const [year, month, day] = date.split('-').map(Number)
    // Month in JavaScript's Date object is 0-indexed, so subtract 1 from the month
    const newDate = new Date(year, month - 1, day)
    setForecastStart(newDate)
  }

  const handleForecastEnd = (date) => {
    const [year, month, day] = date.split('-').map(Number)
    // Month in JavaScript's Date object is 0-indexed, so subtract 1 from the month
    const newDate = new Date(year, month - 1, day)
    // Check if the selected end date is before the start date
    if (newDate < forecastStart) {
      alert('End date cannot be before the start date')
    } else {
      setForecastEnd(newDate)
    }
  }

  const printBlock = (block) => {
    return (
      contractTypes[block.i].name +
      ' |  Start: ' +
      calculateStartDate(block.x) +
      ' | End: ' +
      calculateEndDate(block.x, block.w)
    )
  }

  const handleLayoutChange = (newLayout, sectionIndex) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections]
      updatedSections[sectionIndex].tasks = newLayout
      return updatedSections
    })
  }

  const handleContractType = (e) => {
    setContractType(e.target.value)
  }

  return (
    <div className='gantt-container'>
      <div className='filter-panel-box'>
        <div className='filter-panel'>
          <input
            type='text'
            value={headerInput}
            onChange={(e) => setHeaderInput(e.target.value)}
            placeholder='Pick Show/Network'
            className='task-input'
          />
          <button onClick={handleAddShow} className='add-task-btn'>
            Select
          </button>
        </div>
        <div className='filter-panel'>
          <input
            type='text'
            value={newSectionLabel}
            onChange={(e) => setNewSectionLabel(e.target.value)}
            placeholder='Add Section'
            className='task-input'
          />
          <button onClick={handleAddSection} className='add-task-btn'>
            +
          </button>
          {sections.length > 0 && (
            <div className='add-network-container'>
              <input
                type='text'
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder='Add Contract'
                className='task-input'
              />
              <select
                className='choose-section'
                value={selectedSectionIndex}
                onChange={handleSectionSelect}
              >
                {sections.map((section, index) => (
                  <option key={index} value={index}>
                    {section.label}
                  </option>
                ))}
              </select>
              <select
                className='choose-section contract-type'
                value={contractType}
                onChange={handleContractType}
              >
                <option value='doneDeal'>Done Deal</option>
                <option value='scenario'>Scenario</option>
              </select>
              <button onClick={handleAddTask} className='add-task-btn'>
                +
              </button>
            </div>
          )}

          <div className='date-panel'>
            <div className='date-picker'>
              <label htmlFor='start-date'>Change Timeline Start Date:</label>
              <input
                type='date'
                id='start-date'
                value={formatDate(startDate)}
                onChange={(e) => handleStartDateChange(e.target.value)}
              />
            </div>
            <div className='increment-options'>
              <label htmlFor='increment-select'>Select Increment:</label>
              <select
                id='increment-select'
                onChange={(e) => handleIncrementChange(e.target.value)}
              >
                <option value='daily'>Daily</option>
                <option value='monthly'>Monthly</option>
                <option value='quarterly'>Quarterly</option>
                <option value='yearly'>Yearly</option>
              </select>
            </div>
          </div>
          <div className='date-panel'>
            <div className='date-picker'>
              <label htmlFor='forecast-start'>Start Date:</label>
              <input
                type='date'
                id='forecast-start'
                value={formatDate(forecastStart)}
                onChange={(e) => handleForecastStart(e.target.value)}
              />
            </div>
            <div className='date-picker'>
              <label htmlFor='forecast-end'>End Date:</label>
              <input
                type='date'
                id='forecast-end'
                value={formatDate(forecastEnd)}
                onChange={(e) => handleForecastEnd(e.target.value)}
              />
            </div>
            <button
              onClick={handleForecast}
              className='add-task-btn add-forecast-btn'
            >
              Show Forecast
            </button>
          </div>
        </div>
        {/* Separate box to display printed content */}
        {/* Conditional rendering of printed content box */}
        {printedContent.length > 0 && (
          <div className='printed-content-box'>
            <h3>Output</h3>
            <ul>
              {printedContent.map((content, index) => (
                <li key={index}>{content}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <h2>{header}</h2>
      <div className='gantt-chart-wrapper'>
        <div className='timeline'>{renderTimeline()}</div>
        {sections.map((section, sectionIndex) => (
          <div
            className={`y-axis-section ${
              sectionIndex !== 0 && section.tasks.length ? 'no-margin' : ''
            }`}
            key={sectionIndex}
          >
            <div className='y-axis-label'>{section.label}</div>
            <div className='y-axis-section'>
              <button
                className='delete-section-btn'
                onClick={() => handleRemoveSection(sectionIndex)}
              >
                X
              </button>
              <GridLayout
                className='layout'
                layout={section.tasks}
                cols={12}
                rowHeight={50}
                width={1200}
                onLayoutChange={(newLayout) =>
                  handleLayoutChange(newLayout, sectionIndex)
                }
                isResizable={true}
                resizeHandles={['e']}
                margin={[0, 1]}
              >
                {section.tasks.map((task) => (
                  <div
                    key={task.i}
                    className={`ganttItem ${contractTypes[task.i]?.type}`}
                  >
                    <div className='task-details'>
                      {contractTypes[task.i]?.name}
                      <div className='task-info'>
                        {contractTypes[task.i]?.name}
                        <br />
                        Start: {calculateStartDate(task.x)}
                        <br />
                        End: {calculateEndDate(task.x, task.w)}
                      </div>
                    </div>
                    <div>
                      <button
                        className='delete-btn'
                        onClick={() => handleTaskRemove(task.i, sectionIndex)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </GridLayout>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GanttChart
