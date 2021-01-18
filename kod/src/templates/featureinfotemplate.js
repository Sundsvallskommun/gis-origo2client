import { templateHelpers } from '../utils/templatehelpers';

export default (properties) => {
  const els = `${templateHelpers.each(properties, obj => `<li><b>${obj.prop}</b> : ${obj.value}</li>`)}`;
  return els;
};
