import React from "react"
import { connectSearchBox } from "react-instantsearch-dom"
import { Form, Input } from "./styles"

const CustomSearchBox = ({ currentRefinement, refine, openDisplay, closeDisplay, onKeydownEvent, ...props }) => {
  const handleChange = (e, refine) => {
    refine(e.target.value)
    if (e.target.value !== "" && e.target.value.length > 0) {
      openDisplay()
    } else {
      closeDisplay()
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Prevent propagation.
      e.stopPropagation()
      e.preventDefault()
      //console.log('do validate');
      if (typeof onKeydownEvent === 'function')
      onKeydownEvent()
    }
  }

  return (
    <Form>
      <Input
        id="searchboxid"
        type="text"
        placeholder="Search"
        aria-label="Search"
        value={currentRefinement}
        onChange={e => handleChange(e, refine)}
        onKeyDown={e => handleKeyDown(e, refine)}
        {...props}
      />
    </Form>
  )
}

export default connectSearchBox(CustomSearchBox)

/*<SearchIcon />
export default connectSearchBox(({ refine,...rest }) => (
  <Form>
    <Input
      type="text"
      placeholder="Search"
      aria-label="Search"
      onChange={e => refine(e.target.value) }
      {...rest}
    />
  </Form>

))*/