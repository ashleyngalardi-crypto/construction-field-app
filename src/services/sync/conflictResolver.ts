import { Task } from '../api/taskService';
import { FormTemplate, FormSubmission } from '../api/formService';
import { CrewMember } from '../api/crewService';

/**
 * Conflict resolution service
 * Implements Last-Write-Wins strategy with server timestamp precedence
 */

type DataWithTimestamp = any & { updatedAt?: number };

/**
 * Resolve conflicts between local and remote versions
 * Strategy: Most recent timestamp wins (server takes precedence)
 */
export function resolveConflict<T extends DataWithTimestamp>(
  local: T,
  remote: T,
  _conflictType?: string
): T {
  // If server timestamp is more recent, use server version
  if (remote.updatedAt && local.updatedAt && remote.updatedAt > local.updatedAt) {
    return remote;
  }

  // If remote has timestamp but local doesn't, use remote
  if (remote.updatedAt && !local.updatedAt) {
    return remote;
  }

  // Otherwise prefer local (optimistic update)
  return local;
}

/**
 * Task-specific conflict resolution
 */
export function resolveTaskConflict(local: Task, remote: Task): Task {
  // If status changed to completed remotely after local edit, use remote
  if (
    remote.status === 'completed' &&
    local.status !== 'completed' &&
    remote.updatedAt &&
    local.updatedAt &&
    remote.updatedAt > local.updatedAt
  ) {
    return remote;
  }

  // For other cases, use standard LWW
  return resolveConflict(local, remote, 'task');
}

/**
 * Form template-specific conflict resolution
 */
export function resolveFormTemplateConflict(
  local: FormTemplate,
  remote: FormTemplate
): FormTemplate {
  // Admin changes on server take precedence over crew changes
  if (local.visibility === 'crew' && remote.visibility === 'admin_only') {
    return remote;
  }

  // Use standard LWW for other conflicts
  return resolveConflict(local, remote, 'formTemplate');
}

/**
 * Crew member-specific conflict resolution
 */
export function resolveCrewMemberConflict(
  local: CrewMember,
  remote: CrewMember
): CrewMember {
  // Use standard LWW
  return resolveConflict(local, remote, 'crewMember');
}

/**
 * Merge operation that preserves important fields
 * Used when we want to combine local and remote data
 */
export function mergeChanges<T extends DataWithTimestamp>(
  local: T,
  remote: T,
  fieldsToPreserve?: (keyof T)[]
): T {
  // Start with the LWW winner
  const base = resolveConflict(local, remote);

  // If caller specified fields to preserve, merge those from local
  if (fieldsToPreserve && fieldsToPreserve.length > 0) {
    return {
      ...base,
      ...fieldsToPreserve.reduce(
        (acc, field) => {
          if (field in local && field !== 'updatedAt') {
            acc[field] = (local as any)[field];
          }
          return acc;
        },
        {} as Partial<T>
      ),
    };
  }

  return base;
}

/**
 * Check if two items are equivalent (no conflict)
 */
export function hasConflict<T extends DataWithTimestamp>(local: T, remote: T): boolean {
  // Simple check: if updatedAt is the same and main fields match, no conflict
  if (local.updatedAt === remote.updatedAt) {
    const localKeys = Object.keys(local).filter((k) => k !== 'updatedAt' && k !== 'id');
    const remoteKeys = Object.keys(remote).filter((k) => k !== 'updatedAt' && k !== 'id');

    if (localKeys.length !== remoteKeys.length) {
      return true;
    }

    return !localKeys.every((key) => (local as any)[key] === (remote as any)[key]);
  }

  return true;
}

/**
 * Log conflict resolution for debugging
 */
export function logConflictResolution(
  type: string,
  local: any,
  remote: any,
  winner: 'local' | 'remote'
): void {
  console.warn(`[Conflict Resolution] ${type}:`, {
    winner,
    localTimestamp: local.updatedAt,
    remoteTimestamp: remote.updatedAt,
    localId: local.id,
    remoteId: remote.id,
  });
}
