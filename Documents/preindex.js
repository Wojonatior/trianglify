const Trianglify = require('trianglify');

const createAndInsertTrianglify = () => {
  var pattern = Trianglify({
    width: window.innerWidth,
    height: window.innerHeight
  });
  document.body.appendChild(pattern.svg());
};

window.onload = createAndInsertTrianglify;
