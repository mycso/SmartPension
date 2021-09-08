
import React from 'react'

const PageViewNumbers = ({name, total, text}) => {
  return (
  <li>{`${name} ${total} ${text}`}</li>
  )
}

export default PageViewNumbers