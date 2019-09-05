require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})
const queries = require("./src/components/search/queries")
const siteMetadata = require("./static/admin/site_metadata")
const shopOptions = require('./gatsby-shopifystore')

module.exports = {
  siteMetadata: siteMetadata,
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/static/images//`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/components/`,
        name: `components`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages/`,
        name: `pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/posts/`,
        name: `posts`,
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: "gatsby-theme-blogify",
      options: {
          basePath: "/posts",
          articlePath: false,
          blogTagline: 'My Blogify Articles',
          readmoreBtnlabel: 'Read more',
          siteMetadata: false,
          metaTitleTpl: 'My Gatsby Blogify - Open4G Media',
          metaDescriptionTpl: 'Gatsby is a free and open source framework based on React that helps developers build blazing fast websites and apps',
        },
    },
    `gatsby-plugin-layout`,
    `gatsby-plugin-sass`,
    'gatsby-plugin-catch-links',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-twitter',
    // this (optional) plugin enables Progressive Web App + Offline functionality
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        description: 'Gatsby starter for a blog or store',
        homepage_url: 'https://editorial-html5up-gatsby.netlify.com',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#673ab7',
        display: 'standalone',
        crossOrigin: `use-credentials`,
        icons: [
          {
            src: '/img/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/img/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },
    // To learn more, visit: https://gatsby.dev/offline
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        cacheId: `editorial-theme-offline`
      }
    },
    {
      resolve: "gatsby-theme-shopifystore",
        options: {
            basePath: "/products",
            productPath: "/product",
            shopTagline: "My Gatsby + Shopify Store",
            shopBtnlabel: "Learn more",
            shopCurrency: "USD",
            metaTitleTpl: "Buy %SHOPIFYPRODUCTNAME% - %STORENAME%",
            metaDescriptionTpl: "Specialty store for %SHOPIFYPRODUCTTAG%. Who compares purchase in %STORENAME%. Pay a visit!",
            productOptions: shopOptions,
            verbose: true,
        }
    },
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId:  process.env.GATSBY_ALGOLIA_APP_ID ? process.env.GATSBY_ALGOLIA_APP_ID : process.env.ALGOLIA_APP_ID,
        apiKey: process.env.GATSBY_ALGOLIA_ADMIN_KEY ? process.env.GATSBY_ALGOLIA_ADMIN_KEY : process.env.ALGOLIA_ADMIN_KEY,
        //indexName: process.env.ALGOLIA_INDEX_NAME,
        queries,
        chunkSize: 10000, // default: 1000
      },
    },
    `gatsby-plugin-styled-components`,
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-146806365-1',
      },
    },
    {
      resolve: `@sekmet/gatsby-source-google-analytics-reporting-api`,
      options: {
        email: process.env.GATSBY_GOOGLE_ANALYTICS_REPORT_CLIENT_EMAIL ? process.env.GATSBY_GOOGLE_ANALYTICS_REPORT_CLIENT_EMAIL : process.env.GOOGLE_ANALYTICS_REPORT_CLIENT_EMAIL,
        key: process.env.GATSBY_GOOGLE_ANALYTICS_REPORT_PRIVATE_KEY ? process.env.GATSBY_GOOGLE_ANALYTICS_REPORT_PRIVATE_KEY.replace(/\\n/g, '\n') : process.env.GOOGLE_ANALYTICS_REPORT_PRIVATE_KEY.replace(/\\n/g, '\n'),
        viewId: process.env.GATSBY_GOOGLE_ANALYTICS_REPORT_VIEW_ID ? process.env.GATSBY_GOOGLE_ANALYTICS_REPORT_VIEW_ID : process.env.GOOGLE_ANALYTICS_REPORT_VIEW_ID,
        startDate: `2009-01-01`,
      }
    },
    {
      resolve: "gatsby-plugin-netlify-cms",
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    {
      resolve: 'gatsby-plugin-netlify',
      options: {
        mergeSecurityHeaders: true,
        mergeLinkHeaders: true,
        mergeCachingHeaders: true,
      },
    },
    `gatsby-plugin-netlify-cache`
  ],
}
