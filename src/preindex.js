/* eslint-env browser */
const Trianglify = require('trianglify');
const { TimelineMax } = require('gsap');

const tmaxOptions = {
  delay: 0,
  repeat: 0,
};

const svgShapes = [];
const staggerVal = 0.00475;
const duration = 1.5;

const tmaxForward = new TimelineMax(tmaxOptions);

const createAndInsertTrianglify = (container) => {
  const pattern = Trianglify({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const svg = pattern.svg();
  container.appendChild(svg);
  return svg.childElementCount;
};

const animateTrianglify = (numTriangles) => {
  for (let i = 1; i <= numTriangles; i += 1) {
    svgShapes.push(`svg > path:nth-of-type(${i})`);
  }

  const staggerFrom = {
    css: {
      scale: 0,
      transformOrigin: 'center center',
      opacity: 0,
    },
    ease: 'Elastic.easeInOut',
    force3D: true,
  };

  const staggerTo = {
    css: {
      scale: 1,
      opacity: 1,
    },
    ease: 'Elastic.easeInOut',
    force3D: true,
  };

  tmaxForward.staggerFromTo(svgShapes, duration, staggerFrom, staggerTo, staggerVal, 0);
};

class ContainerManager {
  constructor() {
    this.containerList = [
      document.querySelector('.svg-container'),
    ];
  }
  getNextContainer() {
    return this.containerList.pop();
  }
}

const containerManager = new ContainerManager();

window.onload = () => {
  const numTriangles = createAndInsertTrianglify(containerManager.getNextContainer());
  animateTrianglify(numTriangles);
};
