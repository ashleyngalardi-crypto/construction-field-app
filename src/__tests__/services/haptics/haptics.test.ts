import * as ExpoHaptics from 'expo-haptics';
import { haptics } from '../../../services/haptics/haptics';

jest.mock('expo-haptics');

describe('Haptics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls light haptic (tap) feedback', async () => {
    await haptics.tap();
    expect(ExpoHaptics.impactAsync).toHaveBeenCalledWith(
      ExpoHaptics.ImpactFeedbackStyle.Light
    );
  });

  it('calls medium haptic (select) feedback', async () => {
    await haptics.select();
    expect(ExpoHaptics.impactAsync).toHaveBeenCalledWith(
      ExpoHaptics.ImpactFeedbackStyle.Medium
    );
  });

  it('calls heavy haptic (delete) feedback', async () => {
    await haptics.delete();
    expect(ExpoHaptics.impactAsync).toHaveBeenCalledWith(
      ExpoHaptics.ImpactFeedbackStyle.Heavy
    );
  });

  it('calls success notification haptic', async () => {
    await haptics.success();
    expect(ExpoHaptics.notificationAsync).toHaveBeenCalledWith(
      ExpoHaptics.NotificationFeedbackType.Success
    );
  });

  it('calls warning notification haptic', async () => {
    await haptics.warning();
    expect(ExpoHaptics.notificationAsync).toHaveBeenCalledWith(
      ExpoHaptics.NotificationFeedbackType.Warning
    );
  });

  it('calls error notification haptic', async () => {
    await haptics.error();
    expect(ExpoHaptics.notificationAsync).toHaveBeenCalledWith(
      ExpoHaptics.NotificationFeedbackType.Error
    );
  });

  it('calls selection haptic', async () => {
    await haptics.selection();
    expect(ExpoHaptics.selectionAsync).toHaveBeenCalled();
  });

  it('handles haptic errors gracefully', async () => {
    (ExpoHaptics.impactAsync as jest.Mock).mockRejectedValueOnce(
      new Error('Haptics not available')
    );
    // Should not throw when haptics fails
    await expect(haptics.tap()).resolves.not.toThrow();
  });

  it('continues to work after an error', async () => {
    (ExpoHaptics.impactAsync as jest.Mock).mockRejectedValueOnce(
      new Error('First failure')
    );
    await haptics.tap();

    // Reset and try again
    (ExpoHaptics.impactAsync as jest.Mock).mockResolvedValueOnce(undefined);
    await haptics.tap();

    expect(ExpoHaptics.impactAsync).toHaveBeenCalledTimes(2);
  });
});
