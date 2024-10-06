export const bookmarkChildrenFinder = (id: string, bookmarks: Bookmark[]): Bookmark | undefined => {
  const bookmark = bookmarks.find((bookmark) => bookmark.id === id);
  if (bookmark) {
    return bookmark as Bookmark;
  };

  for (const b of bookmarks) {
    if (b.children) {
      return bookmarkChildrenFinder(id, b.children as Bookmark[]);
    }
  }

  return undefined;
}
