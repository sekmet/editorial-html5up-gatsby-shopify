/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import moment from "moment"
import {
  JSONLD,
  AdministrativeArea,
  Product,
  AggregateRating,
  Review,
  Rating,
  Brand,
  Thing,
  OfferCollection,
  Offer,
  Person,
  Organization,
  ImageObject,
  Article,
  MainEntityOfPage,
  WebPage
} from "@sekmet/react-structured-data"
import { useStaticQuery, graphql } from "gatsby"

export const StructuredData = ({type, data}) => {

  if (type === 'article'){

    if (data && typeof data === 'object')
      return (
        <JSONLD>
          <Article type="Article"
                   headline={data.headline ? `${data.headline.substring(0,109)}` : `${data.description.substring(0,106)}...` }
                   description={data.description ? data.description : "A most wonderful article"}
                   datePublished={data.date ? moment(data.date).format() : moment().format()}
                   dateModified={data.date ? moment(data.date).format() : moment().format()}
                   image={data.images}
          >
            <MainEntityOfPage type="mainEntityOfPage">
              <WebPage id={data.urlpage ? data.urlpage : ""} />
            </MainEntityOfPage>
            <Person type="author" name={data.author ? data.author : "the author"}/>
            <Organization type="publisher" name={data.publisher ? data.publisher : "Google"}>
              <ImageObject type="logo" url={data.publisherlogo ? data.publisherlogo : "https://google.com/logo.jpg"}/>
            </Organization>
          </Article>
        </JSONLD>
      )
    else
      return false
  }

  if (type === 'product'){
    return (
      <JSONLD>
        <Product
          type="Product"
          name="ACME Classic Anvil"
          description="Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height."
          sku="0446310786"
          mpn="925872"
          image={[
            "https://example.com/photos/1x1/photo.jpg",
            "https://example.com/photos/4x3/photo.jpg",
            "https://example.com/photos/16x9/photo.jpg"
          ]}
        >
          <Brand type="brand">
            <Thing name="ACME Corp" />
          </Brand>
          <OfferCollection type="offers">
            <Offer url="https://example.com/anvil"
                   price="119.99"
                   priceCurrency="USD"
                   priceValidUntil="2020-11-06"
                   itemCondition="https://schema.org/UsedCondition"
                   availability="https://schema.org/InStock"
            >
              <Organization type="seller" name="Executive Objects" />
            </Offer>
          </OfferCollection>
          <Review
            type="review"
            name="It's awesome"
            reviewBody="This is Great! My family loves it"
            datePublished="11/22/1963"
          >
            <Person type="author" name="Jerry" />
            <AdministrativeArea type="locationCreated" name="Chicago, IL" />
            <Rating type="reviewRating" ratingValue={5}></Rating>
            <Product type="itemReviewed" name="Product Name" id="product-x" />
          </Review>
          <AggregateRating type="AggregateRating" ratingValue={4.5} reviewCount={33} itemReviewed="ACME Classic Anvil">
          </AggregateRating>
        </Product>
      </JSONLD>
    )
  }

}

function SEO({ description, lang, meta, title }) {
  const { site } = useStaticQuery(
    graphql`
        query {
            site {
                siteMetadata {
                    title
                    description
                    author
                }
            }
        }
    `
  )

  const metaDescription = description || site.siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
