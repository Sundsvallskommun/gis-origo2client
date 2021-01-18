import { templateNoEmpty } from '../utils/templatehelpers';

export default (properties) => {
  const els = `${templateNoEmpty.each(properties, obj => `<li><b>${obj.prop}</b> : ${obj.value}</li>`)}`;
  return els;
};
