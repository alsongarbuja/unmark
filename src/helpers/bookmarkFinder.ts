export const bookmarkChildrenFinder = (id: string, bookmarks: Bookmark[]): Bookmark | undefined => {
  const bookmark = bookmarks.find((bookmark) => bookmark.id === id);
  if (bookmark) {
    return bookmark as Bookmark;
  };

  for (const b of bookmarks) {
    if (b.children) {
      const bm = bookmarkChildrenFinder(id, b.children as Bookmark[]);
      if (bm) {
        return bm;
      } else {
        continue;
      }
    }
  }

  return undefined;
}
