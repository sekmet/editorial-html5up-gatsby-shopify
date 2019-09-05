/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import StoreContext, { defaultStoreContext } from '../context/StoreContext'

import Legacy from "../components/common/legacy"
import "scss/main.scss"

import Header from "../components/header/index"
import Sidebar from "../components/sidebar/index"

import Search from "../components/search"
import SearchResult from "../components/search/result"
const searchIndices = [
  { name: `Products`, title: `Products`, hitComp: `ProductHit` },
  { name: `Pages`, title: `Pages`, hitComp: `PageHit` },
  { name: `Posts`, title: `Blog Posts`, hitComp: `PostHit` },
]

class Layout extends React.Component {
  state = {
    store: {
      ...defaultStoreContext,
      setSearchingState: (status) => {
        this.setState(state => ({
          store: {
            ...state.store,
            searching: status,
          },
        }))
      },
      addVariantToCart: (variantId, quantity) => {
        if (variantId === '' || !quantity) {
          console.error('Both a size and quantity are required.')
          return
        }

        this.setState(state => ({
          store: {
            ...state.store,
            adding: true,
          },
        }))

        const { checkout, client } = this.state.store
        const checkoutId = checkout.id
        const lineItemsToUpdate = [
          { variantId, quantity: parseInt(quantity, 10) },
        ]

        return client.checkout
          .addLineItems(checkoutId, lineItemsToUpdate)
          .then(checkout => {
            this.setState(state => ({
              store: {
                ...state.store,
                checkout,
                adding: false,
              },
            }))
          })
      },
      removeLineItem: (client, checkoutID, lineItemID) => {
        return client.checkout
          .removeLineItems(checkoutID, [lineItemID])
          .then(res => {
            this.setState(state => ({
              store: {
                ...state.store,
                checkout: res,
              },
            }))
          })
      },
      updateLineItem: (client, checkoutID, lineItemID, quantity) => {
        const lineItemsToUpdate = [
          { id: lineItemID, quantity: parseInt(quantity, 10) },
        ]

        return client.checkout
          .updateLineItems(checkoutID, lineItemsToUpdate)
          .then(res => {
            this.setState(state => ({
              store: {
                ...state.store,
                checkout: res,
              },
            }))
          })
      },
    },
  }


  async initializeCheckout() {
    // Check for an existing cart.
    const isBrowser = typeof window !== 'undefined'
    const existingCheckoutID = isBrowser
      ? localStorage.getItem('shopify_checkout_id')
      : null

    const setCheckoutInState = checkout => {
      if (isBrowser) {
        localStorage.setItem('shopify_checkout_id', checkout.id)
      }

      this.setState(state => ({
        store: {
          ...state.store,
          checkout,
        },
      }))
    }

    const createNewCheckout = () => this.state.store.client.checkout.create()
    const fetchCheckout = id => this.state.store.client.checkout.fetch(id)

    if (existingCheckoutID) {
      try {
        const checkout = await fetchCheckout(existingCheckoutID)

        // Make sure this cart hasn’t already been purchased.
        if (!checkout.completedAt) {
          setCheckoutInState(checkout)
          return
        }
      } catch (e) {
        localStorage.setItem('shopify_checkout_id', null)
      }
    }

    const newCheckout = await createNewCheckout()
    setCheckoutInState(newCheckout)
  }

  componentDidMount(){
    this.initializeCheckout()
  }


  render() {
    const { children } = this.props

    return (
    <StoreContext.Provider value={this.state.store}>
      <StaticQuery
        query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
          allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "menu"}}}) {
            edges {
              node {
                id
                frontmatter {
                  templateKey
                  visible
                  menuItems {
                    id
                    label
                    link
                    linkType
                    parentid
                  }
                }
              }
            }
          }
        }
      `}
        render={data => {

          const siteMetadata = data.site.siteMetadata
          const menuLinks = data.allMarkdownRemark.edges[0].node.frontmatter.menuItems
          const menuVisibility = data.allMarkdownRemark.edges[0].node.frontmatter.visible
          const { searching } = this.state.store

          return (
          <Search collapse indices={searchIndices}>
          <div id="wrapper">
            {/* Wrapper */}
            {/* Main */}
            <div id="main">
              <div className="inner">
                {/* Header */}
                <Header siteMetadata={siteMetadata} />
                { searching !== true ? children : <SearchResult indices={searchIndices} store={this.state.store}/> }
              </div>
            </div>
            {/* Sidebar */}
            <Sidebar siteMenu={menuLinks} visible={menuVisibility} transparent={`transparent`} store={this.state.store} />
            <Legacy />
          </div>
          </Search>
        )}}
      />
    </StoreContext.Provider>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
