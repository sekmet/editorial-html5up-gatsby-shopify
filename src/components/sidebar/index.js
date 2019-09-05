import React from "react"

import Menu from "../menu"
import Contact from "../contact"
import Latest from "../latest"
import Footer from "../footer"
import Searchbox from "../search/searchbox"

const Sidebar = (props) => {

    return (
        <div id="sidebar">
            <div className="inner">
                {/* Search */}
                <section id="search" className="Search Alt">
                  <Searchbox {...props}/>
                </section>

                {/* Menu */}
                <Menu siteMenu={props.siteMenu} visible={props.visible} />

                {/* Section */}
                <Latest/>

                {/* Section */}
                <Contact/>

                {/* Footer */}
                <Footer/>
            </div>
        </div>

    )

}

export default Sidebar