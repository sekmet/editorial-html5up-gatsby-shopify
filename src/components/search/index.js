/* eslint-disable */
import React, { useState, /*useEffect,*/ createRef } from "react"
import {
  InstantSearch,
  /*Index,
  Hits,
  connectStateResults,*/
} from "react-instantsearch-dom"
import algoliasearch from "algoliasearch/lite"

import { Root/*, HitsWrapper, PoweredBy*/ } from "./styles"


/*const useClickOutside = (ref, handler, events) => {
  if (!events) events = [`mousedown`, `touchstart`]
  const detectClickOutside = event =>
    !ref.current.contains(event.target) && handler()
  useEffect(() => {
    for (const event of events)
      document.addEventListener(event, detectClickOutside)
    return () => {
      for (const event of events)
        document.removeEventListener(event, detectClickOutside)
    }
  })
}*/

export default function Search({ indices, collapse, hitsAsGrid, children }) {
  const ref = createRef()
  const [query, setQuery] = useState(``)
  //const [focus, setFocus] = useState(false)
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID ? process.env.GATSBY_ALGOLIA_APP_ID : process.env.ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY ? process.env.GATSBY_ALGOLIA_SEARCH_KEY : process.env.ALGOLIA_SEARCH_KEY
  )
  //useClickOutside(ref, () => setFocus(false))

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indices[0].name}
      onSearchStateChange={({ query }) => setQuery(query)}
      root={{ Root, props: { ref } }}
    >
      {children}
    </InstantSearch>
  )
}