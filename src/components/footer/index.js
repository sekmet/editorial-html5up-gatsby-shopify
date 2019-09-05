import React from "react"
import { StaticQuery, graphql } from "gatsby"

const Footer = () => (
  <StaticQuery
    query={graphql`
      query FooterQuery {
        site {
          siteMetadata {
            title
          }
        }
        allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "footer"}}}) {
          edges {
            node {
              id
              frontmatter {
                siteName
                tagline
                siteUrl
                templateKey
              }
            }
          }
        }
      }
    `}
    render={data => {

      const frontmatter = data.allMarkdownRemark.edges[0].node.frontmatter;

      return (<footer id="footer">
        <p className="copyright">&copy; {new Date().getFullYear()} <a
          href={frontmatter.siteUrl}>{frontmatter.siteName}</a>. {frontmatter.tagline}.<br/> Demo
          Images: <a href="https://unsplash.com">Unsplash</a>.<br/> Design: <a href="https://html5up.net">HTML5 UP</a>.
        </p>
      </footer>)
    }}
  />
)

export default Footer