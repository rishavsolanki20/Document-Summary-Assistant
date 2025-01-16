import * as React from 'react';
import { render } from '@testing-library/react';

import { FileUploader } from '..';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

describe('<FileUploader  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<FileUploader />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
