/* eslint-env browser */
const Trianglify = require('trianglify');
const { TimelineMax } = require('gsap');

const tmaxOptions = {
  delay: 0,
  repeat: 0,
};

const staggerVal = 0.00475;
const duration = 1.5;

let numDone = 0;


class ContainerFactory {
  constructor(targetSelector) {
    this.targetSelector = targetSelector;
    this.targetContainer = document.querySelector(targetSelector);
    this.n = 0;
  }

  getNextContainer() {
    const newDiv = document.createElement('div');
    const divClass = `divNum${this.n}`;
    if (newDiv.classList)
      newDiv.classList.add(divClass);
    else
      newDiv.className += ' ' + divClass;

    this.targetContainer.appendChild(newDiv);
    this.n += 1;
    return {
      element: newDiv,
      selector: '.' + divClass,
    };
  }
}

class Triang {
  constructor(container) {
    this.container = container;
    this.triang = Trianglify({
      width: window.innerWidth,
      height: window.innerHeight,
      seed: Math.random(),
    });
    this.triangSvg = this.triang.svg();
  }

  insertTriangIntoContainer() {
    if (this.container) {
      console.log('container exists');
      this.container.appendChild(this.triangSvg);
    }
  }

  getNumTriangles() {
    return this.triangSvg ? this.triangSvg.childElementCount : 0;
  }
}


class MyTimeline {
  constructor(createAndAnimateNext) {
    this.timeline = new TimelineMax(tmaxOptions);
    const delayedStart = () => {
      setTimeout(createAndAnimateNext, 10000);
    };
    this.timeline.eventCallback('onComplete', delayedStart);
  }

  getTimeline() {
    return this.timeline;
  }
}

const createAndInsertTrianglify = (container) => {
  const pattern = Trianglify({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const svg = pattern.svg();
  container.appendChild(svg);
  return svg.childElementCount;
};

const generateShapeSelectors = (numTriangles, parentSelectorClass) => (
  [...Array(numTriangles).keys()].map(i => (
    `${parentSelectorClass} svg > path:nth-of-type(${i})`
  ))
);

const animateTrianglify = (numTriangles, parentSelectorClass, timeline) => {
  const svgShapes = generateShapeSelectors(numTriangles, parentSelectorClass);

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

const containerFactory = new ContainerFactory('#container-container');

const getResources = (createAndAnimateNext) => {
  const container = containerFactory.getNextContainer();
  const triang = new Triang(container.element, createAndAnimateNext);
  const tmax = new MyTimeline(createAndAnimateNext);
  return { container, triang, tmax };
};

const createAndAnimateNext = () => {
  if (numDone <= 3) {
    const { triang, container, tmax } = getResources(createAndAnimateNext);
    triang.insertTriangIntoContainer();
    animateTrianglify(triang.getNumTriangles(), container.selector, tmax.getTimeline());
    numDone += 1;
  }
};

window.onload = () => {
  createAndAnimateNext();
};
