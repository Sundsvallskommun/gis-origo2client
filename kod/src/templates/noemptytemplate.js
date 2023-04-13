const templateNoEmpty = {
  if: (condition, thenTemplate, elseTemplate = '') => (condition ? thenTemplate : elseTemplate),
  each: (obj, templateFn) => {
    const props = Object.keys(obj);
    const propsIncluded = [];
    props.forEach(element => {
      if (typeof obj[element] !== 'undefined' && obj[element] !== null && obj[element] !== '') {
        // if (typeof obj[element] !== 'undefined' && obj[element] !== null && obj[element] !== '' && obj[element] !== true && obj[element] !== false) {
        propsIncluded.push(element);
      }
    });
    const items = propsIncluded.map(prop => ({
      prop,
      value: obj[prop]
    }));
    return items.map(item => templateFn(item)).join('');
  }
};

function getLI(obj) {
  let li = `<li><b>${obj.prop}</b> : ${obj.value}</li>`;
  if (typeof obj.value === 'string') {
    if (obj.value.toLowerCase().startsWith('http')) {
      const urls = obj.value.split(',');
      let urlValue = '';
      urls.forEach(url => {
        urlValue += `<a href="${url}" target="_blank">${url}</a><br/>`;
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
