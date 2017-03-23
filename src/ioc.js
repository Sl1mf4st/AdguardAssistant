"use strict";
/**
 * Simple ioc implementation
 * @type {{add, get}}
 */
var Ioc = (function () {
    var dependencies = {};

    var add = function (qualifier, obj) {
        dependencies[qualifier] = obj;
    };

    var get = function (func) {
        if (typeof func == 'string') {
            var resolved = dependencies[func];
            if (!resolved) {
                throw StringUtils.format("Can't resolve {0}", func);
            }
            return resolved;
        }
        var resolvedDependencies = _resolveDependencies(func);

        function funcWrapper() {
            return func.apply(func, resolvedDependencies);
        }

        funcWrapper.prototype = func.prototype;
        return new funcWrapper();
    };

    var _resolveDependencies = function (func) {
        var args = _getArguments(func);
        var resolved = [];
        for (var i = 0; i < args.length; i++) {
            var depName = StringUtils.trim(args[i]);
            var dep = dependencies[depName];
            if (!dep) {
                throw  "Can't find dependency: " + depName;
            }
            resolved.push(dependencies[depName]);
        }
        return resolved;
    };

    var _getArguments = function (func) {
        //This regex is from require.js
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var args = func.toString().match(FN_ARGS)[1].split(',');
        if (args[0] === "") {
            return [];
        }
        return args;
    };

    return {
        add: add,
        get: get
    };

})();

