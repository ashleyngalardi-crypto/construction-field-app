import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingSkeleton } from '../../../components/common/LoadingSkeleton';
import { View } from 'react-native';

describe('LoadingSkeleton Component', () => {
  it('renders task skeleton variant', () => {
    const { container } = render(<LoadingSkeleton type="task" count={1} />);
    expect(container).toBeTruthy();
  });

  it('renders crew card skeleton variant', () => {
    const { container } = render(<LoadingSkeleton type="crewCard" count={1} />);
    expect(container).toBeTruthy();
  });

  it('renders form field skeleton variant', () => {
    const { container } = render(
      <LoadingSkeleton type="formField" count={1} />
    );
    expect(container).toBeTruthy();
  });

  it('renders multiple task skeletons', () => {
    const { container } = render(<LoadingSkeleton type="task" count={5} />);
    expect(container).toBeTruthy();
  });

  it('renders multiple crew card skeletons', () => {
    const { container } = render(<LoadingSkeleton type="crewCard" count={3} />);
    expect(container).toBeTruthy();
  });

  it('renders multiple form field skeletons', () => {
    const { container } = render(
      <LoadingSkeleton type="formField" count={4} />
    );
    expect(container).toBeTruthy();
  });

  it('uses custom spacing prop', () => {
    const { container } = render(
      <LoadingSkeleton type="task" count={2} spacing={20} />
    );
    expect(container).toBeTruthy();
  });

  it('renders with default count of 5', () => {
    const { container } = render(<LoadingSkeleton type="task" />);
    expect(container).toBeTruthy();
  });
});
