import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm, { NoteFormValues } from '../NoteForm/NoteForm';
import { createNote, fetchNotes } from '../../services/noteService';
import css from './App.module.css';

export default function App() {
  const [page, setPage] = useState(1);
  const perPage = 12;

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 400);

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (v: NoteFormValues) => createNote(v),
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const { data } = useQuery({
    queryKey: ['notes', page, perPage, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch }),
    keepPreviousData: true,
  });

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />

        <Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />

        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>

      <NoteList page={page} perPage={perPage} search={debouncedSearch} />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <NoteForm
          onCancel={() => setIsOpen(false)}
          onSubmit={(values) => createMutation.mutate(values)}
          isSubmitting={createMutation.isLoading}
        />
      </Modal>
    </div>
  );
}
