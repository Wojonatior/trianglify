const Trianglify = require('trianglify');
const { TimelineMax } = require('gsap');

const tmaxOptions = {
  delay: 0,
  repeat: -1,
  repeatDelay: 0.25,
  yoyo: true,
};

const svgShapes = [];
const staggerVal = 0.00475;
const duration = 1.5;
const svgContainer = document.querySelector('.svg-container');

const tmaxForward = new TimelineMax(tmaxOptions);

const createAndInsertTrianglify = () => {
  const pattern = Trianglify({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const svg = pattern.svg();
  svgContainer.appendChild(svg);
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
    ease: Elastic.easeInOut,
    force3D: true,
  };

  const staggerTo = {
    css: {
      scale: 1,
      opacity: 1,
    },
    ease: Elastic.easeInOut,
    force3D: true,
  };

  tmaxForward.staggerFromTo(svgShapes, duration, staggerFrom, staggerTo, staggerVal, 0);
};

window.onload = () => {
  const numTriangles = createAndInsertTrianglify();
  animateTrianglify(numTriangles);
};
