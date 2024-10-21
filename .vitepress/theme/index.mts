import DefaultTheme from 'vitepress/theme';
import './style.css';
import mediumZoom from 'medium-zoom';
import { nextTick, onMounted, watch } from 'vue';
import { useRoute } from 'vitepress';

export default {
	extends: DefaultTheme,
	setup() {
		const route = useRoute();
		const initZoom = () => {
			// mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
			// @ts-ignore
			mediumZoom( '.main img', { background: 'var(--vp-c-bg)' } ); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
		};
		onMounted( () => {
			initZoom();
		} );
		watch(
			() => route.path,
			() => nextTick( () => initZoom() ),
		);
	},
};
