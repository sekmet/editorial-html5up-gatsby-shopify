import { Link } from "gatsby"
import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Img from 'gatsby-image';

const Latest = () => (
  <StaticQuery
    query={graphql`
      query LatestQuery {
        allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "latest"}}}) {
          edges {
            node {
              id
              frontmatter {
                templateKey
                visible
                title
                datasource
                items {
                  tagline
                  class
                  linkUrl
                  image {
                    src {
                    childImageSharp {
                      fluid(maxWidth: 288, maxHeight: 174) {
                        ...GatsbyImageSharpFluid
                      }
                    }
                  }
                    alt
                  }
                }
                 action {
                  class
                  label
                  linkUrl
                }
              }
            }
          }
        }
      }
    `}
    render={data => {

      const latest = data.allMarkdownRemark.edges[0].node.frontmatter

      if (!latest.visible)
        return false

      return (
        <section>
          <header className="major">
            <h2>{latest.title}</h2>
          </header>
          <div className="mini-posts">
            {latest.items.map((litem, lidx) => {
              return (
                <article key={lidx}>
                  <Link to={litem.linkUrl} className={litem.class}>
                    {litem.image ?
                      <Img fluid={litem.image.src.childImageSharp.fluid} />
                      : <img src="/images//pic01.jpg" alt="Gatsby in Space" />}
                  </Link>
                  <p>{litem.tagline}</p>
                </article>
              )})}
          </div>
          {latest.action ?
            <ul className="actions">
              <li><Link to={latest.action.linkUrl} className={latest.action.class}>{latest.action.label}</Link></li>
            </ul> : ''}
        </section>
      )
    }}
  />
)

export default Latest
