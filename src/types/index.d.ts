interface IBookmarkGroup {
  id: string;
  title: string;
  parentId: string;
  dateAdded: number;
  dateLastUsed: number;
  index: number;
  children: IBookmarkGroup[] | IBookmark[];
}

interface IBookmark {
  id: string;
  title: string;
  url: string;
  parentId: string;
  dateAdded: number;
  dateLastUsed: number;
  index: number;
  remindIn: number | null;
}
