import convertHtml2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image-more';

let url;

export const downloadBlob = function downloadBlob({ blob, filename }) {
  return new Promise((resolve) => {
    const link = document.createElement('a');
    url = URL.createObjectURL(blob);

    // ie 11 workaround
    if (!('download' in link) && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
      URL.revokeObjectURL(url);
      resolve();
      return;
    }

    if (!('download' in link)) {
      link.target = '_blank';
    }

    link.download = filename;
    link.href = url;

    const clickHandler = () => {
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
        link.removeEventListener('click', clickHandler, false);
        resolve();
      }, 200);
    };
    link.addEventListener('click', clickHandler);
    link.click();
  });
};

const canvasToBlob = function canvasToBlob(canvas) {
  const promise = new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    });
  });
  return promise;
};

const mm2Pt = function convertMm2Pt(mm) {
  const factor = 2.8346456692913;
  return mm * factor;
};

export const html2canvas = function html2canvas(el) {
  return convertHtml2canvas(el, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    height: el.offsetHeight,
    width: el.offsetWidth
  });
};

export const dom2image = function dom2image(el, exportOptions) {
  return domtoimage.toJpeg(el, exportOptions);
};

export const getImageBlob = async function getImageBlob(el) {
  if (el) {
    const transformScale = el.style.transform;
    const printEl = el;
    printEl.style.transform = 'scale(1)';
    const canvas = await html2canvas(printEl);
    printEl.style.transform = transformScale;
    const blob = await canvasToBlob(canvas);
    return blob;
  }
  throw new Error('Failed to create image blob from canvas');
};

export const downloadPNG = async function downloadPNG({
  afterRender,
  beforeRender,
  filename,
  el
}) {
  if (beforeRender) beforeRender(el);
  const blob = await getImageBlob(el);
  if (afterRender) afterRender(el);
  try {
    await downloadBlob({ blob, filename });
  } catch (err) {
    console.error(err);
  }
};

export const downloadPDF = async function downloadPDF({
  afterRender,
  beforeRender,
  el,
  filename,
  height,
  orientation,
  size,
  width
}) {
  const format = size === 'custom' ? [mm2Pt(width), mm2Pt(height)] : size;
  const pdf = new jsPDF({ orientation, format, unit: 'mm', compress: true });

  if (beforeRender) beforeRender(el);
  const canvas = await html2canvas(el);
  if (afterRender) afterRender(el);
  pdf.addImage(canvas, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
  pdf.save(`${filename}.pdf`);
};

export const printToScalePDF = async function printToScalePDF({
  el,
  filename,
  height,
  orientation,
  size,
  width,
  printScale,
  widthImage,
  heightImage
}) {
  // export options for html-to-image.
  // See: https://github.com/bubkoo/html-to-image#options
  const exportOptions = {
    filter(element) {
      let className = element.className || '';
      if (typeof className === 'object' && element.classList) {
        className = `${element.classList}`;
      }
      return (
        className.indexOf('o-print') === -1
        || className.indexOf('o-print-header') > -1
        || className.indexOf('print-scale-line') > -1
        || className.indexOf('padding-right-small') > -1
        || className.indexOf('padding-bottom-small') > -1
        || className.indexOf('o-print-description') > -1
        || className.indexOf('o-print-footer') > -1
        || className.indexOf('o-print-footer-left') > -1
        || className.indexOf('o-print-created') > -1
        || (className.indexOf('print-attribution') > -1
          && className.indexOf('ol-uncollapsible'))
      );
    }
  };

  const format = size === 'custom' ? [mm2Pt(width), mm2Pt(height)] : size;
  if (printScale !== 0) {
    exportOptions.width = widthImage;
    exportOptions.height = heightImage;
  }

  const pdf = new jsPDF({ orientation, format, unit: 'mm', compress: true });
  const styleAttributes = el.getAttribute('style');
  el.setAttribute('style', styleAttributes.split('transform: scale')[0]); // Remove scaling to get correct print size of image
  let image = await dom2image(el, exportOptions);
  image = await dom2image(el, exportOptions); // Fix for iPhone
  pdf.addImage(image, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
  el.setAttribute('style', styleAttributes); // Restore scaling
  pdf.save(`${filename}.pdf`);
};
