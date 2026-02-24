import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import {
  ToastContainer,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  setToastRef,
} from '../../../components/common/Toast';

describe('Toast Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ToastContainer without errors', () => {
    const ref = React.createRef<any>();
    const { container } = render(<ToastContainer ref={ref} />);
    expect(container).toBeTruthy();
  });

  it('displays success toast message', async () => {
    const ref = React.createRef<any>();
    const { getByText } = render(<ToastContainer ref={ref} />);

    setToastRef(ref);
    showSuccessToast('Operation successful');

    await waitFor(() => {
      expect(getByText('Operation successful')).toBeTruthy();
    });
  });

  it('displays error toast message', async () => {
    const ref = React.createRef<any>();
    const { getByText } = render(<ToastContainer ref={ref} />);

    setToastRef(ref);
    showErrorToast('An error occurred');

    await waitFor(() => {
      expect(getByText('An error occurred')).toBeTruthy();
    });
  });

  it('displays warning toast message', async () => {
    const ref = React.createRef<any>();
    const { getByText } = render(<ToastContainer ref={ref} />);

    setToastRef(ref);
    showWarningToast('Warning message');

    await waitFor(() => {
      expect(getByText('Warning message')).toBeTruthy();
    });
  });

  it('displays info toast message', async () => {
    const ref = React.createRef<any>();
    const { getByText } = render(<ToastContainer ref={ref} />);

    setToastRef(ref);
    showInfoToast('Info message');

    await waitFor(() => {
      expect(getByText('Info message')).toBeTruthy();
    });
  });

  it('can display multiple toasts', async () => {
    const ref = React.createRef<any>();
    const { getByText } = render(<ToastContainer ref={ref} />);

    setToastRef(ref);
    showSuccessToast('First toast');
    showErrorToast('Second toast');

    await waitFor(() => {
      expect(getByText('First toast')).toBeTruthy();
      expect(getByText('Second toast')).toBeTruthy();
    });
  });

  it('renders close button for toast dismissal', async () => {
    const ref = React.createRef<any>();
    const { getByText, queryByText } = render(<ToastContainer ref={ref} />);

    setToastRef(ref);
    showSuccessToast('Dismissible toast');

    await waitFor(() => {
      expect(getByText('Dismissible toast')).toBeTruthy();
    });

    // Toast should have a close button (×)
    const closeButton = getByText('×');
    expect(closeButton).toBeTruthy();
  });
});
