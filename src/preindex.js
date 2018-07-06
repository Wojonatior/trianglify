/* eslint-env browser */
const Trianglify = require('trianglify');
const { TimelineMax } = require('gsap');

const tmaxOptions = {
  delay: 0,
  repeat: 0,
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

  returnAndEmptyContainer(container) {
    container.innerHtml = '';
    this.containerList.push(container);
  }
}

class Triang {
  constructor(container) {
    this.triang = Trianglify({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.triangSvg = this.triang.svg();
    this.container = container;
  }

  insertTriangIntoContainer() {
    this.container.appendChild(this.triangSvg);
  }

  getNumTriangles() {
    return this.triangSvg ? this.triangSvg.childElementCount : 0;
  }
}

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

const animateTrianglify = (numTriangles, parentSelectorClass, timeline) => {
  for (let i = 1; i <= numTriangles; i += 1) {
    svgShapes.push(`.${parentSelectorClass} svg > path:nth-of-type(${i})`);
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

  timeline.staggerFromTo(svgShapes, duration, staggerFrom, staggerTo, staggerVal, 0);
};

const containerManager = new ContainerManager();

window.onload = () => {
  const numTriangles = createAndInsertTrianglify(containerManager.getNextContainer());
  animateTrianglify(numTriangles, 'svg-container', tmaxForward);
};


/*
 * OnStart: create n+1 trang and insert into dom
 * OnFinish: return and empty n-1 container, start next animation with delay
 */
