const extractCurrChapter = async (rendition, book) => {
    if (!rendition) return;
    if (!book) return;

    const currentLocation = rendition.currentLocation?.();
    if (!currentLocation?.start?.cfi) return;

    const startCfi = currentLocation.start.cfi;
    const contents = rendition.getContents?.();
    if (!contents?.length) return;
    const content = contents[0];
    if (!content?.document) return;

    const startRange = content.range(startCfi);
    if (!startRange) return;

    const chapterStartRange = content.document.createRange();
    chapterStartRange.setStart(content.document.body, 0);
    chapterStartRange.setEnd(startRange.startContainer, startRange.startOffset);
  
    return chapterStartRange.toString().trim();
}

export default extractCurrChapter;