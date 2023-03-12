// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/index.js":[function(require,module,exports) {
var vsSource = 'attribute vec3 vertPosition;\n' + 'attribute vec3 vertColor;\n' + 'varying vec3 fragColor;\n' + 'varying vec3 fragPosition;\n' + 'uniform mat4 mWorld;\n' + 'void main()\n' + '{\n' + '  fragColor = vertColor;\n' + '  fragPosition = vertPosition;\n' + '  gl_Position = mWorld * vec4(vertPosition, 1.0);\n' + '}';
var fsSource = 'precision mediump float;\n' + 'varying vec3 fragColor;\n' + 'void main()\n' + '{\n' + '  gl_FragColor = vec4(fragColor, 1.0);\n' + '}';
var fsSourceLines = 'precision mediump float;\n' + 'varying vec3 fragColor;\n' + 'varying vec3 fragPosition;\n' + 'void main()\n' + '{\n' + 'int x = int(fragPosition.x * 10.0 + 5.0) ;\n' + 'float shouldColorize = mod(float(x), 2.0);\n' + 'if ((shouldColorize == 0.0)){\n' + 'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n' + '}\n' + 'else{' + 'gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);' + '}\n' + '}';

function initWebGL(canvas) {
  gl = null;

  try {
    gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimentalwebgl");
  } catch (e) {
    console.log(e.toString());
  }

  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    gl = null;
  }

  return gl;
}

function loadShader(gl, type, source) {
  var shader = gl.createShader(type); // Send the source to the shader object

  gl.shaderSource(shader, source); // Compile the shader program

  gl.compileShader(shader); // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function initShaderProgram(gl, vsSource, fsSource) {
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
} //POLYGON


canva = document.getElementById("polygonCanvas");
initWebGL(canva);

