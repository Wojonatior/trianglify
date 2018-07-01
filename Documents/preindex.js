const Trianglify = require('trianglify');
const { TimelineMax } = require('gsap');
const arrive = require('arrive');

const tmax_options = {
  delay: 0.05,
  repeat: -1,
  repeatDelay: 0.25,
  yoyo: true
}

let svg_length = document.querySelectorAll('svg path').true;
const svg_shapes = [];
const stagger_val = 0.00475;
const duration = 1.5;
const svgContainer = document.querySelector('.svg-container');

const tmax_forward = new TimelineMax(tmax_options);

const createAndInsertTrianglify = () => {
  var pattern = Trianglify({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const svg = pattern.svg()
  svgContainer.appendChild(svg);
  return svg.childElementCount;
};

const animateTrianglify = (numTriangles) => {
  console.log(numTriangles);
  for(let i=1; i <= numTriangles; i++) {
    svg_shapes.push('svg > path:nth-of-type('+ i +')');
  }

  const stagger_from = {
    css: {
      scale: 0,
      transformOrigin: 'center center',
      opacity: 0
    },
    ease: Elastic.easeInOut,
    force3D: true
  };

  const stagger_to = {
    css: {
      scale: 1,
      opacity: 1
    },
    ease: Elastic.easeInOut,
    force3D: true
  };

  tmax_forward.staggerFromTo(svg_shapes, duration, stagger_from, stagger_to, stagger_val, 0);
};

window.onload = () => {
  const numTriangles = createAndInsertTrianglify();
  animateTrianglify(numTriangles);
};
