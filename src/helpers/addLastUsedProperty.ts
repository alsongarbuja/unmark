export const addLastUsedProperty = (bookmarks: Bookmark[]) => {
  const b: Bookmark[] = [];

  for (let i = 0; i < bookmarks.length; i++) {
    const bm: Bookmark = {
      ...bookmarks[i],
      dateLastUsed: bookmarks[i].dateLastUsed ?? bookmarks[i].dateAdded,
    };
    if (bm.children) {
      bm.children = addLastUsedProperty(bm.children);
    }

    b.push(bm);
  }

  return b;
}
