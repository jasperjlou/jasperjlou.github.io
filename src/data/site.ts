export const SITE = {
  title: "JasperLou's Journey of CS",
  shortTitle: 'JasperLou',
  description: 'JasperLou 的计算机科学学习、工程实践与全人助手开发记录。',
  author: 'JiaRUI Lou',
  email: '125090445@link.cuhk.edu.cn',
  github: 'https://github.com/jasperjlou',
  url: 'https://jasperjlou.me',
};

export const NAV_ITEMS = [
  { href: '/', label: '首页', eyebrow: 'Home' },
  { href: '/projects/', label: '项目', eyebrow: 'Projects' },
  { href: '/notes/', label: '文章', eyebrow: 'Notes' },
  { href: '/about/', label: '关于', eyebrow: 'About' },
];

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);

export const normalizeList = (value: string | string[]) =>
  Array.isArray(value) ? value : value ? [value] : [];

export const toTaxonomySlug = (value: string) =>
  value.trim().replace(/\s+/g, '-');

export const postPath = (post: { data: { date: Date; slug: string } }) => {
  const year = post.data.date.getUTCFullYear();
  const month = String(post.data.date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(post.data.date.getUTCDate()).padStart(2, '0');
  return `/${year}/${month}/${day}/${post.data.slug}/`;
};
