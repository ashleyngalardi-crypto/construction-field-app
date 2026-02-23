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
  try {
    const docRef = await addDoc(collection(db, 'formTemplates'), {
      ...templateData,
      companyId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      id: docRef.id,
      ...templateData,
      companyId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
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
  try {
    await updateDoc(doc(db, 'formTemplates', templateId), {
      ...updates,
      updatedAt: Date.now(),
    });
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
  try {
    const docRef = await addDoc(collection(db, 'formSubmissions'), {
      ...submissionData,
      companyId,
      createdAt: Date.now(),
    });

    return {
      id: docRef.id,
      ...submissionData,
      companyId,
      createdAt: Date.now(),
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
