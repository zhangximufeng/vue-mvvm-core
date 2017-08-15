import Jsonob from './myob.js'

//定义一个变化通知的回调函数
var cb = function (newVal, oldVal,path) {
    alert('新值：'+newVal + " --- " + '旧值：'+oldVal+'  --  路径：'+path)
}
//定义一个普通对象作为数据类型
var data = {
    a: 100,
    level1: {
        b: "abc",
        c: [
            1, 2, 3
        ],
        level2: {
            d: 666
        }
    }
}
// 实例化一个监测对象，去监测数据，并在数据发生改变的时候作出反应
var j = new Jsonob(data, cb);

console.log(j)

data.a = 250;
data.level1.b = 'sss';
data.level1.c.push(4)
data.level1.level2.d = 'msn';
console.log(data)