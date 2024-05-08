import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'labavrplatform',
			locales: {
				root: {
					label: 'Русский',
					lang: 'ru',
				},
			},
			social: {
				github: 'https://github.com/dx3mod/LabAvrPlatform',
			},
			sidebar: [
				{
					label: 'Первые шаги',
					items: [
						{ label: 'Установка', link: "/guide/installation" },
						{ label: 'Первый проект', link: "/guide/first-project" },
						{ label: 'Сторонние библиотеки', link: "/guide/import-library" },
					]
				},
				// {
				// 	label: 'Guides',
				// 	items: [
				// 		// Each item here is one entry in the navigation menu.
				// 		{ label: 'Example Guide', link: '/guides/example/' },
				// 	],
				// },
				// {
				// 	label: 'Reference',
				// 	autogenerate: { directory: 'reference' },
				// },
			],
			customCss: [
				"./src/styles/custom.css"
			],
			
		}),
	],
});
