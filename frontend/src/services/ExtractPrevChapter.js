const extractPrevChapter = async (rendition, book) => {
    if (!rendition || !book) return;

    const spine = book.spine.spineItems;
    const currentLocation = rendition.currentLocation?.();
    if (!currentLocation?.start?.index) return;

    const currIndex = currentLocation.start.index;
    let prevIndex = Math.max(currIndex - 1, 0);

    const loadSpineItem = async (index) => {
        if (index < 0 || index >= spine.length) return "";
        const spineItem = spine[index];
        if (!spineItem.document) {
            await spineItem.load(book.load.bind(book));
        }
        return spineItem.document?.body?.textContent?.trim() || "";
    };

    let prevChapterText = await loadSpineItem(prevIndex);

    if (prevChapterText.length < 50 && prevIndex > 0) {
        const earlierChapterText = await loadSpineItem(prevIndex - 1);
        prevChapterText = earlierChapterText + "\n\n" + prevChapterText;
    }

    return prevChapterText;
};

export default extractPrevChapter;