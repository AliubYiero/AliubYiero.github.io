# 原生 JavaScript 实现字符串分词

## 适用场景

只需要对字符串进行简单的分词, 不指定特定词组的情况. 更复杂的情况可能就需要用到一些库和词典了.

对于中文, 只能划分出一些简单的词组, 比较生僻的词组就无法识别了, 不过正常使用是足够的.

## Intl.Segmenter 类

> **`Intl.Segmenter()`**构造函数会创建一个 [`Intl.Segmenter`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)对象, 该对象能够根据语言进行文本分割.

通过 `const segmenter = new Intl.Segmenter()`实例化一个 `Intl.Segmenter` 对象, 创建一个分词器. 使用 `segmenter`实例可以调用 `.segment( str )` 方法创建一个迭代器对象,该迭代器对象的 `.segment` 属性就是分割出来的文本.

下面是基础演示代码:

```js
// 创建一个中文分词器 (按字分段)
const ChineseGraphemeSegment = new Intl.Segmenter(
	// 语言区域设置. 'zh' 是中文
	'zh',
	{
		// 文本分割边界配置, 'grapheme' 是按字分割 (默认值)
		granularity: 'grapheme',
	} );

// 字符串
const toSplitString = `平江波暖鸳鸯语，两两钓船归极浦。芦洲一夜风和雨，飞起浅沙翘雪鹭。`;

// 使用分词器分割字符串
const splitStringList =
	// 将返回出来的迭代器对象转换成数组
	Array.from( ChineseGraphemeSegment.segment( toSplitString ) )
		// 从数组中的每个迭代器对象中提取出分割完的字符串
		 .map( item => item.segment );

console.log( splitStringList );
/* 输出
[
  '平', '江', '波', '暖', '鸳',
  '鸯', '语', '，', '两', '两',
  '钓', '船', '归', '极', '浦',
  '。', '芦', '洲', '一', '夜',
  '风', '和', '雨', '，', '飞',
  '起', '浅', '沙', '翘', '雪',
  '鹭', '。'
]
*/
```

### 构造函数

#### 参数

