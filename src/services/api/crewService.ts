import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { isOnline, queueOperation, generateTempId, markAsPending } from '../sync/offlineUtils';

export interface CrewMember {
  id: string;
  companyId: string;
  name: string;
  email?: string;
  phoneNumber: string;
  role: string; // 'foreman', 'operator', 'laborer'
  jobSiteId: string;
  avatarUrl?: string;
  isActive: boolean;
  joinedAt: number;
  lastSeen?: number;
}

export interface CrewWorkload {
  crewMemberId: string;
  openTasks: number;
  completedTasks: number;
  inspectionsPending: number;
  averageCompletionTime: number; // in minutes
}

/**
 * Get all crew members for a company
 */
export const getCrewMembers = async (companyId: string): Promise<CrewMember[]> => {
  try {
    const q = query(collection(db, 'crew'), where('companyId', '==', companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CrewMember[];
  } catch (error) {
    console.error('Error fetching crew members:', error);
    return [];
  }
};

/**
 * Get crew members for a specific job site
 */
export const getCrewByJobSite = async (
  companyId: string,
  jobSiteId: string
): Promise<CrewMember[]> => {
  try {
    const q = query(
      collection(db, 'crew'),
      where('companyId', '==', companyId),
      where('jobSiteId', '==', jobSiteId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CrewMember[];
  } catch (error) {
    console.error('Error fetching crew by job site:', error);
    return [];
  }
};

/**
 * Add new crew member
 */
export const addCrewMember = async (
  companyId: string,
  crewData: Omit<CrewMember, 'id'>
): Promise<CrewMember | null> => {
  const now = Date.now();
  const crewWithMeta = {
    ...crewData,
    companyId,
    joinedAt: now,
    isActive: true,
  };

  // If offline, queue and return optimistic response
  if (!isOnline()) {
    const tempId = generateTempId();
    queueOperation({
      collection: 'crew',
      operation: 'create',
      documentId: tempId,
      data: crewWithMeta,
    });

    return markAsPending({
      id: tempId,
      ...crewWithMeta,
    }) as any;
  }

  try {
    const docRef = await addDoc(collection(db, 'crew'), crewWithMeta);
    return {
      id: docRef.id,
      ...crewWithMeta,
    };
  } catch (error) {
    console.error('Error adding crew member:', error);
    return null;
  }
};

/**
 * Update crew member
 */
export const updateCrewMember = async (
  crewId: string,
  updates: Partial<CrewMember>
): Promise<boolean> => {
  const updateData = {
    ...updates,
    updatedAt: Date.now(),
  };

  // If offline, queue and return optimistic response
  if (!isOnline()) {
    queueOperation({
      collection: 'crew',
      operation: 'update',
      documentId: crewId,
      data: updateData,
    });
    return true;
  }

  try {
    await updateDoc(doc(db, 'crew', crewId), updateData);
    return true;
  } catch (error) {
    console.error('Error updating crew member:', error);
    return false;
  }
};

/**
 * Remove crew member
 */
export const removeCrewMember = async (crewId: string): Promise<boolean> => {
  // If offline, queue and return optimistic response
  if (!isOnline()) {
    queueOperation({
      collection: 'crew',
      operation: 'delete',
      documentId: crewId,
      data: {},
    });
    return true;
  }

  try {
    await deleteDoc(doc(db, 'crew', crewId));
    return true;
  } catch (error) {
    console.error('Error removing crew member:', error);
    return false;
  }
};

/**
 * Calculate workload for crew member
 */
export const calculateCrewWorkload = async (
  crewMemberId: string
): Promise<CrewWorkload | null> => {
  try {
    // Get open tasks
    const openTasksQuery = query(
      collection(db, 'tasks'),
      where('assigneeId', '==', crewMemberId),
      where('status', '==', 'pending')
    );
    const openTasksSnapshot = await getDocs(openTasksQuery);

    // Get completed tasks
    const completedTasksQuery = query(
      collection(db, 'tasks'),
      where('assigneeId', '==', crewMemberId),
      where('status', '==', 'completed')
    );
    const completedTasksSnapshot = await getDocs(completedTasksQuery);

    // Get pending inspections
    const inspectionsQuery = query(
      collection(db, 'inspections'),
      where('assigneeId', '==', crewMemberId),
      where('status', '==', 'pending')
    );
    const inspectionsSnapshot = await getDocs(inspectionsQuery);

    // Calculate average completion time (mock for now)
    const completedTasks = completedTasksSnapshot.docs;
    let totalTime = 0;
    completedTasks.forEach((taskDoc) => {
      const task = taskDoc.data();
      if (task.completedAt && task.scheduledTime) {
        totalTime += task.completedAt - task.scheduledTime;
      }
    });
    const averageTime = completedTasks.length > 0 ? Math.round(totalTime / completedTasks.length / 60000) : 0;

    return {
      crewMemberId,
      openTasks: openTasksSnapshot.size,
      completedTasks: completedTasksSnapshot.size,
      inspectionsPending: inspectionsSnapshot.size,
      averageCompletionTime: averageTime,
    };
  } catch (error) {
    console.error('Error calculating crew workload:', error);
    return null;
  }
};

/**
 * Get all crew workloads for a company
 */
export const getAllCrewWorkloads = async (
  crewMembers: CrewMember[]
): Promise<CrewWorkload[]> => {
  try {
    const workloads = await Promise.all(
      crewMembers.map((member) => calculateCrewWorkload(member.id))
    );
    return workloads.filter((w) => w !== null) as CrewWorkload[];
  } catch (error) {
    console.error('Error getting all crew workloads:', error);
    return [];
  }
};
