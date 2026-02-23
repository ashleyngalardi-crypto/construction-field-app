import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { isOnline, queueOperation, generateTempId, markAsPending } from '../sync/offlineUtils';

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'date' | 'checkbox' | 'select' | 'textarea' | 'signature' | 'photo';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select fields
}

export interface FormTemplate {
  id: string;
  companyId: string;
  name: string;
  icon: string;
  templateType: 'risk_assessment' | 'equipment_inspection' | 'toolbox_talk' | 'custom';
  frequency: 'daily' | 'weekly' | 'per_shift' | 'as_needed';
  required: boolean;
  visibility: 'crew' | 'admin_only' | 'all';
  fields: FormField[];
  isActive: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface FormSubmission {
  id: string;
  companyId: string;
  templateId: string;
  jobSiteId?: string;
  scheduleId?: string;
  submittedBy: string;
  responses: Record<string, any>;
  signatureUrl?: string;
  photoUrls?: string[];
  completedAt: number;
  createdAt: number;
}

/**
 * Get all form templates for a company
 */
export const getFormTemplates = async (
  companyId: string,
  visibility?: string
): Promise<FormTemplate[]> => {
  try {
    let q;
    if (visibility) {
      q = query(
        collection(db, 'formTemplates'),
        where('companyId', '==', companyId),
        where('visibility', 'in', [visibility, 'all']),
        where('isActive', '==', true)
      );
    } else {
      q = query(
        collection(db, 'formTemplates'),
        where('companyId', '==', companyId),
        where('isActive', '==', true)
      );
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FormTemplate[];
  } catch (error) {
    console.error('Error fetching form templates:', error);
    return [];
  }
};

/**
 * Get form template by ID
 */
export const getFormTemplate = async (templateId: string): Promise<FormTemplate | null> => {
  try {
    const snapshot = await getDocs(
      query(collection(db, 'formTemplates'), where('id', '==', templateId))
    );
    if (snapshot.empty) return null;
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    } as FormTemplate;
  } catch (error) {
    console.error('Error fetching form template:', error);
    return null;
  }
};

/**
 * Create new form template
 */
export const createFormTemplate = async (
  companyId: string,
  templateData: Omit<FormTemplate, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>
): Promise<FormTemplate | null> => {
  const now = Date.now();
  const templateWithMeta = {
    ...templateData,
    companyId,
    createdAt: now,
    updatedAt: now,
  };

  // If offline, queue and return optimistic response
  if (!isOnline()) {
    const tempId = generateTempId();
    queueOperation({
      collection: 'formTemplates',
      operation: 'create',
      documentId: tempId,
      data: templateWithMeta,
    });

    return markAsPending({
      id: tempId,
      ...templateWithMeta,
    }) as any;
  }

  try {
    const docRef = await addDoc(collection(db, 'formTemplates'), templateWithMeta);
    return {
      id: docRef.id,
      ...templateWithMeta,
    };
  } catch (error) {
    console.error('Error creating form template:', error);
    return null;
  }
};

/**
 * Update form template
 */
export const updateFormTemplate = async (
  templateId: string,
  updates: Partial<FormTemplate>
): Promise<boolean> => {
  const updateData = {
    ...updates,
    updatedAt: Date.now(),
  };

  // If offline, queue and return optimistic response
  if (!isOnline()) {
    queueOperation({
      collection: 'formTemplates',
      operation: 'update',
      documentId: templateId,
      data: updateData,
    });
    return true;
  }

  try {
    await updateDoc(doc(db, 'formTemplates', templateId), updateData);
    return true;
  } catch (error) {
    console.error('Error updating form template:', error);
    return false;
  }
};

/**
 * Delete form template
 */
export const deleteFormTemplate = async (templateId: string): Promise<boolean> => {
  // If offline, queue and return optimistic response
  if (!isOnline()) {
    queueOperation({
      collection: 'formTemplates',
      operation: 'delete',
      documentId: templateId,
      data: {},
    });
    return true;
  }

  try {
    await deleteDoc(doc(db, 'formTemplates', templateId));
    return true;
  } catch (error) {
    console.error('Error deleting form template:', error);
    return false;
  }
};

/**
 * Submit form response
 */
export const submitForm = async (
  companyId: string,
  submissionData: Omit<FormSubmission, 'id' | 'companyId' | 'createdAt'>
): Promise<FormSubmission | null> => {
  const now = Date.now();
  const submissionWithMeta = {
    ...submissionData,
    companyId,
    createdAt: now,
  };

  // If offline, queue and return optimistic response
  if (!isOnline()) {
    const tempId = generateTempId();
    queueOperation({
      collection: 'formSubmissions',
      operation: 'create',
      documentId: tempId,
      data: submissionWithMeta,
    });

    return markAsPending({
      id: tempId,
      ...submissionWithMeta,
    }) as any;
  }

  try {
    const docRef = await addDoc(collection(db, 'formSubmissions'), submissionWithMeta);
    return {
      id: docRef.id,
      ...submissionWithMeta,
    };
  } catch (error) {
    console.error('Error submitting form:', error);
    return null;
  }
};

/**
 * Get form submissions for a template
 */
export const getFormSubmissions = async (templateId: string): Promise<FormSubmission[]> => {
  try {
    const q = query(
      collection(db, 'formSubmissions'),
      where('templateId', '==', templateId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FormSubmission[];
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    return [];
  }
};

/**
 * Get form submissions by user
 */
export const getFormSubmissionsByUser = async (
  submittedBy: string
): Promise<FormSubmission[]> => {
  try {
    const q = query(
      collection(db, 'formSubmissions'),
      where('submittedBy', '==', submittedBy)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FormSubmission[];
  } catch (error) {
    console.error('Error fetching form submissions by user:', error);
    return [];
  }
};

/**
 * Get required forms for today
 */
export const getRequiredForms = async (
  companyId: string,
  frequency: string = 'daily'
): Promise<FormTemplate[]> => {
  try {
    const q = query(
      collection(db, 'formTemplates'),
      where('companyId', '==', companyId),
      where('required', '==', true),
      where('frequency', '==', frequency),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FormTemplate[];
  } catch (error) {
    console.error('Error fetching required forms:', error);
    return [];
  }
};
