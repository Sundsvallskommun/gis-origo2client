import defaultTemplate from './templates/featureinfotemplate';
import noEmptyTemplate from './templates/noemptytemplate';

const templates = {};
templates.default = defaultTemplate;
templates.noempty = noEmptyTemplate;

function featureinfotemplates(template, attributes) {
  return templates[template](attributes);
}
export default featureinfotemplates;
