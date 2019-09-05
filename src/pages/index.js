import React from "react"
//import { Link } from "gatsby"

import Banner from "../components/banner/"
import Features from "../components/features/"
//import Articles from "../components/articles/"
//import ProductGrid from '../components/products'
//import Image from "../components/image"
import SEO from "../components/seo"



const IndexPage = () => (
  <>
    <SEO title="Home" />

    {/* Banner*/}
    <Banner />

    {/* Section*/}
    <Features />

    {/* Section
    <Articles />*/}
  </>
)

export default IndexPage
