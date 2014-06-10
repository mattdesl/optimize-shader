[![browser support](https://ci.testling.com/mattdesl/optimize-shader.png)](https://ci.testling.com/mattdesl/optimize-shader)

# optimize-shader [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A thin wrapper around glsl-optimizer for an easier JavaScript-focused API. Also includes a command-line tool for quick optimizing.

**This tool is in heavy work in progress. Ultimately it would be great to integrate as a transform/through stream for glslify.**

## Usage

Install it globally, like so: (the native build may take a little while)

```
npm install optimize-shader -g
```

Command-line usage:

```
Usage: optimize-shader shader.glsl -v|-f [-t es20 -d MAX_LIGHTS:3]

Options:
  -v             vertex shader                                                
  -f             fragment shader                                              
  -t, --target   the target: gl, es20, es30   [default: "gl"]
  -d, --defines  define in KEY:value form, or a path to *.json file to include
```

Pass the shader, flag whether it's vertex or fragment, and additional options. You can specify target GLSL language and a list of pre-processor `#define` statements to inject before optimizing. 

```
# output to file
optimize-shader PointLight.frag -f > build/PointLight.opt.frag

# specify defines like so:
optimize-shader PointLight.frag -f -t es20 -d MAX_LIGHTS:10 -d USE_GAMMA -d customDefines.json
```

## API

If you want to use the API directly:

```js
var optimizer = require('optimize-shader');

var result = optimizer({
    //required, source string
    source: fragSource,
    
    //required, type of shader
    type: optimizer.FRAGMENT_SHADER, 

    //optional stuff... type of target and #define injection
    defines: {
        "MAX_LIGHTS": 3
    },
    target: optimizer.TARGET_OPENGLES20
});

console.log(result.compiled); //boolean, whether it compiled successfully
console.log(result.log); //from glsl_optimizer, which isn't always reliable
console.log(result.output); //the optimized output shader
```


## License

MIT, see [LICENSE.md](http://github.com/mattdesl/optimize-shader/blob/master/LICENSE.md) for details.
