const typeOfIcon = function typeOfIcon(src) {
  // Sundsvall special: Alowing for more the one icon for style
  if (Array.isArray(src)) {
    src.forEach((icon) => {
      if (icon.length) {
        if (icon.startsWith('#')) {
          return 'sprite';
        } else if (icon.startsWith('<svg')) {
          return 'svg';
        } else if (icon.startsWith('<img')) {
          return 'img';
        }
        return 'image';
      }
    });
  } else {
    if (src.length) {
      if (src.startsWith('#')) {
        return 'sprite';
      } else if (src.startsWith('<svg')) {
        return 'svg';
      } else if (src.startsWith('<img')) {
        return 'img';
      }
      return 'image';
    }
  }
  return '';
};

export default typeOfIcon;
