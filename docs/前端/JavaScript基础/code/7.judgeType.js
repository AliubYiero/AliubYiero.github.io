/**
 * 7.judgeType.js
 * created by 2023/9/29
 * @file FILE_NAME
 * @author  Yiero
 * */

/**
 * 判断 value 的类型是否是给定的 type
 *
 * @param {string} type - 预期想要的类型.
 * @param {any} value - 需要判断的值.
 * @returns {boolean} - 如果传入的 value 是需要的类型, 则输出 true, 否则输出 false
 */
function judgeType( type, value ) {
	return Object.prototype.toString.call( value ).slice( 8, -1 ).toLowerCase() === type.toLowerCase();
}

console.log( judgeType( 'array', [ 1, 2, 3 ] ) );
console.log( judgeType( 'array', {} ) );

const isArray = judgeType.bind( null, 'array' );
const isSet = judgeType.bind( null, 'set' );
const isMap = judgeType.bind( null, 'map' );
const isMath = judgeType.bind( null, 'math' );
const isDate = judgeType.bind( null, 'date' );

console.log( isDate( new Date() ) )
console.log( isSet( new Set() ) )
console.log( isMap( new Map() ) )
console.log( isMath( Math ) )
