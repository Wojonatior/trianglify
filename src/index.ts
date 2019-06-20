/* eslint-env browser */
import Trianglify from 'Trianglify';
import { TimelineMax } from 'gsap';
import * as TrianglifyTypes from './triang-types';

const tmaxOptions = {
  delay: 0,
  repeat: 0,
};

const staggerVal = 0.00475;
const duration = 1.5;

let numDone = 0;


class ContainerFactory {
  targetSelector: string;
  targetContainer: Element | null;
  n: number;

  constructor(_targetSelector: string) {
    this.targetSelector = _targetSelector;
    this.targetContainer = document.querySelector(_targetSelector);
    this.n = 0;
  }

  getNextContainer() {
    const newDiv = document.createElement('div');
    const divClass = `divNum${this.n}`;
    if (newDiv.classList)
      newDiv.classList.add(divClass);
    else
      newDiv.className += ' ' + divClass;

    if(this.targetContainer)
      this.targetContainer.appendChild(newDiv);
    else
      console.error("can't appendChild to target container, targetContainer not found");
    this.n += 1;
    return {
      element: newDiv,
      selector: '.' + divClass,
    };
  }
}

class Triang {
  container: Element;
  triang: TrianglifyTypes.Pattern;
  triangSvg: Element

  constructor(_container: Element) {
    this.container = _container;
    this.triang = Trianglify({
      width: window.innerWidth,
      height: window.innerHeight,
      seed: Math.random(),
    });
    this.triang;
    this.triangSvg = this.triang.svg();
  }

  insertTriangIntoContainer() {
    console.log('trying to insert triang into container');
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
  timeline: TimelineMax;

  constructor(createAndAnimateNext: () => void) {
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

const createAndInsertTrianglify = (container: HTMLElement) => {
  const pattern = Trianglify({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const svg = pattern.svg();
  container.appendChild(svg);
  return svg.childElementCount;
};

const getRange = (i: number): number[] => {
  return [...Array(i).keys()];
};

const generateShapeSelectors = (numTriangles: number, parentSelectorClass: string) => (
  getRange(numTriangles).map(i => (
    `${parentSelectorClass} svg > path:nth-of-type(${i})`
  ))
);

const animateTrianglify = (numTriangles: number, parentSelectorClass: string, timeline: TimelineMax) => {
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

const getResources = (createAndAnimateNext: () => void) => {
  const container = containerFactory.getNextContainer();
  const triang = new Triang(container.element);
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
  console.log('onload fired');
  createAndAnimateNext();
};

if(document.readyState === "complete") {
  console.log('readyState complete');
  createAndAnimateNext();
}
console.log('hello what is going on');

window.addEventListener('load', function () {
  console.log('window event load');
  createAndAnimateNext();
}, false);
