import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import { StaticQuery, graphql } from "gatsby"

const Header = ({ siteMetadata }) => (
  <StaticQuery
    query={graphql`
      query HeaderQuery {
        allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "header"}}}) {
          edges {
            node {
              id
              frontmatter {
                social{
                  label
                  class
                  linkUrl
                }
                templateKey
              }
            }
          }
        }
      }
    `}
    render={data => {

      const social = data.allMarkdownRemark.edges[0].node.frontmatter.social

      return (
        <header id="header">
          <Link
            to="/"
            className="logo"
          >
            <strong>{siteMetadata.title}</strong> {siteMetadata.poweredBy}
          </Link>
          <ul className="icons">
            {social.map((litem, lidx) => {
              return (
                <li key={lidx}><a href={litem.linkUrl} className={litem.class} target="_blank" rel="noopener noreferrer"><span className="label">{litem.label}</span></a></li>
              )})}
          </ul>
        </header>
      )
    }}
  />
)


Header.propTypes = {
  siteMetadata: PropTypes.object,
}

Header.defaultProps = {
  siteMetadata: {},
}

export default Header
