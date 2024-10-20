import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';

/**
 * 接口: docs 目录
 */
namespace IDocs {
	
	export interface Item {
		root: string;
		tags: Tags[];
	}
	
	/**
	 * 标签下的所有文章
	 */
	export interface Tags {
		tag: string;
		children: ( string | Omit<Tags, 'children'> & { children: string[] } )[];
	}
}

/**
 * 获取所有的文章
 */
export const getDocsList = (): IDocs.Item => {
	const docsList: IDocs.Item = {
		root: resolve( __dirname, '../', 'docs' ),
		tags: [],
	};
	
	// 读取 docs 下的所有标签目录
	const docsDirPath = docsList.root;
	const tagDirs = readdirSync( docsDirPath );
	
	// 遍历 docs 的所有标签目录, 获取其中的第一个 md 文件作为目标首页索引
	for ( const tag of tagDirs ) {
		// 读取 docs/<tag> 目录下的所有文件
		const docsTagDirPath = resolve( __dirname, '../', 'docs', tag );
		
		// 判断 docs/<tag> 是否是目录, 如果不是, 则不使用该标签
		if ( !statSync( docsTagDirPath ).isDirectory() || tag === 'public' ) continue;
		docsList.tags.push( {
			tag: tag,
			children: [],
		} );
		
		const docsFiles = readdirSync( docsTagDirPath );
		for ( const childTag of docsFiles ) {
			const childTagPath = resolve( docsTagDirPath, childTag );
			const childTagStat = statSync( childTagPath );
			if ( childTagStat.isFile() ) {
				docsList.tags[ docsList.tags.length - 1 ].children.push( childTag );
			}
			else if ( childTagStat.isDirectory() ) {
				docsList.tags[ docsList.tags.length - 1 ].children.push( {
					tag: childTag,
					children: readdirSync( childTagPath ),
				} );
			}
		}
	}
	
	// console.debug(JSON.stringify(docsList, null, '\t'));
	return docsList;
};
