/**
 *
 * Asynchronously loads the component for TextExtraction
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TextExtraction = lazyLoad(
  () => import('./index'),
  module => module.TextExtraction,
);
