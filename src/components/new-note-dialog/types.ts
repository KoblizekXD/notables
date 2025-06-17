export interface Author {
  id: string;
  name: string;
}

export interface Work {
  id: string;
  title: string;
  authorId?: string | null;
}

export interface SelectionOptions {
  selectAuthor: boolean;
  selectWork: boolean;
  createAuthor: boolean;
  createWork: boolean;
}

export interface NewNoteDialogState {
  open: boolean;
  selectionOptions: SelectionOptions;
  selectedAuthor: string;
  selectedWork: string;
  title: string;
  newAuthorName: string;
  newWorkTitle: string;
  newWorkAuthor: string;
  authors: Author[];
  works: Work[];
  loadingAuthors: boolean;
  loadingWorks: boolean;
}
