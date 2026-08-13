import type { Collection } from 'tinacms';

export const homeCollection: Collection = {
  name: 'home',
  label: '首页',
  path: 'src/content/home',
  format: 'json',
  ui: {
    allowedActions: { create: false, delete: false },
    router: () => '/',
  },
  fields: [
    {
      name: 'seoTitle',
      label: '浏览器标题',
      type: 'string',
      isTitle: true,
      required: true,
    },
    {
      name: 'seoDescription',
      label: '搜索摘要',
      type: 'string',
      required: true,
      ui: { component: 'textarea' },
    },
    {
      name: 'sections',
      label: '首页区块',
      type: 'object',
      list: true,
      ui: { visualSelector: true },
      templates: [
        {
          name: 'hero',
          label: '首页开场',
          fields: [
            { name: 'eyebrow', label: '上方小字', type: 'string', required: true },
            { name: 'titleFirst', label: '标题第一行', type: 'string', required: true },
            { name: 'titleAccent', label: '标题强调词', type: 'string', required: true },
            { name: 'titleLast', label: '标题结尾', type: 'string', required: true },
            { name: 'lead', label: '中文介绍', type: 'string', required: true, ui: { component: 'textarea' } },
            { name: 'aside', label: '右侧英文介绍', type: 'string', required: true, ui: { component: 'textarea' } },
            {
              name: 'facts',
              label: '右侧信息',
              type: 'object',
              list: true,
              fields: [
                { name: 'label', label: '标签', type: 'string', required: true },
                { name: 'value', label: '内容', type: 'string', required: true },
              ],
            },
          ],
        },
        {
          name: 'featuredProject',
          label: '推荐项目',
          fields: [
            { name: 'eyebrow', label: '上方小字', type: 'string', required: true },
            { name: 'titleFirst', label: '标题第一行', type: 'string', required: true },
            { name: 'titleLast', label: '标题第二行', type: 'string', required: true },
            { name: 'intro', label: '项目介绍', type: 'string', required: true, ui: { component: 'textarea' } },
          ],
        },
        {
          name: 'latestNotes',
          label: '最近文章',
          fields: [
            { name: 'eyebrow', label: '上方小字', type: 'string', required: true },
            { name: 'titleFirst', label: '标题第一行', type: 'string', required: true },
            { name: 'titleLast', label: '标题第二行', type: 'string', required: true },
            { name: 'intro', label: '文章区介绍', type: 'string', required: true, ui: { component: 'textarea' } },
            { name: 'linkLabel', label: '查看全部按钮', type: 'string', required: true },
          ],
        },
      ],
    },
  ],
};
