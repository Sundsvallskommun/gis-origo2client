const isOnIos = function isOnIos() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
};

export default isOnIos;
