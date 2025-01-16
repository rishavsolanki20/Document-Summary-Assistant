/**
 *
 * Asynchronously loads the component for FileUploader
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FileUploader = lazyLoad(
  () => import('./index'),
  module => module.FileUploader,
);
