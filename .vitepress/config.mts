import { defineConfig, defineConfigWithTheme } from 'vitepress';
import vitepressHelper, { config } from '@huyikai/vitepress-helper';

const vitepressHelperConfig = {
	directory: 'docs',
	collapsible: true
};

// https://vitepress.dev/reference/site-config
const vitepressConfig =  defineConfig( {
	title: '叁仟月\'s 个人博客',
	description: '随便写写',
	head: [
		['link', { rel: 'icon', href: '/logo.png' }]
	],
	// cleanUrls: true,
	
	// rewrites: {
	// 	'docs/:pkg/(.*)': ':pkg/index.md'
	// },
	
	srcDir: 'docs',
	outDir: '.vitepress/dist',
	
	themeConfig: {
		siteTitle: '叁仟月\'s 个人博客',
		logo: '/logo.png',
		
		// https://vitepress.dev/reference/default-theme-config
		// nav: navConfig,
		// sidebar: sidebarConfig,
		
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/AliubYiero/AliubYiero.github.io' },
			// { icon: 'bilibili', link: 'https://space.bilibili.com/12548410' },
		],
		
		footer: {
			message: 'Built with VitePress, Vitepress-helper (MIT License)',
			copyright: '© 2024 叁仟月. All rights reserved.',
		}
	},
} );

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
