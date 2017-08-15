/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*
 *  Object 原型
 */
const OP = Object.prototype;
/*
 *  需要重写的数组方法 OAR 是 overrideArrayMethod 的缩写
 */
const OAM = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

class Jsonob {
    constructor(obj, callback) {
        if (OP.toString.call(obj) !== '[object Object]') {
            console.error('This parameter must be an object：' + obj);
        }
        this.$callback = callback;
        this.observe(obj);
    }

    observe(obj, path) {
        // 如果发现 监测的对象是数组的话就要调用 overrideArrayProto 方法
        if (OP.toString.call(obj) === '[object Array]') {
            this.overrideArrayProto(obj, path);
        }
        Object.keys(obj).forEach(function (key, index, keyArray) {
            var oldVal = obj[key];
            var pathArray = path && path.slice(0);
            console.log(pathArray);
            if (pathArray) {
                pathArray.push(key);
            } else {
                pathArray = [key];
            }

            Object.defineProperty(obj, key, {
                get: function () {
                    return oldVal;
                },
                set: function (newVal) {
                    if (oldVal !== newVal) {
                        if (OP.toString.call(newVal) === '[object Object]' || OP.toString.call(newVal) === '[object Array]') {
                            this.observe(newVal, pathArray);
                        }
                        this.$callback(newVal, oldVal, pathArray);
                        oldVal = newVal;
                    }
                }.bind(this)
            });

            if (OP.toString.call(obj[key]) === '[object Object]' || OP.toString.call(obj[key]) === '[object Array]') {
                this.observe(obj[key], pathArray);
            }
        }, this);
    }

    overrideArrayProto(array, path) {
        // 保存原始 Array 原型
        var originalProto = Array.prototype,

        // 通过 Object.create 方法创建一个对象，该对象的原型就是Array.prototype
        overrideProto = Object.create(Array.prototype),
            self = this,
            result;
        // 遍历要重写的数组方法
        Object.keys(OAM).forEach(function (key, index, array) {
            var method = OAM[index],
                oldArray = [];
            // 使用 Object.defineProperty 给 overrideProto 添加属性，属性的名称是对应的数组函数名，值是函数
            Object.defineProperty(overrideProto, method, {
                value: function () {
                    oldArray = this.slice(0);

                    var arg = [].slice.apply(arguments);
                    // 调用原始 原型 的数组方法
                    result = originalProto[method].apply(this, arg);
                    // 对新的数组进行监测
                    self.observe(this, path);
                    // 执行回调
                    self.$callback(this, oldArray, path);

                    return result;
                },
                writable: true,
                enumerable: false,
                configurable: true
            });
        }, this);

        // 最后 让该数组实例的 __proto__ 属性指向 假的原型 overrideProto
        array.__proto__ = overrideProto;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Jsonob;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__myob_js__ = __webpack_require__(0);


//定义一个变化通知的回调函数
var cb = function (newVal, oldVal, path) {
    alert('新值：' + newVal + " --- " + '旧值：' + oldVal + '  --  路径：' + path);
};
//定义一个普通对象作为数据类型
var data = {
    a: 100,
    level1: {
        b: "abc",
        c: [1, 2, 3],
        level2: {
            d: 666
        }
    }
    // 实例化一个监测对象，去监测数据，并在数据发生改变的时候作出反应
};var j = new __WEBPACK_IMPORTED_MODULE_0__myob_js__["a" /* default */](data, cb);

console.log(j);

data.a = 250;
data.level1.b = 'sss';
data.level1.c.push(4);
data.level1.level2.d = 'msn';
console.log(data);

/***/ })
/******/ ]);