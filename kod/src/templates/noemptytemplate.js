import { templateNoEmpty } from '../utils/templatehelpers';

function getLI(obj) {
  let li = `<li><b>${obj.prop}</b> : ${obj.value}</li>`;
  if (typeof obj.value === 'string') {
    if (obj.value.startsWith('http')) {
      const urls = obj.value.split(',');
      let urlValue = '';
      urls.forEach(url => {
        urlValue += `<a href="${url}">${url}</a><br/>`;
      });
      li = `<li><b>${obj.prop}</b> : ${urlValue}</li>`;
    }
  }
  return li;
}

export default (properties) => {
  const els = `${templateNoEmpty.each(properties, obj => getLI(obj))}`;
  return els;
};