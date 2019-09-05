//import { Link } from "gatsby"
import React from "react"
import { StaticQuery, graphql } from "gatsby"

const Contact = () => (
  <StaticQuery
    query={graphql`
      query ContactQuery {
        allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "contact"}}}) {
          edges {
            node {
              id
              frontmatter {
                templateKey
                visible
                title
                tagline
                phone
                address
                email {
                  label
                  linkType
                  linkUrl
                }
              }
            }
          }
        }
      }
    `}
    render={data => {

      const frontmatter = data.allMarkdownRemark.edges[0].node.frontmatter;

      if (!frontmatter.visible)
        return false

      return (
        <section>
          <header className="major">
            <h2>{frontmatter.title}</h2>
          </header>
          <p>{frontmatter.tagline}</p>
          <ul className="contact">
            <li className="icon solid fa-envelope"><a href={frontmatter.email.linkUrl}>{frontmatter.email.label}</a></li>
            <li className="icon solid fa-phone">{frontmatter.phone}</li>
            <li className="icon solid fa-home">{frontmatter.address}</li>
          </ul>
        </section>
      )
    }}
  />
)


export default Contact