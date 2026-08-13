import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import type { HomeQuery } from '../../../tina/__generated__/types';
import HomeBody from '@/components/tina/HomeBody.astro';
import { getHome, type CmsHome } from './data';

export const islands: IslandRegistry = {
  home: {
    fetch: () => getHome(),
    component: HomeBody,
    wrapper: { tag: 'div' },
    propsFromData: (result) => ({
      data: (result as QueryResult<HomeQuery>).data?.home as CmsHome | undefined,
    }),
  },
};
