/* eslint-disable */
import React, { useState/*, useEffect, createRef*/ } from "react"
import {
  Index,
  Hits,
  connectStateResults,
} from "react-instantsearch-dom"

import { HitsWrapper, PoweredBy } from "./styles"

import * as hitComps from "./hitComps"

const Results = connectStateResults(
  ({ searchState: state, searchResults: res, children }) =>
    res && res.nbHits > 0 ? children : `No results for '${state.query}'`
)

const Stats = connectStateResults(
  ({ searchResults: res }) =>
    res && res.nbHits > 0 && `${res.nbHits} result${res.nbHits > 1 ? `s` : ``}`
)


export default function SearchResult({ indices, hitsAsGrid, store }){
  const [query, setQuery ] = useState(``)
  const [focus, setFocus] = useState(false)

    return (
      <section>
        <header className="main">
          <h1>Search Results</h1>
          <hr className="major"/>
        </header>
        <HitsWrapper show={query.length > 0} asGrid={hitsAsGrid}>
          {indices.map(({ name, title, hitComp }) => (
            <Index key={name} indexName={name}>
              <header>
                <h3>{title}</h3>
                <Stats/>
              </header>
              <Results>
                <Hits hitComponent={hitComps[hitComp](() => { setFocus(false); store.setSearchingState(false); } )}/>
              </Results>
            </Index>
          ))}
          <PoweredBy/>
        </HitsWrapper>
      </section>
  )

}
