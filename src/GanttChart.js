import React, { useState } from 'react'
import TimelineChart from './TimelineChart'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './GanttChart.css'
import moment from 'moment'

const initialGroups = [
  { id: 0, title: 'Season 1' },
  { id: 1, title: 'Season 2' },
  { id: 2, title: 'Season 3' },
  { id: 3, title: 'Season 4' },
  { id: 4, title: 'Season 5' },
]
const initialItems = [
  {
    id: 1,
    group: 0,
    title: 'P+',
    start: moment('2020-06-06').valueOf(),
    end: moment('2020-06-06').add(10, 'year').valueOf(),
    color: 'black',
    selectedBgColor: 'lightblue',
    bgColor: '#00aad7',
  },
  {
    id: 2,
    group: 1,
    title: 'P+',
    start: moment('2020-06-07').valueOf(),
    end: moment('2020-06-07').add(10, 'year').valueOf(),
    color: 'black',
    selectedBgColor: 'lightblue',
    bgColor: '#00aad7',
  },
  {
    id: 3,
    group: 2,
    title: 'P+',
    start: moment('2020-06-08').valueOf(),
    end: moment('2020-06-08').add(10, 'year').valueOf(),
    color: 'black',
    selectedBgColor: 'lightblue',
    bgColor: '#00aad7',
  },
  {
    id: 4,
    group: 3,
    title: 'P+',
    start: moment('2020-10-27').valueOf(),
    end: moment('2020-10-27').add(10, 'year').valueOf(),
    color: 'black',
    selectedBgColor: 'lightblue',
    bgColor: '#00aad7',
  },
  {
    id: 5,
    group: 4,
    title: 'P+',
    start: moment('2021-04-28').valueOf(),
    end: moment('2021-04-28').add(10, 'year').valueOf(),
    color: 'black',
    selectedBgColor: 'lightblue',
    bgColor: '#00aad7',
  },
  {
    id: 6,
    group: 3,
    title: 'Netflix',
    start: moment('2023-03-31').valueOf(),
    end: moment('2025-03-31').valueOf(),
    color: 'black',
    selectedBgColor: 'lightblue',
    bgColor: '#00aad7',
  },
  {
    id: 7,
    group: 4,
    title: 'Netflix',
    start: moment('2023-03-31').valueOf(),
    end: moment('2025-03-31').valueOf(),
    color: 'black',
    selectedBgColor: 'lightblue',
    bgColor: '#00aad7',
  },
]

