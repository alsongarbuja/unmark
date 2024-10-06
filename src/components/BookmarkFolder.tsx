// import BookmarkTile from "./BookmarkTile";

interface IBookmarkFolderProps {
  bookmark: IBookmark;
}

export default function BookmarkFolder({ bookmark }: IBookmarkFolderProps) {
  return (
    <div>
      <div className="flex items-center justify-between p-2 text-white hover:bg-slate-400/40">
        <div>{bookmark.title}</div>
      </div>
      <div className="ml-4">
        {/* {bookmark.children?.map((child) => {
          if (child.children) {
            return <BookmarkFolder bookmark={child} key={child.id} />;
          } else {
            return <BookmarkTile bookmark={child} key={child.id} />;
          }
        })} */}
      </div>
    </div>
  );
}
