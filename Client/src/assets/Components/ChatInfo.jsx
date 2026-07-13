import React from 'react'
import UpdateGroup from "./UpdateGroup"
import { useParams } from 'react-router-dom';
const ChatInfo = (props) => {
  console.log("hey");
  console.log(props.data);
  const id = useParams()
  return (
    <>
      <UpdateGroup/>
      <h2>hey bro iam info i don't know that i am</h2>
    </>
  )
}

export default ChatInfo
