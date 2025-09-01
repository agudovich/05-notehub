import axios, { type AxiosInstance } from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_URL = 'https://notehub-public.goit.study/api';

const token = import.meta.env.VITE_NOTEHUB_TOKEN as string;
if (!token) {
  console.warn('VITE_NOTEHUB_TOKEN не задан!');
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { Authorization: `Bearer ${token}` },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: NoteTag;
}

/** Получить список заметок  */
export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search = '' } = params;
  const res = await api.get<FetchNotesResponse>('/notes', {
    params: { page, perPage, search: search || undefined },
  });
  return res.data;
}

/** Создать заметку */
export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const res = await api.post<Note>('/notes', payload);
  return res.data;
}

/** Удалить заметку */
export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
}
