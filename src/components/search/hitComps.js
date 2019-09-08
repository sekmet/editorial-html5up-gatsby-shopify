import React/*, { Fragment }*/ from "react"
import { Highlight, Snippet } from "react-instantsearch-dom"
import { Link } from "gatsby"
import { Calendar } from "styled-icons/octicons/Calendar"
import { Tags } from "styled-icons/fa-solid/Tags"

const shopOptions = require("../../../static/admin/shop_options")

export const ProductHit = clickHandler => ({ hit }) => (
  <div>
    <Link to={`${shopOptions.productPath !== false && shopOptions.productPath !== "false" ? shopOptions.productPath : ''}/` + hit.handle} onClick={clickHandler}>
      <h4>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </h4>
    </Link>
  </div>
)

export const PageHit = clickHandler => ({ hit }) => (
  <div>
    <Link to={hit.path ? hit.path : '/#'} onClick={clickHandler}>
      <h4>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </h4>
    </Link>
    <Snippet attribute="excerpt" hit={hit} tagName="mark" />
  </div>
)

export const PostHit = clickHandler => ({ hit }) => (
  <div>
    <Link to={hit.path ? hit.path : '/#'} onClick={clickHandler}>
      <h4>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </h4>
    </Link>
    <div>
      <Calendar size="1em" />
      &nbsp;
      <Highlight attribute="date" hit={hit} tagName="mark" />
      &emsp;
      <Tags size="1em" />
      &nbsp;
      {/*hit.tags.map((tag, index) => (
        <Fragment key={tag}>
          {index > 0 && `, `}
          {tag}
        </Fragment>
      ))*/}
    </div>
    <Snippet attribute="excerpt" hit={hit} tagName="mark" />
  </div>
)