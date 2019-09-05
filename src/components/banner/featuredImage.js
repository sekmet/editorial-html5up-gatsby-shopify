import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

// Note: You can change "images" to whatever you'd like.

const Image = props => (
  <StaticQuery
    query={graphql`
      query {
        images: allFile (filter: {extension: {regex: "/jpg|png|jpeg/"}}){
          edges {
            node {
              relativePath
              name
              childImageSharp {
                fluid(maxWidth: 560, maxHeight: 454) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    `}
    render={data => {
      const image = data.images.edges.find(n => {
        //console.log(`${props.filename}`.split('/')[2])
        //props.filename
        var filename = `${props.filename}`.split('/')[2]
        return n.node.relativePath.includes(filename);
      });
      if (!image) {
        return null;
      }

      //const imageSizes = image.node.childImageSharp.sizes; sizes={imageSizes}
      return <Img fluid={image.node.childImageSharp.fluid} />;
    }}
  />
);

export default Image;