export const templateHelpers = {
  if: (condition, thenTemplate, elseTemplate = '') => (condition ? thenTemplate : elseTemplate),
  each: (obj, templateFn) => {
    const props = Object.keys(obj);
    const items = props.map(prop => ({
      prop,
      value: obj[prop]
    }));
    return items.map(item => templateFn(item)).join('');
  }
};

export const templateNoEmpty = {
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