if (gl) {
  // продолжать только если WebGL доступен и работает
  // Устанавливаем размер вьюпорта
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // установить в качестве цвета очистки буфера цвета черный, полная непрозрачность

  gl.clearColor(0.5, 0.5, .5, 1); // включает использование буфера глубины

  gl.enable(gl.DEPTH_TEST); // определяет работу буфера глубины: более ближние объекты перекрывают дальние

  gl.depthFunc(gl.LEQUAL); // очистить буфер цвета и буфер глубины

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function initBuffersPolygon() {
  var polygonVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, polygonVerticesBuffer);
  var vertices = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.6, -0.1, 0.0, 1.0, 0.0, 0.0, 0.0, -0.5, 0.0, 1.0, 0.0, 0.0, -0.35, 0.5, 0.0, 1.0, 0.0, 0.0, 0.35, 0.5, 0.0, 1.0, 0.0, 0.0, 0.6, -0.1, 0.0, 1.0, 0.0, 0.0, 0.0, -0.5, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

var shaderProgram = initShaderProgram(gl, vsSource, fsSource);
initBuffersPolygon();
var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertPosition");
var vertColorAttribute = gl.getAttribLocation(shaderProgram, "vertColor");
gl.enableVertexAttribArray(vertexPositionAttribute);
gl.enableVertexAttribArray(vertColorAttribute);
gl.useProgram(shaderProgram);
gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.vertexAttribPointer(vertColorAttribute, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
var matWorldUniformLocation = gl.getUniformLocation(shaderProgram, 'mWorld');
var worldMatrix = new Float32Array(16);
glMatrix.mat4.identity(worldMatrix);
gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 7); // CUBE

var canvasCube = document.getElementById("cubeCanvas");
initWebGL(canvasCube);

if (gl) {
  // продолжать только если WebGL доступен и работает
  // Устанавливаем размер вьюпорта
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // установить в качестве цвета очистки буфера цвета черный, полная непрозрачность

  gl.clearColor(0.5, 0.5, .5, 1); // включает использование буфера глубины

  gl.enable(gl.DEPTH_TEST); // определяет работу буфера глубины: более ближние объекты перекрывают дальние

  gl.depthFunc(gl.LEQUAL); // очистить буфер цвета и буфер глубины

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function initBuffersCube() {
  var сubeVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, сubeVerticesBuffer);
  var vertices = [// X, Y, Z           R, G, B
  // Front
  -0.5, -0.5, -0.5, 0.0, 1.0, 1.0, // 3
  -0.5, 0.5, -0.5, 0.0, 1.0, 1.0, // 1
  0.5, 0.5, -0.5, 0.0, 1.0, 1.0, // 2
  -0.5, -0.5, -0.5, 0.0, 1.0, 1.0, // 3
  0.5, 0.5, -0.5, 0.0, 1.0, 1.0, // 2
  0.5, -0.5, -0.5, 0.0, 1.0, 1.0, // 4
  // Top
  -0.5, 0.5, -0.5, 0.2, 0.7, 0.1, // 1
  -0.5, 0.5, 0.5, 0.2, 0.7, 0.1, // 5
  0.5, 0.5, 0.5, 0.2, 0.7, 0.1, // 6
  -0.5, 0.5, -0.5, 0.2, 0.7, 0.1, // 1
  0.5, 0.5, -0.5, 0.2, 0.7, 0.1, // 2
  0.5, 0.5, 0.5, 0.2, 0.7, 0.1, // 6
  // Bottom
  -0.5, -0.5, -0.5, 0.1, 0.5, 0.0, // 3
  0.5, -0.5, 0.5, 0.1, 0.5, 0.0, // 8
  0.5, -0.5, -0.5, 0.1, 0.5, 0.0, // 4
  -0.5, -0.5, -0.5, 0.1, 0.5, 0.0, // 3
  0.5, -0.5, 0.5, 0.1, 0.5, 0.0, // 8
  -0.5, -0.5, 0.5, 0.1, 0.5, 0.0, // 7
  // Left
  -0.5, -0.5, -0.5, 0.5, 0.0, 1.0, // 3
  -0.5, 0.5, -0.5, 0.5, 0.0, 1.0, // 1
  -0.5, -0.5, 0.5, 0.5, 0.0, 1.0, // 7
  -0.5, 0.5, 0.5, 0.5, 0.0, 1.0, // 5
  -0.5, 0.5, -0.5, 0.5, 0.0, 1.0, // 1
  -0.5, -0.5, 0.5, 0.5, 0.0, 1.0, // 7
  //Right
  0.5, 0.5, -0.5, 0.2, 0.0, 0.0, // 2
  0.5, -0.5, 0.5, 0.2, 0.0, 0.0, // 8
  0.5, -0.5, -0.5, 0.2, 0.0, 0.0, // 4
  0.5, 0.5, -0.5, 0.2, 0.0, 0.0, // 2
  0.5, -0.5, 0.5, 0.2, 0.0, 0.0, // 8
  0.5, 0.5, 0.5, 0.2, 0.0, 0.0, // 6
  //Back
  -0.5, 0.5, 0.5, 0.2, 0.3, 0.5, // 5
  0.5, 0.5, 0.5, 0.2, 0.3, 0.5, // 6
  -0.5, -0.5, 0.5, 0.2, 0.3, 0.5, // 7
  0.5, -0.5, 0.5, 0.2, 0.3, 0.5, // 8
  0.5, 0.5, 0.5, 0.2, 0.3, 0.5, // 6
  -0.5, -0.5, 0.5, 0.2, 0.3, 0.5 // 7
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

var shaderProgramCube = initShaderProgram(gl, vsSource, fsSource);
initBuffersCube();
vertexPositionAttribute = gl.getAttribLocation(shaderProgramCube, "vertPosition");
vertColorAttribute = gl.getAttribLocation(shaderProgramCube, "vertColor");
gl.enableVertexAttribArray(vertexPositionAttribute);
gl.enableVertexAttribArray(vertColorAttribute);
gl.useProgram(shaderProgramCube);
matWorldUniformLocation = gl.getUniformLocation(shaderProgramCube, 'mWorld');
worldMatrix = new Float32Array(16);
glMatrix.mat4.identity(worldMatrix);
gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
var xRotationMatrix = new Float32Array(16);
var yRotationMatrix = new Float32Array(16);
var identityMatrix = new Float32Array(16);
glMatrix.mat4.identity(identityMatrix);
var angle = 0.25 * Math.PI;
glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle * 3, [0, 1, 0]);
glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle * 3, [1, 0, 0]);
glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.vertexAttribPointer(vertColorAttribute, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 36); //SQUARE

var canvasSquare = document.getElementById("squareCanvas");
initWebGL(canvasSquare); // инициализация контекста GL – сами пишем

var shaderProgramLineSquare = initShaderProgram(gl, vsSource, fsSourceLines);

if (gl) {
  // продолжать только если WebGL доступен и работает
  // Устанавливаем размер вьюпорта
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // установить в качестве цвета очистки буфера цвета черный, полная непрозрачность

  gl.clearColor(0.5, 0.5, .5, 1); // включает использование буфера глубины

  gl.enable(gl.DEPTH_TEST); // определяет работу буфера глубины: более ближние объекты перекрывают дальние

  gl.depthFunc(gl.LEQUAL); // очистить буфер цвета и буфер глубины

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function initBuffersSquare() {
  var squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  var vertices = [-0.5, -0.5, 0.0, 0.0, 0.0, 0.0, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 0.0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

initBuffersSquare();
vertexPositionAttribute = gl.getAttribLocation(shaderProgramLineSquare, "vertPosition");
vertColorAttribute = gl.getAttribLocation(shaderProgramLineSquare, "vertColor");
gl.enableVertexAttribArray(vertexPositionAttribute);
gl.enableVertexAttribArray(vertColorAttribute);
gl.useProgram(shaderProgramLineSquare);
matWorldUniformLocation = gl.getUniformLocation(shaderProgramLineSquare, 'mWorld');
worldMatrix = new Float32Array(16);
glMatrix.mat4.identity(worldMatrix);
gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.vertexAttribPointer(vertColorAttribute, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64854" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map