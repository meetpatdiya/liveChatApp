import React from 'react'
import { useLocation } from 'react-router-dom'
const NotFound = () => {
    const id = useLocation() 
    console.log(id);
  return (
    <div>
      <h2>Error: 404</h2>
      <h4>The page {id.pathname.slice(1)} is not available</h4>
    </div>
  )
}

export default NotFound
