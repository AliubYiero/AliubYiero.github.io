/**
 * 8.自定义类.js
 * created by 2023/9/29
 * @file FILE_NAME
 * @author  Yiero
 * */

class Type {
	[Symbol.toStringTag] = 'Type';
}

console.log( Object.prototype.toString.call( new Type() ) );
// -> [object Type]