const GanttChart = () => {
  const [newItemName, setNewItemName] = useState('')
  const [startDate, setStartDate] = useState(new Date()) // Default start date
  const [forecastStart, setForecastStart] = useState(new Date())
  const [forecastEnd, setForecastEnd] = useState(new Date())
  const [items, setItems] = useState(initialItems)
  const [groups, setGroups] = useState(initialGroups)
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0) // Initialize with the first section index
  const [selectedRemoveGroupIndex, setSelectedRemoveGroupIndex] = useState(0) // Initialize with the first section index
  const [newGroupName, setNewGroupName] = useState('')
  const [printedContent, setPrintedContent] = useState([]) // State to hold printed content
  const [header, setHeader] = useState('Henry Danger')
  const [headerInput, setHeaderInput] = useState('')
  const [contractType, setContractType] = useState('doneDeal')
  const [groupIdCounter, setGroupIdCounter] = useState(initialGroups.length)
  const [itemIdCounter, setItemIdCounter] = useState(initialItems.length + 1)
  const [shows, setShows] = useState([])
  const [uploaded, setUploaded] = useState(false)

  const handleAddGroup = () => {
    if (newGroupName.trim() !== '') {
      const newGroup = {
        id: groupIdCounter,
        title: newGroupName,
      }
      setGroups([...groups, newGroup])
      setGroupIdCounter(groupIdCounter + 1)
      setNewGroupName('')
    }
  }

  const handleAddShow = () => {
    setHeader(headerInput)
    const chosenShow = shows.find((show) =>
      show.showName.toLowerCase().includes(headerInput.toLowerCase())
    )
    if (chosenShow) {
      setGroups(chosenShow.showGroups)
      setItems(chosenShow.showItems)
      setItemIdCounter(chosenShow.showItems.length + 1)
      setGroupIdCounter(chosenShow.showGroups)
    } else {
      setGroups([])
      setItems([])
      setItemIdCounter(1)
      setGroupIdCounter(0)
    }
    setUploaded(true)
  }

  // Handler for selecting a section from the dropdown
  const handleGroupSelect = (e) => {
    const index = parseInt(e.target.value, 10) // Get the selected section index
    setSelectedGroupIndex(index)
  }

  const handleRemoveGroupSelect = (e) => {
    const index = parseInt(e.target.value, 10) // Get the selected section index
    setSelectedRemoveGroupIndex(index)
  }

  const handleAddItem = () => {
    let itemColor = contractType === 'scenario' ? '#ffd400' : '#00aad7'
    if (newItemName.trim() !== '') {
      const newItem = {
        id: itemIdCounter,
        group: groups[selectedGroupIndex] ? groups[selectedGroupIndex].id : 0,
        title: newItemName,
        start: moment().valueOf(),
        end: moment().add(1, 'year').valueOf(),
        color: 'black',
        selectedBgColor: 'lightblue',
        bgColor: itemColor,
      }
      setItemIdCounter(itemIdCounter + 1)
      setItems([...items, newItem])
      setNewItemName('')
    }
  }

  // Function to handle changing the start date
  const handleStartDateChange = (date) => {
    const [year, month, day] = date.split('-').map(Number)
    // Month in JavaScript's Date object is 0-indexed, so subtract 1 from the month
    const newDate = new Date(year, month - 1, day)
    setStartDate(newDate)
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

  const handleContractType = (e) => {
    setContractType(e.target.value)
  }

  function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const printItem = (item) => {
    return (
      item.title +
      ' (' +
      moment(item.start).format('MM/DD/YYYY') +
      ' - ' +
      moment(item.end).format('MM/DD/YYYY') +
      ')'
    )
  }

  const handleShowForecast = (e) => {
    setPrintedContent([])
    const itemsInRange = items.filter(
      (item) => item.start <= forecastEnd && item.end >= forecastStart
    )
    console.log(itemsInRange)
    const printedItems = itemsInRange.map((item) => printItem(item)) // Store printed content

    if (printedItems.length > 0) {
      setPrintedContent((prevContent) => [...prevContent, ...printedItems]) // Update state with printed content if available
    }
  }

  const handleRemoveGroup = (e) => {
    let groupIndex = selectedRemoveGroupIndex
    if (groups.length === 1) {
      groupIndex = 0
    }
    const updatedItems = items.filter(
      (item) => item.group !== groups[groupIndex].id
    )
    const updatedGroups = groups.filter(
      (group) => group.id !== groups[groupIndex].id
    )
    setItems(updatedItems)
    setGroups(updatedGroups)
  }

  // need to handle edge cases/bad files
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        // Handle the JSON content here
        let uploadedShows = parseInputData(JSON.parse(content))
        console.log(uploadedShows)
        setShows(uploadedShows)
        setHeaderInput(uploadedShows[0].showName)
      }
      reader.readAsText(file)
    }
  }

  const parseInputData = (inputData) => {
    let newShows = []
    inputData.data.forEach((data) => {
      let newGroups = []
      let newItems = []
      let itemIndex = 1
      data.licenses.forEach((license, index) => {
        newGroups.push({ id: index, title: license.Group })
        license.existing.forEach((contract) => {
          newItems.push({
            id: itemIndex++,
            group: index,
            title: contract.platform,
            start: moment(contract.license_start_date).valueOf(),
            end: moment(contract.license_end_date).valueOf(),
            color: 'black',
            selectedBgColor: 'lightblue',
            bgColor: '#00aad7',
          })
        })
      })
      newShows.push({
        showName: data.show,
        showGroups: newGroups,
        showItems: newItems,
      })
    })
    return newShows
  }

  return (
    <div className='gantt-container'>
      <div className='filter-panel-box'>
        <div className='filter-panel'>
          <label className='upload-label' htmlFor='upload'>
            Upload File:
          </label>
          <input id='upload' type='file' onChange={handleFileUpload} />
          {shows.length ? (
            <select
              className='choose-section contract-type'
              style={{ marginTop: '-4px' }}
              value={headerInput}
              onChange={(e) => setHeaderInput(e.target.value)}
            >
              {shows.map((show, index) => (
                <option key={index} value={show.showName}>
                  {show.showName}
                </option>
              ))}
            </select>
          ) : (
            ''
          )}
        </div>
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
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder='Add Group'
            className='task-input'
          />
          <button onClick={handleAddGroup} className='add-task-btn'>
            +
          </button>
          {groups.length > 0 && (
            <>
              <div className='add-network-container'>
                <input
                  type='text'
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder='Add Contract'
                  className='task-input'
                />
                <select
                  className='choose-section'
                  value={selectedGroupIndex}
                  onChange={handleGroupSelect}
                >
                  {groups.map((group, index) => (
                    <option key={index} value={index}>
                      {group.title}
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
                <button onClick={handleAddItem} className='add-task-btn'>
                  +
                </button>
              </div>
              <div className='add-network-container'>
                <label htmlFor='remove-group'>Remove Group:</label>
                <select
                  className='choose-section'
                  id='remove-group'
                  value={selectedRemoveGroupIndex}
                  onChange={handleRemoveGroupSelect}
                  style={{ marginLeft: '-1px', width: '30%' }}
                >
                  {groups.map((group, index) => (
                    <option key={index} value={index}>
                      {group.title}
                    </option>
                  ))}
                </select>
                <button onClick={handleRemoveGroup} className='add-task-btn'>
                  X
                </button>
              </div>
            </>
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
          </div>
          <div>
            <div className='date-panel'>
              <div className='date-picker'>
                <label htmlFor='forecast-start'>Forecast Start Date:</label>
                <input
                  type='date'
                  id='forecast-start'
                  value={formatDate(forecastStart)}
                  onChange={(e) => handleForecastStart(e.target.value)}
                />
              </div>
              <div className='date-picker'>
                <label htmlFor='forecast-end'>Forecast End Date:</label>
                <input
                  type='date'
                  id='forecast-end'
                  value={formatDate(forecastEnd)}
                  onChange={(e) => handleForecastEnd(e.target.value)}
                />
              </div>

              <button
                onClick={handleShowForecast}
                className='add-task-btn add-forecast-btn'
              >
                Show Forecast
              </button>
            </div>
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
      <h2 className='header'>{header}</h2>
      {groups.length ? (
        <div className='gantt-chart-wrapper'>
          <TimelineChart
            groups={groups ? groups : initialGroups}
            items={items ? items : initialItems}
            setItems={setItems}
            showSelected={uploaded}
            forecastStart={moment(forecastStart).valueOf()}
            forecastEnd={moment(forecastEnd).valueOf()}
            startDate={moment(startDate).valueOf()}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default GanttChart
