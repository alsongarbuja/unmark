// import BookmarkTile from "./BookmarkTile";

import { Folder2 } from "iconsax-react";

interface IBookmarkFolderProps {
  bookmark: Bookmark;
  onClick: (id: string) => void;
}

export default function BookmarkFolder({
  bookmark,
  onClick,
}: IBookmarkFolderProps) {
  return (
    <button
      onClick={() => onClick(bookmark.id)}
      className="inline-flex w-full gap-2 px-4 py-2 text-white hover:bg-slate-400/40"
    >
      <Folder2 variant="Bulk" size={20} /> {bookmark.title}
    </button>
  );
}
