import { DefaultTheme } from 'vitepress';
import { getDocsList } from './getDocsList.ts';

const getSidebarItems = (): DefaultTheme.SidebarMulti => {
	const sidebarItemList: DefaultTheme.SidebarMulti = {};
	
	const docsList = getDocsList();
	for ( let tagItem of docsList.tags ) {
		sidebarItemList[ tagItem.tag ] = [];
		const sidebarItem: DefaultTheme.SidebarItem[] = sidebarItemList[ tagItem.tag ] as DefaultTheme.SidebarItem[];
		
		for ( let childItem of tagItem.children ) {
			let { tag } = tagItem;
			if ( typeof childItem !== 'string' ) {
				tag = childItem.tag;
			}
			
			let tagSidebar = sidebarItem.find( item => item.text === tag );
			if ( !tagSidebar ) {
				tagSidebar = {
					text: tag,
					items: [],
					collapsed: false,
				}
				sidebarItem.push( tagSidebar );
			}
			
			if (typeof childItem === 'string') {
				// @ts-ignore
				tagSidebar.items.push( {
					text: childItem,
					link: `/${ tagItem.tag }/${ childItem }`,
				} );
				continue;
			}
			childItem.children.forEach( item => {
				// @ts-ignore
				tagSidebar.items.push( {
					text: item,
					// @ts-ignore
					link: `/${ tagItem.tag }/${ childItem.tag }/${ item }`,
				} );
			})
			
		}
	}
	
	return sidebarItemList;
};

const sidebarItems = getSidebarItems();
// console.debug('sidebarItems', JSON.stringify(sidebarItems, null, '\t'));
/**
 * 文章侧边栏配置
 */
export const sidebarConfig: DefaultTheme.Sidebar = sidebarItems;
