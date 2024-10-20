import { defineConfig } from 'vitepress';
import { navConfig } from './navConfig.mjs';
import { sidebarConfig } from './sidebarConfig.mjs';


// https://vitepress.dev/reference/site-config
export default defineConfig( {
	title: '叁仟月\'s 个人博客',
	description: '随便写写',
	head: [
		['link', { rel: 'icon', href: '/logo.png' }]
	],
	// cleanUrls: true,
	
	// rewrites: {
	// 	'docs/:pkg/(.*)': ':pkg/index.md'
	// },
	
	base: '/blog/',
	srcDir: 'docs',
	outDir: '.vitepress/dist',
	
	themeConfig: {
		logo: '/logo.png',
		
		// https://vitepress.dev/reference/default-theme-config
		nav: navConfig,
		sidebar: sidebarConfig,
		
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/AliubYiero' },
			// { icon: 'bilibili', link: 'https://space.bilibili.com/12548410' },
		],
	},
} );
