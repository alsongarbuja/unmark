import { Folder2, Trash } from "iconsax-react";
import PopupWrapper from "./PopupWrapper";
import { useFloatingPop } from "../hooks/useFloatingPop";

interface IBookmarkFolderProps {
  bookmark: Bookmark;
  onClick: (id: string) => void;
  deleteFolder: (id: string) => void;
}

export default function BookmarkFolder({
  bookmark,
  onClick,
  deleteFolder,
}: IBookmarkFolderProps) {
  const { refs, floatingStyles, isOpen, setIsOpen } = useFloatingPop();

  return (
    <button
      onClick={() => onClick(bookmark.id)}
      className="inline-flex justify-between w-full gap-2 px-4 py-2 text-white hover:bg-slate-400/40"
    >
      <div className="flex gap-2">
        <Folder2 variant="Bulk" size={20} /> {bookmark.title}
      </div>
      {bookmark.parentId !== "0" && (
        <PopupWrapper
          refs={refs}
          isOpen={isOpen}
          floatingStyles={floatingStyles}
          closePop={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
          buttonIcon={
            <Trash size={20} variant="Bulk" className="text-red-400" />
          }
          buttonLabel="Delete folder"
          buttonClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          <div className="flex flex-col items-center gap-2 pt-4">
            <p className="text-lg font-semibold">Delete bookmark</p>
            <p className="w-3/4 mx-auto text-sm">
              All the bookmarks inside will be deleted
            </p>
            <div className="flex items-center w-full gap-0">
              <button
                className="flex-1 px-4 py-2 text-white bg-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                No
              </button>
              <button
                className="flex-1 px-4 py-2 text-white bg-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(bookmark.id);
                  setIsOpen(false);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </PopupWrapper>
      )}
    </button>
  );
}
