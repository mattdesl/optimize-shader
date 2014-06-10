var glslOptimizer = require('glsl-optimizer');

optimize.FRAGMENT_SHADER = glslOptimizer.FRAGMENT_SHADER;
optimize.VERTEX_SHADER = glslOptimizer.VERTEX_SHADER;
optimize.TARGET_OPENGL = glslOptimizer.TARGET_OPENGL;
optimize.TARGET_OPENGLES20 = glslOptimizer.TARGET_OPENGLES20;
optimize.TARGET_OPENGLES30 = glslOptimizer.TARGET_OPENGLES30;

var fs = require('fs'), 
    tokens = require('glsl-tokenizer'),
    resumer = require('resumer');

function matchVersion(source) {
    var index = -1,
        length = 0;
    
    var stream = tokens();
    stream.on('data', function(token) {
        if (token.type == "preprocessor") {
            if (token.data.indexOf("#version") === 0) {
                index = token.position;
                length = token.data.length;
            }
        }
    });
    stream.write(source);
    stream.end();
    return {
        index: index,
        length: length
    };
}  

function strDefines(source, defines) {
    var str = "";
    for (var k in defines) {
        if (defines.hasOwnProperty(k)) {
            var o = defines[k];
            str += "#define "+k+" "+o+"\n";
        }
    }
    return str;
}

function injectFeatures(source, defines, sourcePrefix) {
    if (!defines)
        return source;

    var version = matchVersion(source);
    var defStr = strDefines(source, defines);

    sourcePrefix = sourcePrefix||"";

    if (version.index !== -1 && version.length > 0) {
        var prefix = source.substring(0, version.index+version.length);
        var suffix = source.substring(version.index+version.length, source.length);

        source = prefix + "\n" + defStr + "\n" + sourcePrefix + "\n" + suffix;
    } else if (sourcePrefix) { // try to minimize line # thrashing
        source = defStr + '\n' + sourcePrefix + '\n' + source;
    } else
        source = defStr + '\n' + source;
    return source;
}

function optimize(opts) {
	opts = opts||{};
    var target = +(opts.target||0);
    var source = opts.source||"";
    var type = opts.type;

    if (type !== optimize.FRAGMENT_SHADER && type !== optimize.VERTEX_SHADER)
        throw "type must be one of FRAGMENT_SHADER or VERTEX_SHADER";
    
    //Inject any optional defines...
    source = injectFeatures(source, opts.defines, opts.prefix);

    var compiler = new glslOptimizer.Compiler(target);
    var shader = new glslOptimizer.Shader(compiler, type, source);

    var result = {
        output: shader.output()||"",
        compiled: Boolean(shader.compiled()),
        rawOutput: shader.rawOutput()||"",
        log: shader.log()
    };

    shader.dispose();
    compiler.dispose();
    return result;
}

module.exports = optimize;

