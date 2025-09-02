const extractPrevChapters = async (rendition, book) => {
    if (!rendition) return;
    if (!book) return;

    const spine = book.spine.spineItems;
    const currentLocation = rendition.currentLocation?.();
    if (!currentLocation?.start?.cfi) return;

    const currIndex = currentLocation.start.index;
    let prevChapters = "";

    for (let i = 0; i < currIndex; i++) {
        const spineItem = spine[i];
        if (!spineItem.document) {
            await spineItem.load(book.load.bind(book));
        }
        prevChapters += spineItem.document?.body?.textContent?.trim() || "" + "\n"
    }

    console.log(prevChapters)

    return prevChapters;
}

export default extractPrevChapters;