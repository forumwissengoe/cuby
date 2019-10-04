"use strict";
exports.__esModule = true;
function cache(target, propertyKey, descriptor) {
    var origValue = descriptor.value;
    var cache = new Map();
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        for (var _a = 0, _b = cache.keys(); _a < _b.length; _a++) {
            var k = _b[_a];
            if (JSON.stringify(k) === JSON.stringify(args)) {
                return cache.get(k);
            }
        }
        var result = origValue.apply(this, args);
        cache.set(args, result);
        return result;
    };
}
exports.cache = cache;
var callNumber = 0x1;
function log(target, propertyKey, descriptor) {
    var origValue = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var cn = callNumber++;
        console.log("Call\t[" + cn + "]: " + propertyKey + "(" + args.join(", ") + ")");
        var start = new Date().getTime();
        var result = origValue.apply(this, args);
        console.log("Result\t[" + cn + "]: " + result + " \t(time: " + (new Date().getTime() - start) + " ms)");
        return result;
    };
}
exports.log = log;
function watch(watcher) {
    return function (target, key) {
        var val = target[key];
        var getter = function () { return val; };
        var setter = function (next) { val = next; watcher(val); };
        Object.defineProperty(target, key, { get: getter, set: setter });
    };
}
exports.watch = watch;
