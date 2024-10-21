/**
 * 10.更改原生类的值.js
 * created by 2023/9/29
 * @file FILE_NAME
 * @author  Yiero
 * */

Array.prototype[Symbol.toStringTag] = 'NotArray';

console.log( Object.prototype.toString.call( [ 1, 2, 3 ] ) );
// -> [object NotArray]
