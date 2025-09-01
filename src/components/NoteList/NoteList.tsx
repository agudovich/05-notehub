import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, deleteNote } from '../../services/noteService';
import type { FetchNotesParams, FetchNotesResponse } from '../../services/noteService';
import type { Note } from '../../types/note';
import Loader from '../Loader/Loader';
import ErrorBox from '../ErrorBox/ErrorBox';
import css from './NoteList.module.css';

export interface NoteListProps extends Required<Pick<FetchNotesParams, 'page' | 'perPage'>> {
  search?: string;
}

export default function NoteList({ page, perPage, search = '' }: NoteListProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, perPage, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
    placeholderData: (prev) => prev,
  });

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  if (isLoading) return <Loader />;
  if (isError) return <ErrorBox message={String((error as Error)?.message || 'Error')} />;
  if (!data || data.notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {data.notes.map((n: Note) => (
        <li key={n.id} className={css.listItem}>
          <h2 className={css.title}>{n.title}</h2>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <button
              className={css.button}
              onClick={() => mutation.mutate(n.id)}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
