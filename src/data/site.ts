export const SITE = {
  title: "JasperLou's Journey of CS",
  shortTitle: 'JasperLou',
  description: 'Jasper Jiarui Lou — computer science, machine learning, agent systems, and research-oriented engineering projects.',
  author: 'Jasper Jiarui Lou',
  email: '125090445@link.cuhk.edu.cn',
  github: 'https://github.com/jasperjlou',
  url: 'https://jasperjlou.me',
};

export const NAV_ITEMS = [
  { href: '/', label: 'Home', eyebrow: 'Home' },
  { href: '/projects/', label: 'Projects', eyebrow: 'Projects' },
  { href: '/notes/', label: 'Notes', eyebrow: 'Notes' },
  { href: '/about/', label: 'About', eyebrow: 'About' },
];

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', {
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
