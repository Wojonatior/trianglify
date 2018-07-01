const Trianglify = require('trianglify');
const { TimelineMax } = require('gsap');
const arrive = require('arrive');

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const tmax_options = {
  delay: 0.05,
  repeatDelay: 0.25,
  yoyo: false
}

let svg_length = document.querySelectorAll('svg path').length;
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
  svgContainer.appendChild(pattern.svg());
};

const animateTrianglify = () => {
  console.log('start trianglething');
  for(let i=1; i <= 2000; i++) {
    console.log('executred once');
    svg_shapes.push('svg > path:nth-of-type('+ i +')');
  }

  shuffleArray(svg_shapes);
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

  console.log('hellow')
  //debugger;
  tmax_forward.staggerFromTo(svg_shapes, duration, stagger_from, stagger_to, stagger_val, 0);
};

window.onload = () => {
  createAndInsertTrianglify();
  animateTrianglify();
  //ready('svg', () => {
    //console.log('arrive called');
    //animateTrianglify();
  //});
};
