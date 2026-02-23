import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as crewService from '../../services/api/crewService';
import * as taskService from '../../services/api/taskService';
import * as formService from '../../services/api/formService';

export interface AdminState {
  crew: crewService.CrewMember[];
  crewWorkloads: crewService.CrewWorkload[];
  tasks: taskService.Task[];
  todaysTasks: taskService.Task[];
  formTemplates: formService.FormTemplate[];
  formSubmissions: formService.FormSubmission[];
  isLoading: boolean;
  error: string | null;
  selectedCrewMemberId: string | null;
  selectedTaskId: string | null;
}

const initialState: AdminState = {
  crew: [],
  crewWorkloads: [],
  tasks: [],
  todaysTasks: [],
  formTemplates: [],
  formSubmissions: [],
  isLoading: false,
  error: null,
  selectedCrewMemberId: null,
  selectedTaskId: null,
};

// Async thunks
export const fetchCrewMembers = createAsyncThunk(
  'admin/fetchCrewMembers',
  async (companyId: string, { rejectWithValue }) => {
    try {
      const crew = await crewService.getCrewMembers(companyId);
      return crew;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch crew members');
    }
  }
);

export const fetchCrewWorkloads = createAsyncThunk(
  'admin/fetchCrewWorkloads',
  async (crewMembers: crewService.CrewMember[], { rejectWithValue }) => {
    try {
      const workloads = await crewService.getAllCrewWorkloads(crewMembers);
      return workloads;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch crew workloads');
    }
  }
);

export const fetchJobSiteTasks = createAsyncThunk(
  'admin/fetchJobSiteTasks',
  async (jobSiteId: string, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getTasksByJobSite(jobSiteId);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTodaysTasks = createAsyncThunk(
  'admin/fetchTodaysTasks',
  async (jobSiteId: string, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getTodaysTasks(jobSiteId);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch today\'s tasks');
    }
  }
);

export const createNewTask = createAsyncThunk(
  'admin/createNewTask',
  async (
    { companyId, taskData }: { companyId: string; taskData: Omit<taskService.Task, 'id' | 'companyId' | 'createdAt' | 'updatedAt'> },
    { rejectWithValue }
  ) => {
    try {
      const task = await taskService.createTask(companyId, taskData);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create task');
    }
  }
);

export const assignTaskToMember = createAsyncThunk(
  'admin/assignTaskToMember',
  async (
    { taskId, crewMemberId }: { taskId: string; crewMemberId: string },
    { rejectWithValue }
  ) => {
    try {
      const success = await taskService.assignTask(taskId, crewMemberId);
      if (!success) throw new Error('Failed to assign task');
      return { taskId, crewMemberId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to assign task');
    }
  }
);

export const completeTask = createAsyncThunk(
  'admin/completeTask',
  async (
    { taskId, completedBy }: { taskId: string; completedBy: string },
    { rejectWithValue }
  ) => {
    try {
      const success = await taskService.completeTask(taskId, completedBy);
      if (!success) throw new Error('Failed to complete task');
      return taskId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to complete task');
    }
  }
);

export const fetchFormTemplates = createAsyncThunk(
  'admin/fetchFormTemplates',
  async (companyId: string, { rejectWithValue }) => {
    try {
      const templates = await formService.getFormTemplates(companyId);
      return templates;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch form templates');
    }
  }
);

export const createFormTemplate = createAsyncThunk(
  'admin/createFormTemplate',
  async (
    { companyId, templateData }: { companyId: string; templateData: Omit<formService.FormTemplate, 'id' | 'companyId' | 'createdAt' | 'updatedAt'> },
    { rejectWithValue }
  ) => {
    try {
      const template = await formService.createFormTemplate(companyId, templateData);
      return template;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create form template');
    }
  }
);

export const updateFormTemplate = createAsyncThunk(
  'admin/updateFormTemplate',
  async (
    { templateId, updates }: { templateId: string; updates: Partial<formService.FormTemplate> },
    { rejectWithValue }
  ) => {
    try {
      const success = await formService.updateFormTemplate(templateId, updates);
      if (!success) throw new Error('Failed to update template');
      return { templateId, updates };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update template');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    setSelectedCrewMember: (state, action: PayloadAction<string | null>) => {
      state.selectedCrewMemberId = action.payload;
    },
    setSelectedTask: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch crew members
    builder
      .addCase(fetchCrewMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCrewMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.crew = action.payload;
      })
      .addCase(fetchCrewMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch crew workloads
    builder
      .addCase(fetchCrewWorkloads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCrewWorkloads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.crewWorkloads = action.payload;
      })
      .addCase(fetchCrewWorkloads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch job site tasks
    builder
      .addCase(fetchJobSiteTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobSiteTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchJobSiteTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch today's tasks
    builder
      .addCase(fetchTodaysTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodaysTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todaysTasks = action.payload;
      })
      .addCase(fetchTodaysTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create new task
    builder
      .addCase(createNewTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewTask.fulfilled, (state, action: any) => {
        state.isLoading = false;
        if (action.payload) {
          state.tasks.push(action.payload);
        }
      })
      .addCase(createNewTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Assign task
    builder
      .addCase(assignTaskToMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignTaskToMember.fulfilled, (state, action: any) => {
        state.isLoading = false;
        const task = state.tasks.find((t) => t.id === action.payload.taskId);
        if (task) {
          task.assigneeId = action.payload.crewMemberId;
          task.status = 'pending';
        }
      })
      .addCase(assignTaskToMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Complete task
    builder
      .addCase(completeTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const task = state.tasks.find((t) => t.id === action.payload);
        if (task) {
          task.status = 'completed';
          task.completedAt = Date.now();
        }
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch form templates
    builder
      .addCase(fetchFormTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFormTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.formTemplates = action.payload;
      })
      .addCase(fetchFormTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create form template
    builder
      .addCase(createFormTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFormTemplate.fulfilled, (state, action: any) => {
        state.isLoading = false;
        if (action.payload) {
          state.formTemplates.push(action.payload);
        }
      })
      .addCase(createFormTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update form template
    builder
      .addCase(updateFormTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFormTemplate.fulfilled, (state, action: any) => {
        state.isLoading = false;
        const template = state.formTemplates.find((t) => t.id === action.payload.templateId);
        if (template) {
          Object.assign(template, action.payload.updates);
        }
      })
      .addCase(updateFormTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdminError, setSelectedCrewMember, setSelectedTask } = adminSlice.actions;

export default adminSlice.reducer;
