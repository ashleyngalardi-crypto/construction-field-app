import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Task {
  id: string;
  companyId: string;
  jobSiteId: string;
  scheduleId?: string;
  text: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assigneeId?: string;
  createdBy: string;
  scheduledTime?: number;
  completedAt?: number;
  completedBy?: string;
  dueDate: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Get all tasks for a job site
 */
export const getTasksByJobSite = async (jobSiteId: string): Promise<Task[]> => {
  try {
    const q = query(
      collection(db, 'tasks'),
      where('jobSiteId', '==', jobSiteId),
      orderBy('dueDate', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
  } catch (error) {
    console.error('Error fetching tasks by job site:', error);
    return [];
  }
};

/**
 * Get tasks assigned to a crew member
 */
export const getTasksByAssignee = async (
  assigneeId: string,
  status?: string
): Promise<Task[]> => {
  try {
    let q;
    if (status) {
      q = query(
        collection(db, 'tasks'),
        where('assigneeId', '==', assigneeId),
        where('status', '==', status),
        orderBy('dueDate', 'asc')
      );
    } else {
      q = query(
        collection(db, 'tasks'),
        where('assigneeId', '==', assigneeId),
        orderBy('dueDate', 'asc')
      );
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
  } catch (error) {
    console.error('Error fetching tasks by assignee:', error);
    return [];
  }
};

/**
 * Get today's tasks
 */
export const getTodaysTasks = async (jobSiteId: string): Promise<Task[]> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const q = query(
      collection(db, 'tasks'),
      where('jobSiteId', '==', jobSiteId),
      where('dueDate', '>=', today.getTime()),
      where('dueDate', '<', tomorrow.getTime()),
      orderBy('dueDate', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
  } catch (error) {
    console.error('Error fetching today\'s tasks:', error);
    return [];
  }
};

/**
 * Create a new task
 */
export const createTask = async (
  companyId: string,
  taskData: Omit<Task, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>
): Promise<Task | null> => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      companyId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      id: docRef.id,
      ...taskData,
      companyId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
};

/**
 * Update task
 */
export const updateTask = async (
  taskId: string,
  updates: Partial<Task>
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'tasks', taskId), {
      ...updates,
      updatedAt: Date.now(),
    });
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
};

/**
 * Assign task to crew member
 */
export const assignTask = async (
  taskId: string,
  crewMemberId: string
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'tasks', taskId), {
      assigneeId: crewMemberId,
      status: 'pending',
      updatedAt: Date.now(),
    });
    return true;
  } catch (error) {
    console.error('Error assigning task:', error);
    return false;
  }
};

/**
 * Complete task
 */
export const completeTask = async (
  taskId: string,
  completedBy: string,
  notes?: string
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'tasks', taskId), {
      status: 'completed',
      completedAt: Date.now(),
      completedBy,
      updatedAt: Date.now(),
    });
    return true;
  } catch (error) {
    console.error('Error completing task:', error);
    return false;
  }
};

/**
 * Delete task
 */
export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

/**
 * Get tasks by priority
 */
export const getTasksByPriority = async (
  jobSiteId: string,
  priority: 'high' | 'medium' | 'low'
): Promise<Task[]> => {
  try {
    const q = query(
      collection(db, 'tasks'),
      where('jobSiteId', '==', jobSiteId),
      where('priority', '==', priority),
      where('status', '!=', 'completed'),
      orderBy('status'),
      orderBy('dueDate', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
  } catch (error) {
    console.error('Error fetching tasks by priority:', error);
    return [];
  }
};
