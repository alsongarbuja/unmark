import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const getBookMarks = async () => {
      const bookmarks = await chrome.bookmarks.getTree();
      console.log("Bookmarks");
      console.log(bookmarks);
    };

    getBookMarks();
  }, []);

  const addBookMark = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.bookmarks.create({
        parentId: "1",
        title: tabs[0].title,
        url: tabs[0].url,
      });
    });
  };

  return (
    <>
      <h1>UnMark</h1>
      <button onClick={addBookMark}>Add Bookmark</button>
    </>
  );
}

export default App;
