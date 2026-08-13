import type { Collection } from 'tinacms';

export const projectCollection: Collection = {
  name: 'project',
  label: '项目',
  path: 'src/content/projects',
  format: 'md',
  ui: { router: ({ document }) => `/projects/${document._sys.filename}/` },
  fields: [
    { name: 'title', label: '项目名称', type: 'string', isTitle: true, required: true },
    { name: 'englishTitle', label: '英文名称', type: 'string', required: true },
    { name: 'order', label: '项目顺序', type: 'number' },
    { name: 'status', label: '当前状态', type: 'string', required: true },
    { name: 'statusDetail', label: '状态说明', type: 'string', required: true, ui: { component: 'textarea' } },
    { name: 'description', label: '首页介绍', type: 'string', required: true, ui: { component: 'textarea' } },
    { name: 'summary', label: '项目列表摘要', type: 'string', required: true, ui: { component: 'textarea' } },
    { name: 'liveUrl', label: '产品网址', type: 'string', required: true },
    { name: 'githubUrl', label: 'GitHub 网址', type: 'string', required: true },
    { name: 'launched', label: '开始时间', type: 'string', required: true },
    { name: 'lastVerified', label: '最近核验日期', type: 'datetime', required: true },
    { name: 'heroImage', label: '项目主图', type: 'image', required: true },
    { name: 'heroAlt', label: '主图说明', type: 'string', required: true },
    {
      name: 'metrics',
      label: '项目数字',
      type: 'object',
      list: true,
      fields: [
        { name: 'value', label: '数字', type: 'string', required: true },
        { name: 'label', label: '名称', type: 'string', required: true },
        { name: 'note', label: '补充说明', type: 'string' },
      ],
    },
    {
      name: 'features',
      label: '功能',
      type: 'object',
      list: true,
      fields: [
        { name: 'index', label: '编号', type: 'string', required: true },
        { name: 'title', label: '名称', type: 'string', required: true },
        { name: 'description', label: '说明', type: 'string', required: true, ui: { component: 'textarea' } },
      ],
    },
    { name: 'principles', label: '使用原则', type: 'string', list: true },
    { name: 'stack', label: '技术栈', type: 'string', list: true },
    { name: 'body', label: '项目正文', type: 'rich-text', isBody: true },
  ],
};
