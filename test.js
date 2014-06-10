var optimizer = require('./');

var fs = require('fs');
var path = require('path');
var src = fs.readFileSync( './test.glsl', 'utf8' );
// var src = fs.readFileSync( path.join('test', 'vertex', 'zun-TreeCreatorLeavesRT-out.txt'), 'utf8' );


var result = optimizer({
    source: src,
    defines: {
        "POST_PROCESSING": "",
        "LUT": ""
    },
    type: optimizer.FRAGMENT_SHADER,
    target: optimizer.TARGET_OPENGLES20
});

console.log(result.compiled);
console.log(result.output);