- [`locales`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#locales):
  *可选参数,* 语言标记字符串. 默认为本地语言(比如中文区就是中文, 英文区就是英文), 常用字符串有:

  > - `'zh'`: 中文
  > - `'en'`: 英文
  > - `'jp'`: 日文

- [`options`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#options):
  *可选参数*, 配置对象.

    - [`options.granularity`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#granularity):
      文本分割的词语边界, 有三个可选值:

      > - `'grapheme'`: 按**字**分割 (**默认**).
      > - `'word'`: 按**词**分割.
      > - `'sentence'`: 按**句**分割.

    - [`options.localeMatcher`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#localematcher):
      将要使用的语言区域匹配算法:

      > - `'best fit'`:
      >   运行时可能会选择一个可能比查找算法的结果更加合适的语言区域 (**默认**).
      > - `'lookup'`:使用 [BCP 47 查找算法](https://datatracker.ietf.org/doc/html/rfc4647#section-3.4)来从 `locales` 参数中选择语言区域。对于 `locales`参数中的每一个语言区域，会返回第一个运行时支持的语言区域（有可能会移除用于限制区域的子标记，来找到一个支持的语言区域。换句话说，如果运行时支持 `"de"`但不支持 `"de-CH"`，用户传入的 `"de-CH"` 可能就会以 `"de"`为结果进行使用）。

### `segment()` 实例方法

```ts
Intl.Segmenter.prototype.segment( inputString:string):
Segments;
```

#### 参数

- `inputString`: 输入的**字符串**.

#### 返回值

- `Segments`: `SegmentData`类型的[迭代器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Iterator)对象, 有四个属性:
    - `segment`: 
      当前分割文本.
    - `index`: 
      当前分割文本位于 `inputString` 字符串的开始索引.
    - `input`: 
      原始输入值, 也就是 `inputString` 的值.
    - `isWordLike`: *可选参数*.
      如果构造函数参数 `options.granularity = 'word'` 时会是 `true`,其它情况下不会出现该属性.

#### 输出 `Segments`

##### 通过数组输出

> 如果不懂迭代器对象该如何处理, 直接使用本方法即可.

```js
// 创建一个中文分词器 (按词组分段)
const ChineseWordSegment = new Intl.Segmenter( 'zh', { granularity: 'word' } );
const inputString = '平江波暖鸳鸯语，两两钓船归极浦。';

// 将迭代器对象转成对象数组
let segmentList = Array.from( ChineseWordSegment.segment( inputString ) );
// 通过 `array.map()` 方法将分割文本提取出来.
segmentList = segmentList.map( item => item.segment );

// 输出
console.log( segmentList );
/*
[
  '平江', '波',   '暖',
  '鸳鸯', '语',   '，',
  '两两', '钓船', '归',
  '极',   '浦',   '。'
]
*/
```

##### 通过 `for...of...` 输出

```js
// 创建一个中文分词器 (按句子分段)
const ChineseSentenceSegment = new Intl.Segmenter( 'zh', {
	granularity: 'sentence',
} );

// 字符串
const toSplitString = `平江波暖鸳鸯语，两两钓船归极浦。芦洲一夜风和雨，飞起浅沙翘雪鹭。渔灯明远渚，兰棹今宵何处？罗袂从风轻举，愁杀采莲女！`;

// 使用分词器分割字符串
let splitStringList = [];
for ( const segmentData of
	ChineseSentenceSegment.segment( toSplitString ) ) {
	splitStringList.push( segmentData.segment );
}

// 输出
console.log( splitStringList );
/*
[                                    
  '平江波暖鸳鸯语，两两钓船归极浦。',
  '芦洲一夜风和雨，飞起浅沙翘雪鹭。',
  '渔灯明远渚，兰棹今宵何处？',      
  '罗袂从风轻举，愁杀采莲女！'       
] 
*/
```

### 注意项

1. **空白字符**(空格, 换行符, 制表符)同样会被视为单词一个词语边界,
   如有必要需要做过滤处理.
2. **按词分组**的情况下, 标点符号也会被视为单独一个词语边界.

## 封装 `Intl.Segmenter` 类, 实现一个中文分词器

### 接口介绍

`ChineseSegmenter` 类提供了四个静态方法:

- `segmentGrapheme( inputString: string, options?: { filter: boolean; } ): Array<string>`:
  输出按**字**分词的**字符串数组**.
- `segmentWord( inputString: string, options?: { filter: boolean; } ): Array<string>`:
  输出按**词**分词的**字符串数组**.
- `segmentSentence( inputString: string, options?: { filter: boolean; } ): Array<string>`:
  输出按**句**分词的**字符串数组**.
- `segment( inputString: string, options?: { filter: boolean; } ): Array<string[]>`:
  输出按**词**分词, 每个句子的分段的**字符串数组**.

**参数**

- `inputString: string`: 输入的文本字符串.
- `options?: { filter: boolean; }`: *可选参数*. 开启 `filter`
  属性则会把分词后的空白字符过滤掉, 默认开启.

> ***interface.d.ts***

```ts
declare class ChineseSegmenter extends Intl.Segmenter {
	/**
	 * 将输入的文本分段成以句子为单位的数组
	 *
	 * @param {string} input
	 *
	 * @param { Object } [options]
	 * @param { Boolean } options.filter 是否过滤空白字符
	 *
	 * @Return {Array<string>} 分词后的结果数组
	 * */
	static segmentSentence( input: string, options?: {
		filter: boolean;
	} ): Array<string>;
	
	/**
	 * 将输入的文本分段成以单词为单位的数组
	 *
	 * @param { string } input
	 *
	 * @param { Object } [options = {filter: true}]
	 * @param { Boolean } options.filter 是否过滤空白字符
	 *
	 * @return { Array<string> } 分词后的结果数组
	 */
	static segmentWord( input: string, options?: {
		filter: boolean;
	} ): Array<string>;
	
	/**
	 * 将输入的文本分段成以字为单位的数组
	 *
	 * @param {string} input
	 * @return {Array<string>} 分词后的结果数组
	 * */
	static segmentGrapheme( input: string ): Array<string>;
	
	/**
	 * 将输入的文本分段成以句子为单位的词组
	 *
	 * @param {string} input
	 * @return {Array<string[]>} 二维数组, 其中的每一个数组元素是一行句子分词的结果
	 * */
	static segment( input: string ): Array<string[]>;
}
```

### 代码实现

> ***JavaScript***

```js
class ChineseSegmenter extends Intl.Segmenter {
	/**
	 * 静态分句器实例
	 * @private
	 * */
	static #sentenceSegmentInstance = new ChineseSegmenter( {
		granularity: 'sentence',
	} );
	
	/**
	 * 静态分词器实例
	 * @private
	 * */
	static #wordSegmentInstance = new ChineseSegmenter( {
		granularity: 'word',
	} );
	
	/**
	 * 静态分字器实例
	 * @private
	 * */
	static #graphemeSegmentInstance = new ChineseSegmenter( {
		granularity: 'grapheme',
	} );
	
	/**
	 * 构造函数
	 * @param { Object } [options = {granularity: 'grapheme', localeMatcher: 'best fit'}] 选项
	 * @param { 'grapheme' | 'word' | 'sentence' } options.granularity 划分输入值边界的尺度
	 * @param { 'best fit' | 'lookup' } options.localeMatcher 将要使用的语言区域匹配算法
	 * @constructor
	 * */
	constructor( options = {
		granularity: 'grapheme',
		localeMatcher: 'best fit',
	} ) {
		super( 'zh', options );
	}
	
	/**
	 * 将输入的文本分段成以句子为单位的数组
	 *
	 * @param {string} inputString
	 *
	 * @param { Object } [options]
	 * @param { Boolean } options.filter 是否过滤空白字符
	 *
	 * @return {Array<string>} 分词后的结果数组
	 * */
	static segmentSentence( inputString, options = { filter: true } ) {
		return this.#formatSegmentData( this.#sentenceSegmentInstance.segment( inputString ), options.filter );
	}
	
	/**
	 * 将输入的文本分段成以单词为单位的数组
	 *
	 * @param { string } inputString
	 *
	 * @param { Object } [options = {filter: true}]
	 * @param { Boolean } options.filter 是否过滤空白字符
	 *
	 * @return { Array<string> } 分词后的结果数组
	 */
	static segmentWord( inputString, options = { filter: true } ) {
		return this.#formatSegmentData( this.#wordSegmentInstance.segment( inputString ), options.filter );
	}
	
	/**
	 * @private
	 * 将分词结果格式化为数组
	 *
	 * @param { Segments } segmentDataIterator
	 * @param { Boolean } filter 是否过滤空白字符
	 *
	 * @return { Array<string> } 格式化后的数组
	 * */
	static #formatSegmentData( segmentDataIterator, filter ) {
		return Array.from( segmentDataIterator )
		            .reduce( ( result, item ) => {
			            
			            // 如果当前字符不是空白字符
			            if ( !filter || !/^\s+$/.test( item.segment ) ) {
				            result.push( item.segment );
			            }
			            
			            return result;
		            }, [] );
	}
	
	/**
	 * 将输入的文本分段成以字为单位的数组
	 *
	 * @param {string} inputString
	 *
	 * @param { Object } [options = {filter: true}]
	 * @param { Boolean } options.filter 是否过滤空白字符
	 *
	 * @return {Array<string>} 分词后的结果数组
	 * */
	static segmentGrapheme( inputString, options = { filter: true } ) {
		return this.#formatSegmentData( this.#graphemeSegmentInstance.segment( inputString ), options.filter );
	}
	
	/**
	 * 将输入的文本分段成以句子为单位的词组
	 *
	 * @param {string} input
	 *
	 * @param { Object } [options = {filter: true}]
	 * @param { Boolean } options.filter 是否过滤空白字符
	 *
	 * @return {Array<string[]>} 二维数组, 其中的每一个数组元素是一行句子分词的结果
	 * */
	static segment( input, options = { filter: true } ) {
		// 先分句
		let sentenceList = this.segmentSentence( input );
		
		// 再分词
		const splitList = sentenceList.map( sentence => {
			let wordList = this.segmentWord( sentence, options );
			return wordList;
		} );
		
		return splitList;
	}
}
```

### 示例代码

```js
const str = ChineseSegmenter.segment( '使用 BCP 47 查找算法来从 locales 参数中选择语言区域。对于 locales 参数中的每一个语言区域，会返回第一个运行时支持的语言区域（有可能会移除用于限制区域的子标记，来找到一个支持的语言区域。换句话说，如果运行时支持 "de" 但不支持 "de-CH"，用户传入的 "de-CH" 可能就会以 "de" 为结果进行使用）。' );
console.log( str );
/* 输出
[
  [
    '使用', 'BCP',
    '47',   '查找',
    '算法', '来',
    '从',   'locales',
    '参数', '中',
    '选择', '语言',
    '区域', '。'
  ],
  [
    '对于', 'locales', '参数', '中的',
    '每',   '一个',    '语言', '区域',
    '，',   '会',      '返回', '第',
    '一个', '运行',    '时',   '支持',
    '的',   '语言',    '区域', '（',
    '有',   '可能',    '会',   '移除',
    '用于', '限制',    '区域', '的',
    '子',   '标记',    '，',   '来',
    '找到', '一个',    '支持', '的',
    '语言', '区域',    '。'
  ],
  [
    '换句话说', '，',   '如果', '运行',
    '时',       '支持', '"',    'de',
    '"',        '但',   '不',   '支持',
    '"',        'de',   '-',    'CH',
    '"',        '，',   '用户', '传',
    '入',       '的',   '"',    'de',
    '-',        'CH',   '"',    '可能',
    '就',       '会',   '以',   '"',
    'de',       '"',    '为',   '结果',
    '进行',     '使用', '）',   '。'
  ]
]
*/
```



### 附言

实现其它语言的分词器只需要将上述的 `ChineseSegmenter` 类中构造函数中的 `super( 'zh', options );` 中的 `'zh'` 成对应的语言即可, 比如英文分词器就是 `super( 'en', options );`. 

因为实现的是一个静态类所以没办法不同语言分别实例化出一个实例出来, 如果想要灵活切换不同语言的分词器, 把 `static` 删掉然后改一下构造函数和三个分词实例代码即可. 会编写类代码应该都能简单上手, 这里就不多赘述了. 

## 文档

> **`Intl`**对象下还有两个有意思的可能用得上的类: [Intl.ListFormat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat) 和 [Intl.NumberFormat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) . 有兴趣可以了解一下.

> - [Intl.Segmenter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
> - [语言区域识别和判定](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl#语言区域识别和判定)
> - [语言标记字符串手册](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)
> - [Intl.ListFormat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat)
> - [Intl.NumberFormat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) 