import React, { useState, useEffect } from 'react'
import moment from 'moment'
import Timeline, {
  TodayMarker,
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
  TimelineMarkers,
  CustomMarker,
} from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import InfoLabel from './InfoLabel'
import PropTypes from 'prop-types'

const keys = {
  groupIdKey: 'id',
  groupTitleKey: 'title',
  groupRightTitleKey: 'rightTitle',
  itemIdKey: 'id',
  itemTitleKey: 'title',
  itemDivTitleKey: 'title',
  itemGroupKey: 'group',
  itemTimeStartKey: 'start',
  itemTimeEndKey: 'end',
  groupLabelKey: 'title',
}

const TimelineChart = ({
  groups,
  items,
  setItems,
  showSelected,
  forecastStart,
  forecastEnd,
  startDate,
}) => {
  const [defaultTimeStart, setDefaultTimeStart] = useState(
    moment().startOf('day').toDate()
  )
  const [defaultTimeEnd, setDefaultTimeEnd] = useState(
    moment().startOf('day').add(1, 'year').toDate()
  )
  const [draggedItem, setDraggedItem] = useState(null)
  const [timelineKey, setTimelineKey] = useState(0)

  useEffect(() => {
    // Do something in the child component when the state prop changes
    setDefaultTimeStart(moment(startDate))
    setDefaultTimeEnd(moment(startDate).add(9, 'year'))
    setTimelineKey((prevKey) => prevKey + 1)
  }, [startDate])

  useEffect(() => {
    setTimelineKey((prevKey) => prevKey + 1)
  }, [showSelected])

  const handleZoomOut = (timelineContext) => {
    const currentVisibleTimeStart = moment(timelineContext.visibleTimeStart)
    const currentVisibleTimeEnd = moment(timelineContext.visibleTimeEnd)
    if (currentVisibleTimeEnd.diff(currentVisibleTimeStart, 'months') === 11) {
      // If the current visible time range is 1 year, zoom out to 5 years
      const newVisibleTimeStart = currentVisibleTimeStart
        .subtract(4, 'years')
        .toDate()
      const newVisibleTimeEnd = currentVisibleTimeEnd.add(4, 'years').toDate()

      setDefaultTimeStart(newVisibleTimeStart)
      setDefaultTimeEnd(newVisibleTimeEnd)
      setTimelineKey((prevKey) => prevKey + 1)
    }
  }

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            start: dragTime,
            end: dragTime + (item.end - item.start),
            group: groups[newGroupOrder].id,
          }
        : item
    )

    setItems(updatedItems)
    setDraggedItem(null)
    console.log('Moved', itemId, dragTime, newGroupOrder)
  }

  const printItemDetails = () => {
    items.forEach((item) => {
      console.log(`Item ID: ${item.id}`)
      console.log(`Group ID: ${item.group}`)
      console.log(`Title: ${item.title}`)
      console.log(`Start Time: ${moment(item.start).format('MM/DD/YYYY')}`) // Convert start time
      console.log(`End Time: ${moment(item.end).format('MM/DD/YYYY')}`) // Convert end time
      // Add more details as needed
      console.log('-------------------')
    })
  }

  const handleItemResize = (itemId, time, edge) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            start: edge === 'left' ? time : item.start,
            end: edge === 'left' ? item.end : time,
          }
        : item
    )

    setItems(updatedItems)
    setDraggedItem(null)
    console.log('Resized', itemId, time, edge)
  }

  const handleItemDrag = ({ eventType, itemId, time, edge, newGroupOrder }) => {
    let item = draggedItem ? draggedItem.item : null
    if (!item) {
      item = items.find((i) => i.id === itemId)
    }
    setDraggedItem({
      item: item,
      group: groups[newGroupOrder],
      time,
    })
  }

  const handleItemClick = (itemId) => {
    // Find the item using the itemId and show its details
    const clickedItem = items.find((item) => item.id === itemId)
    console.log('Clicked Item Details:', clickedItem)
    // Update state or perform actions to display the details
  }

  const handleRemoveItem = (idToRemove) => {
    const updatedItems = items.filter((item) => item.id !== idToRemove)
    setItems(updatedItems)
  }

  const itemRenderer = ({
    item,
    timelineContext,
    itemContext,
    getItemProps,
    getResizeProps,
  }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
    const backgroundColor = itemContext.selected
      ? item.selectedBgColor
      : item.bgColor
    const borderColor = item.color
    return (
      <div
        {...getItemProps({
          style: {
            backgroundColor,
            color: item.color,
            borderColor,
            borderStyle: 'solid',
            borderWidth: 1,
            borderRadius: 4,
            borderLeftWidth: itemContext.selected ? 3 : 1,
            borderRightWidth: itemContext.selected ? 3 : 1,
          },
          onMouseDown: () => {
            console.log('on item click', item)
          },
        })}
        title={
          item.title +
          '\n' +
          moment(item.start).format('YYYY-MM-DD') +
          ' to ' +
          moment(item.end).format('YYYY-MM-DD')
        }
      >
        <div {...leftResizeProps}>
          <div className='delete-btn' onClick={() => handleRemoveItem(item.id)}>
            X
          </div>
        </div>
        <div
          style={{
            height: itemContext.dimensions.height,
            overflow: 'hidden',
            paddingLeft: 3,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '14px',
            fontFamily: 'Times New Roman',
          }}
        >
          {itemContext.title}
        </div>
        <div {...rightResizeProps} />
      </div>
    )
  }

  return (
    <div>
      <Timeline
        key={timelineKey}
        groups={groups}
        items={items}
        keys={keys}
        fullUpdate
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.75}
        canMove={true}
        canResize={'both'}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        onZoom={handleZoomOut}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        onItemDrag={handleItemDrag}
        onItemClick={(itemId) => handleItemClick(itemId)}
        itemRenderer={itemRenderer}
      >
        <TimelineHeaders style={{ background: '#0064ff' }}>
          <SidebarHeader>
            {({ getRootProps }) => {
              return <div {...getRootProps()}></div>
            }}
          </SidebarHeader>
          <DateHeader unit='primaryHeader' />
          <DateHeader />
        </TimelineHeaders>
        <TimelineMarkers>
          <TodayMarker>
            {({ styles }) => (
              <div style={{ ...styles, backgroundColor: 'lightBlue' }} />
            )}
          </TodayMarker>
          {forecastStart ? (
            <CustomMarker key={'forecastStart'} date={forecastStart}>
              {({ styles }) => (
                <div style={{ ...styles, backgroundColor: 'green' }} />
              )}
            </CustomMarker>
          ) : (
            ''
          )}
          {forecastEnd ? (
            <CustomMarker key={'forecastEnd'} date={forecastEnd}>
              {({ styles }) => (
                <div style={{ ...styles, backgroundColor: 'green' }} />
              )}
            </CustomMarker>
          ) : (
            ''
          )}
        </TimelineMarkers>
      </Timeline>
      {draggedItem && (
        <InfoLabel
          item={draggedItem.item}
          group={draggedItem.group}
          time={draggedItem.time}
        />
      )}
    </div>
  )
}

TimelineChart.propTypes = {
  groups: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  setItems: PropTypes.func.isRequired,
  showSelected: PropTypes.bool.isRequired,
  forecastStart: PropTypes.number,
  forecastEnd: PropTypes.number,
  startDate: PropTypes.number,
}

export default TimelineChart
