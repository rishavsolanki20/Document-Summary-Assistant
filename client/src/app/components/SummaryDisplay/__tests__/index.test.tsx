import * as React from 'react';
import { render } from '@testing-library/react';

import { SummaryDisplay } from '..';

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

describe('<SummaryDisplay  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<SummaryDisplay />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
