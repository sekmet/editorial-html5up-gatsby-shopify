import React from "react"
//import { Link } from "gatsby"

import Banner from "../components/banner/"
import Features from "../components/features/"
//import Articles from "../components/articles/"
import Articles from "gatsby-theme-blogify/src/components/articles"
//import ProductGrid from '../components/products'
//import Image from "../components/image"
import SEO from "../components/seo"

const blogOptions = require("../../static/admin/blog_options")

const ConvertKeysToLowerCase = (obj) => {
    var output = {};
    for (var i in obj) {
        if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
            output[i.toLowerCase()] = ConvertKeysToLowerCase(obj[i]);
        }else if(Object.prototype.toString.apply(obj[i]) === '[object Array]'){
            output[i.toLowerCase()]=[];
            output[i.toLowerCase()].push(ConvertKeysToLowerCase(obj[i][0]));
        } else {
            output[i.toLowerCase()] = obj[i];
        }
    }
    return output;
}


const IndexPage = () => (
  <>
    <SEO title="Home" />

    {/* Banner*/}
    <Banner />

    {/* Section*/}
    <Features />

    {/* Section*/}
    <Articles pageContext={ConvertKeysToLowerCase(blogOptions)} />
  </>
)

export default IndexPage
