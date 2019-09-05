/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const each = require('lodash/each')
const path = require('path')

//https://www.gatsbyjs.org/docs/node-apis
exports.onPostBootstrap = ({ graphql }) => {
  //return new Promise((resolve, reject) => {
  // do async work
const fs = require('fs')

var colors = require(path.resolve('./static/admin/site_colors_fonts.json'))
  //console.log(colors)

var site_font_family = `${colors.site_font_family}`.split(',')
var site_heading_font = `${colors.site_heading_font}`.split(',')
var site_fixed_font = `${colors.site_fixed_font}`.split(',')

// Data which will write in a file.
let data = `
// Misc.
	$misc: (
		z-index-base:		10000
	);

// Duration.
	$duration: (
		nav:				0.5s,
		transition:			0.2s
	);

// Size.
	$size: (
		border-radius:		0.375em,
		element-height:		2.75em,
		element-margin:		2em,
		sidebar-width:		26em,
		sidebar-width-alt:	24em,
		gutter:				3em
	);

// Font.
	$font: (
		family:				('${site_font_family[0]}', ${site_font_family[1]}),
		family-heading:		('${site_heading_font[0]}', ${site_heading_font[1]}),
		family-fixed:		('${site_fixed_font[0]}', ${site_fixed_font[1]}),
		weight:				400,
		weight-bold:		600,
		weight-heading:		700,
		weight-heading-alt:	400,
		kerning-heading:	0.075em
	);

// Palette.
	$palette: (
		bg:					${colors.site_bg_color},
		bg-alt:			${colors.site_bg_altcolor},
		fg:					${colors.site_fg_color},
		fg-bold:			#3d4449,
		fg-light:			#9fa3a6,
		border:				rgba(210,215,217,0.75),
		border-bg:			transparentize(#e6ebed, 0.75),
		accent:				${colors.site_accent_color}
	);
	
  @import url('https://fonts.googleapis.com/css?family=${site_font_family[0].replace(' ','+')}:400,600,400italic,600italic|${site_heading_font[0].replace(' ','+')}:400,600|${site_fixed_font[0].replace(' ','+')}:400,600');
  
  `

// Write data in '_customvars.scss' .
//console.log(__dirname)
fs.writeFile(`${__dirname}/src/sass/libs/_customvars.scss`, data, (err) => {

//console.log('DATA FILE SCSS ==> ', data)
// In case of a error throw err.
if (err) throw err

})

 // })
    //graphql(QUERY).then(result => processAndWriteJSONFiles(result))

}

//markdown relative images
const { fmImagesToRelative } = require('gatsby-remark-relative-images');

/*exports.onCreateNode = ({ node }) => {
  fmImagesToRelative(node);
  console.log(node)
};*/
exports.onCreateNode = ({node, actions, getNode}) => {
  const {createNodeField} = actions
  fmImagesToRelative(node)

  if (node.internal.type === `ComponentMarkdown`) {
    const value = createFilePath({node, getNode})
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}


exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        components: path.resolve(__dirname, 'src/components'),
        templates: path.resolve(__dirname, 'src/templates'),
        scss: path.resolve(__dirname, 'src/sass'),
      },
    },
  })
}