import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CommentItem {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  timestamp: string;
}

interface CommentState {
  comments: CommentItem[];
}

const initialComments: CommentItem[] = [
  {
    id: 'cmt-1',
    taskId: 'task-1',
    authorId: 'u-2',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    text: 'I uploaded the revised Figma tokens in the shared drive. Take a look when you get a chance!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'cmt-2',
    taskId: 'task-1',
    authorId: 'u-1',
    authorName: 'Alex Morgan',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    text: 'Looks great! Working on implementing the dark mode color variables now.',
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
];

const initialState: CommentState = {
  comments: initialComments,
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<CommentItem[]>) => {
      state.comments = action.payload;
    },
    addComment: (
      state,
      action: PayloadAction<Omit<CommentItem, 'id' | 'timestamp'>>
    ) => {
      const newComment: CommentItem = {
        ...action.payload,
        id: `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
      };
      state.comments.push(newComment);
    },
    deleteComment: (state, action: PayloadAction<string>) => {
      state.comments = state.comments.filter((c) => c.id !== action.payload);
    },
  },
});

export const { setComments, addComment, deleteComment } = commentSlice.actions;
export default commentSlice.reducer;
