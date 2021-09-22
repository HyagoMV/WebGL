const eCanvas = document.querySelector('canvas');
const gl = eCanvas.getContext('webgl');

const vertexShaderSource = `
  precision mediump float;
  attribute vec2 vertPosition;
  void main() {
    gl_Position = vec4(vertPosition, 0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform float time;
  void main() {
  
    gl_FragColor = vec4(1.0, 0, 0, 1.0);
  }
`;

(function() {
  if(!gl) {
    console.error('WebGL not support');
    return;
  } 
  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.shaderSource(fragmentShader, fragmentShaderSource);

  gl.compileShader(vertexShader);
  if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    let infoLog = gl.getShaderInfoLog(vertexShader);
    console.error("ERROR::SHADER::VERTEX::COMPILATION_FAILED\n\t" + infoLog);
    return;
  }

  gl.compileShader(fragmentShader);
  if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    let infoLog = gl.getShaderInfoLog(fragmentShader);
    console.error("ERROR::SHADER::FRAGMENT::COMPILATION_FAILED\n\t" + infoLog);
    return;
  }
  
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    let infoLog = gl.getProgramInfoLog(program);
    console.error("ERROR::SHADER::PROGRAM::LINKING_FAILED\n\t" + infoLog);
    return;
  }

  gl.validateProgram(program);
  if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    let infoLog = gl.getProgramInfoLog(program);
    console.error("ERROR::SHADER::PROGRAM::VALIDATE_FAILED\n\t" + infoLog);
    return;
  }
  
  let triangleVertices = [
    0,  0.5,     //  top
    -0.5, -0.5,    //  right
    0.5, -0.5      //  left  
  ];
  
  let triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

  let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  gl.vertexAttribPointer(
    positionAttribLocation,
    2, 
    gl.FLOAT, 
    gl.FALSE,
    2 * Float32Array.BYTES_PER_ELEMENT,
    0
  );

  gl.enableVertexAttribArray(positionAttribLocation)

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3)
})();

