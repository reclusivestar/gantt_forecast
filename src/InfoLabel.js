import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

const InfoLabel = ({ item, group, time }) => {
  const date = moment(time, 'x')
  const label = group ? group.title : ''
  return (
    <div
      style={{
        position: 'fixed',
        left: '45%',
        bottom: 50,
        background: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: 10,
        fontSize: 20,
        borderRadius: 5,
        zIndex: 85,
      }}
    >
      {`${date.format('LL')}`}
    </div>
  )
}

InfoLabel.propTypes = {
  item: PropTypes.object, // Prop-types for 'item' object
  group: PropTypes.shape({
    title: PropTypes.string, // Prop-types for 'group' object's 'title'
  }),
  time: PropTypes.number.isRequired, // 'time' as a required number (assuming Unix timestamp)
}

export default InfoLabel
