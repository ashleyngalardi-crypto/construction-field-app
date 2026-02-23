import {
  resolveConflict,
  resolveTaskConflict,
  hasConflict,
  mergeChanges,
} from '../../../services/sync/conflictResolver';

describe('Conflict Resolver', () => {
  describe('resolveConflict', () => {
    it('should prefer remote if more recent', () => {
      const local = { id: 'item-1', name: 'Local', updatedAt: 1000 };
      const remote = { id: 'item-1', name: 'Remote', updatedAt: 2000 };

      const result = resolveConflict(local, remote);

      expect(result).toEqual(remote);
      expect(result.name).toBe('Remote');
    });

    it('should prefer local if more recent', () => {
      const local = { id: 'item-1', name: 'Local', updatedAt: 2000 };
      const remote = { id: 'item-1', name: 'Remote', updatedAt: 1000 };

      const result = resolveConflict(local, remote);

      expect(result).toEqual(local);
      expect(result.name).toBe('Local');
    });

    it('should prefer remote if local has no timestamp', () => {
      const local = { id: 'item-1', name: 'Local' };
      const remote = { id: 'item-1', name: 'Remote', updatedAt: 2000 };

      const result = resolveConflict(local, remote);

      expect(result).toEqual(remote);
    });

    it('should prefer local if timestamps are equal', () => {
      const local = { id: 'item-1', name: 'Local', updatedAt: 2000 };
      const remote = { id: 'item-1', name: 'Remote', updatedAt: 2000 };

      const result = resolveConflict(local, remote);

      expect(result).toEqual(local);
    });
  });

  describe('resolveTaskConflict', () => {
    it('should prioritize remote completion if more recent', () => {
      const local = {
        id: 'task-1',
        status: 'pending',
        updatedAt: 1000,
      };
      const remote = {
        id: 'task-1',
        status: 'completed',
        completedAt: 1500,
        updatedAt: 2000,
      };

      const result = resolveTaskConflict(local as any, remote as any);

      expect(result.status).toBe('completed');
    });

    it('should use local if more recent', () => {
      const local = {
        id: 'task-1',
        status: 'completed',
        updatedAt: 2000,
      };
      const remote = {
        id: 'task-1',
        status: 'pending',
        updatedAt: 1000,
      };

      const result = resolveTaskConflict(local as any, remote as any);

      expect(result.status).toBe('completed');
    });
  });

  describe('hasConflict', () => {
    it('should return false if items are identical', () => {
      const item = { id: 'item-1', name: 'Test', updatedAt: 1000 };

      expect(hasConflict(item, item)).toBe(false);
    });

    it('should return true if fields differ', () => {
      const local = { id: 'item-1', name: 'Local', updatedAt: 1000 };
      const remote = { id: 'item-1', name: 'Remote', updatedAt: 1000 };

      expect(hasConflict(local, remote)).toBe(true);
    });

    it('should return true if timestamps differ', () => {
      const local = { id: 'item-1', name: 'Test', updatedAt: 1000 };
      const remote = { id: 'item-1', name: 'Test', updatedAt: 2000 };

      expect(hasConflict(local, remote)).toBe(true);
    });
  });

  describe('mergeChanges', () => {
    it('should merge with LWW base and preserve specified fields', () => {
      const local = {
        id: 'item-1',
        name: 'Local',
        description: 'Local desc',
        status: 'active',
        updatedAt: 1000,
      };
      const remote = {
        id: 'item-1',
        name: 'Remote',
        description: 'Remote desc',
        status: 'inactive',
        updatedAt: 2000,
      };

      const result = mergeChanges(local, remote, ['status']);

      expect(result.name).toBe('Remote'); // From remote (more recent)
      expect(result.status).toBe('active'); // Preserved from local
    });

    it('should merge without preserving fields if none specified', () => {
      const local = {
        id: 'item-1',
        name: 'Local',
        updatedAt: 1000,
      };
      const remote = {
        id: 'item-1',
        name: 'Remote',
        updatedAt: 2000,
      };

      const result = mergeChanges(local, remote);

      expect(result).toEqual(remote);
    });
  });
});
