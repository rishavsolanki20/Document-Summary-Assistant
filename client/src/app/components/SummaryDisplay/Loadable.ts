/**
 *
 * Asynchronously loads the component for SummaryDisplay
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SummaryDisplay = lazyLoad(
  () => import('./index'),
  module => module.SummaryDisplay,
);
