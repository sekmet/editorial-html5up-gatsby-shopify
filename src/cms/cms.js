import CMS from "netlify-cms-app"
import NetlifyCmsWidgetFontpicker from 'netlify-cms-widget-fontpicker';
import NetlifyCmsWidgetColorpickers from 'netlify-cms-widget-colorpickers';

/*import AboutPagePreview from "./preview-templates/AboutPagePreview";
import HomePagePreview from "./preview-templates/HomePagePreview";
import FooterPreview from "./preview-templates/FooterPreview";
import NavbarPreview from "./preview-templates/NavbarPreview";

CMS.registerPreviewTemplate("footer", FooterPreview);
CMS.registerPreviewTemplate("navbar", NavbarPreview);
CMS.registerPreviewTemplate("about", AboutPagePreview);
CMS.registerPreviewTemplate("home", HomePagePreview);*/

CMS.registerWidget([
  NetlifyCmsWidgetFontpicker.Widget(),
  NetlifyCmsWidgetColorpickers.Widget()
])

export default CMS