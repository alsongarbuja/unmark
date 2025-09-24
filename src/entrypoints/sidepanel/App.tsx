import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CloseCircle,
  SearchNormal,
  Sort,
  TickSquare,
} from "iconsax-react";
import { Toaster } from "sonner";
import "./style.css";
import { getBookmarkChildrens, getBookmarks } from "@/helpers/bookmark";
import BookmarkFolder from "@/components/BookmarkFolder";
import BookmarkTile from "@/components/BookmarkTile";
import { SORT_OPTIONS } from "@/constants/sort";

function App() {
  const { refs, setIsOpen, isOpen, floatingStyles } = useFloatingPop();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentBookMark, setCurrentBookmark] = useState<Partial<Bookmark>>({
    id: "0",
    title: "All Bookmarks",
  });
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0].value);
  const [searchResults, setSearchResults] = useState<Bookmark[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [allBookmarks, setAllBookmarks] = useState<Bookmark[]>([]);

  const changeBookmarkLevel = async (id: string) => {
    if (id === "0") {
      setCurrentBookmark({
        id: "0",
        title: "All Bookmarks",
      });
      setBookmarks(allBookmarks);
      return;
    }

    const b = getBookmarkChildrens(id, allBookmarks);
    setCurrentBookmark(
      b ?? {
        id: "0",
        title: "All Bookmarks",
      }
    );
    setBookmarks(b?.children as Bookmark[]);
  };

  useEffect(() => {
    (async () => {
      const b = await getBookmarks();
      setBookmarks(b[0].children!);
      setAllBookmarks(b[0].children!);
    })();
  }, []);

  return (
    <main className="min-h-screen text-white bg-slate-800">
      <Toaster richColors position="bottom-center" />
      <div className="flex items-center justify-start gap-4 px-4 py-6">
        <img src="/icon/32.png" alt="unmark icon" className="rounded-md" />
        <h1 className="text-2xl font-semibold">Unmark</h1>
      </div>
      <div className="relative mx-4 my-2 rounded-full bg-slate-400">
        <input
          type="text"
          onChange={(e) => {
            setSearchQuery(e.target.value);
            // searchBookmarks(e.target.value);
          }}
          value={searchQuery}
          placeholder="Search Bookmark"
          className="w-full p-3 text-gray-800 bg-transparent border-none rounded-full px-9 placeholder:text-gray-800"
        />
        <SearchNormal
          variant="Bulk"
          size={24}
          color="black"
          className="absolute -translate-y-1/2 top-1/2 left-2"
        />
        {searchQuery.length > 0 && (
          <button
            onClick={() => {
              setSearchQuery("");
            }}
          >
            <CloseCircle
              variant="Bulk"
              size={24}
              color="black"
              className="absolute cursor-pointer -translate-y-1/2 top-1/2 right-2"
            />
          </button>
        )}
      </div>
      {searchQuery.length > 0 ? (
        <>
          {searchResults.length === 0 ? (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center">
              <p className="text-4xl font-semibold">🤷‍♂️ No Results</p>
              <p className="font-semibold">
                No bookmarks found for your search
              </p>
            </div>
          ) : (
            <div className="flex flex-col mt-4">
              {searchResults.map((bookmark) => {
                if (bookmark.children) {
                  return (
                    <BookmarkFolder
                      // onClick={changeBookmarkLevel}
                      onClick={() => {}}
                      bookmark={bookmark}
                      key={bookmark.id}
                      deleteFolder={() => {}}
                      // deleteFolder={deleteFolder}
                    />
                  );
                }
                return (
                  <BookmarkTile
                    bookmark={bookmark}
                    key={bookmark.id}
                    remindIn={null}
                    // updateReminder={updateReminder}
                    deleteBookmarkFromState={() => {}}
                  />
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2 px-4 py-2">
            <div className="flex items-center gap-2">
              {currentBookMark.id !== "0" && (
                <button
                  onClick={() =>
                    changeBookmarkLevel(currentBookMark.parentId ?? "0")
                  }
                  className="cursor-pointer"
                >
                  <ArrowLeft color="white" size={20} />
                </button>
              )}
              <h3 className="text-lg font-semibold">{currentBookMark.title}</h3>
            </div>
            <div className="flex items-end gap-1">
              <label htmlFor="sortby">Sort By</label>
              <PopupWrapper
                refs={refs}
                floatingStyles={floatingStyles}
                buttonLabel="Sort list"
                buttonIcon={<Sort size={20} />}
                buttonClick={() => setIsOpen(!isOpen)}
                closePop={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                isOpen={isOpen}
              >
                <>
                  {SORT_OPTIONS.map((sortOption, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // setSortBy(sortOption.value);
                      }}
                      className="flex items-center justify-start gap-2 px-4 py-2 text-white hover:bg-slate-400/40"
                    >
                      <span className="flex-1 text-start">
                        {sortOption.title}
                      </span>
                      {sortBy === sortOption.value ? (
                        <TickSquare
                          size={16}
                          variant="Bulk"
                          className="text-blue-200"
                        />
                      ) : (
                        <span className="w-8" />
                      )}
                    </button>
                  ))}
                </>
              </PopupWrapper>
            </div>
          </div>
          <div className="flex flex-col mt-4">
            {/* <AddFolder
              currentId={currentBookMark.id}
              addFolderInState={addFolderInState}
            /> */}
            {bookmarks.map((bookmark) => {
              if (bookmark.children) {
                return (
                  <BookmarkFolder
                    onClick={changeBookmarkLevel}
                    bookmark={bookmark}
                    key={bookmark.id}
                    deleteFolder={() => {}}
                    // deleteFolder={deleteFolder}
                  />
                );
              }
              return (
                <BookmarkTile
                  bookmark={bookmark}
                  key={bookmark.id}
                  remindIn={null}
                  // updateReminder={updateReminder}
                  deleteBookmarkFromState={() => {}}
                />
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}

export default App;
