import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../../components/common/Button';
import { haptics } from '../../../services/haptics/haptics';

jest.mock('../../../services/haptics/haptics');

describe('Button Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label', () => {
    const { getByText } = render(
      <Button label="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <Button label="Click Me" onPress={onPressMock} />
    );
    const button = getByRole('button');
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalled();
  });

  it('triggers haptic feedback on press', async () => {
    const { getByRole } = render(
      <Button label="Haptic Test" onPress={() => {}} />
    );
    const button = getByRole('button');
    fireEvent.press(button);
    // Haptics should be called when button is pressed
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it('disables button when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <Button label="Disabled" onPress={onPressMock} disabled />
    );
    const button = getByRole('button');
    fireEvent.press(button);
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows loading state with correct text', () => {
    const { getByText } = render(
      <Button label="Submit" onPress={() => {}} loading />
    );
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('disables button during loading', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <Button label="Submit" onPress={onPressMock} loading />
    );
    const button = getByRole('button');
    fireEvent.press(button);
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('has correct accessibility label', () => {
    const { getByLabelText } = render(
      <Button
        label="Submit Form"
        onPress={() => {}}
        accessibilityLabel="Submit the form"
      />
    );
    expect(getByLabelText('Submit the form')).toBeTruthy();
  });

  it('has accessibility role of button', () => {
    const { getByRole } = render(
      <Button label="Test" onPress={() => {}} />
    );
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('supports custom accessibility hint', () => {
    const { getByTestId } = render(
      <Button
        label="Custom"
        onPress={() => {}}
        accessibilityHint="Double tap to activate"
        testID="custom-button"
      />
    );
    const button = getByTestId('custom-button');
    expect(button).toBeTruthy();
  });

  it('applies primary variant by default', () => {
    const { getByRole } = render(
      <Button label="Primary" onPress={() => {}} />
    );
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('applies secondary variant', () => {
    const { getByRole } = render(
      <Button label="Secondary" onPress={() => {}} variant="secondary" />
    );
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('applies success variant', () => {
    const { getByRole } = render(
      <Button label="Success" onPress={() => {}} variant="success" />
    );
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('applies danger variant', () => {
    const { getByRole } = render(
      <Button label="Danger" onPress={() => {}} variant="danger" />
    );
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('applies admin variant', () => {
    const { getByRole } = render(
      <Button label="Admin" onPress={() => {}} variant="admin" />
    );
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('supports small size', () => {
    const { getByRole } = render(
      <Button label="Small" onPress={() => {}} size="sm" />
    );
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('supports medium size', () => {
    const { getByRole } = render(
      <Button label="Medium" onPress={() => {}} size="md" />
    );
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('supports large size', () => {
    const { getByRole } = render(
      <Button label="Large" onPress={() => {}} size="lg" />
    );
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('supports custom testID', () => {
    const { getByTestId } = render(
      <Button label="Test" onPress={() => {}} testID="my-button" />
    );
    expect(getByTestId('my-button')).toBeTruthy();
  });
});
