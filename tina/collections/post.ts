import type { Collection } from 'tinacms';

const postRoute = (document: any) => {
  const rawDate = document?._values?.date;
  const slug = document?._values?.slug || document?._sys?.filename;
  const date = rawDate ? new Date(rawDate) : null;
  if (!date || Number.isNaN(date.valueOf()) || !slug) return '/notes/';
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `/${year}/${month}/${day}/${slug}/`;
};

export const postCollection: Collection = {
  name: 'post',
  label: '文章',
  path: 'source/_posts',
  format: 'md',
  ui: { router: ({ document }) => postRoute(document) },
  fields: [
    { name: 'title', label: '标题', type: 'string', isTitle: true, required: true },
    { name: 'date', label: '发布日期', type: 'datetime', required: true },
    { name: 'updated', label: '更新日期', type: 'datetime' },
    { name: 'slug', label: '网址名称', type: 'string', required: true },
    { name: 'description', label: '摘要', type: 'string', required: true, ui: { component: 'textarea' } },
    { name: 'categories', label: '分类', type: 'string', list: true },
    { name: 'tags', label: '标签', type: 'string', list: true },
    { name: 'project', label: '所属项目', type: 'string' },
    { name: 'stage', label: '项目阶段', type: 'string' },
    { name: 'order', label: '项目内顺序', type: 'number' },
    { name: 'featured', label: '推荐文章', type: 'boolean' },
    { name: 'draft', label: '草稿', type: 'boolean' },
    { name: 'body', label: '正文', type: 'rich-text', isBody: true },
  ],
};
