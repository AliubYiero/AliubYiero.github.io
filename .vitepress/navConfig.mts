import type { DefaultTheme } from 'vitepress';
import { getDocsList } from './getDocsList.ts';
import { statSync } from 'fs';


/**
 * 读取 docs 目录下的所有文件, 生成 DefaultTheme.NavItemWithChildren 数组
 */
const getNavItems = (): DefaultTheme.NavItemWithLink[] => {
	const docsList = getDocsList();

	return docsList.tags
		.filter( item => item )
		.map( item => {
			const link = typeof item.children[ 0 ] === 'string'
				? `/${ item.tag }/${ item.children[ 0 ] }`
				: `/${ item.tag }/${ item.children[ 0 ].tag }/${ item.children[ 0 ].children[ 0 ] }`;
			return {
				text: item.tag,
				link: link,
			}
		} );
};

const blogItems = getNavItems();
// console.debug( 'blogItems', blogItems );
export const navConfig: DefaultTheme.NavItem[] = [
	{
		text: '首页',
		link: '/',
	},
	{
		text: 'Blog',
		items: blogItems,
	},
];
