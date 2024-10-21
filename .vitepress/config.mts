import { defineConfig, defineConfigWithTheme } from 'vitepress';
import vitepressHelper, { config } from '@huyikai/vitepress-helper';

/*
* vitepress-helper 配置
* */
const vitepressHelperConfig = {
	directory: 'docs',
	collapsible: true
};

/*
* VitePress 配置
*
* @tutorial https://vitepress.dev/reference/site-config
* */
const vitepressConfig =  defineConfig( {
	title: '叁仟月\'s 个人博客',
	description: '随便写写',
	
	/*
	* 顶部信息栏
	* */
	head: [
		// 网站图片
		['link', { rel: 'icon', href: '/logo.png' }]
	],
	
	// cleanUrls: true,
	// rewrites: {
	// 	'docs/:pkg/(.*)': ':pkg/index.md'
	// },
	
	srcDir: 'docs',
	outDir: '.vitepress/dist',
	
	/*
	* 主题配置
	* */
	themeConfig: {
		/*
		* 顶部标题设置
		* */
		siteTitle: '叁仟月\'s 个人博客',
		logo: '/logo.png',
		
		// https://vitepress.dev/reference/default-theme-config
		// nav: navConfig,
		// sidebar: sidebarConfig,
		
		/*
		* 社交账号信息
		* */
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/AliubYiero/AliubYiero.github.io' },
			// { icon: 'bilibili', link: 'https://space.bilibili.com/12548410' },
		],
		
		/*
		* 底部信息栏
		* */
		footer: {
			message: 'Built with VitePress, Vitepress-helper (MIT License)',
			copyright: '© 2024 叁仟月. All rights reserved.',
		}
	},
} );

/**
 * 导出配置
 */
export default async () => {
	const vitepressHelperInstance = await vitepressHelper({
		...vitepressHelperConfig,
		...vitepressConfig
	});
	return defineConfigWithTheme({
		extends: config,
		...vitepressHelperInstance,
		footer: void 0,
	});
};
