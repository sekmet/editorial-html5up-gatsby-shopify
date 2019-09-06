import { Link } from "gatsby"
import React from "react"

const Menu = (props) => {

  const menuVisibility = props.visible
  const menuRoot = props.siteMenu.filter(mnu => mnu.parentid === '-1')
  //const subMenus = props.siteMenu.filter(mnu => mnu.parentid !== '-1')

  if (!menuVisibility)
    return false

  menuRoot.map(menu => {
    var hasSubmenu = props.siteMenu.filter(mnu => mnu.parentid === menu.id)
    if (hasSubmenu.length > 0) {
      menu.withsub = true
      menu.items = hasSubmenu
    }
    return menu
  })

  return (
    <nav id="menu">
      <header className="major">
        <h2>Menu</h2>
      </header>
      <ul>
        {menuRoot.map(menulink => (
          menulink.parentid !== '-1' ? '' :
            <li key={menulink.id}>
              {menulink.withsub !== true ?
              <Link to={menulink.link}>{menulink.label}</Link>
                :
              <span className="opener">{menulink.label}</span>}

              {menulink.withsub === true ?
              <ul key={`${menulink.id}-sub`}>
                {menulink.items.map(submenulink => (
                  <li key={submenulink.id}>
                      {submenulink.linkType !== 'external' ?
                    <Link to={submenulink.link}>{submenulink.label}</Link> :
                    <a href={submenulink.link} target="_blank" rel="noopener noreferrer">{submenulink.label}</a>}
                  </li>
                ))}
              </ul> : ''}

            </li>
        ))}
      </ul>
    </nav>
  )
}

export default Menu
