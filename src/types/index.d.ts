interface IBookmarkReminder {
  remindIn: Date | null;
}

interface Bookmark extends chrome.bookmarks.BookmarkTreeNode {
  dateLastUsed?: number;
}

type BookmarkReminderObject = { [key: string]: IBookmarkReminder };
type dynamicObject = { [key: string]: unknown };
