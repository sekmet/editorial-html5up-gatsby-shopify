import React from "react"
import Input from "./input"

const Searchbox = (props) => {

  return (
    <Input openDisplay={() => {
            localStorage.setItem('algolia_searching_status',true);
            props.store.setSearchingState(true)
          }}
           closeDisplay={() => {
             localStorage.setItem('algolia_searching_status',false);
             props.store.setSearchingState(false)
           }}
    />
  )
}

export default Searchbox