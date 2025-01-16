/**
 *
 * Asynchronously loads the component for SummaryPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SummaryPage = lazyLoad(
  () => import('./index'),
  module => module.SummaryPage,
);
