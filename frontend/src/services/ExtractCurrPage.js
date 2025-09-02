const extractCurrPage = (rendition) => {
    if (!rendition) return;

    try {
        const currentLocation = rendition.currentLocation?.();
        if (!currentLocation?.start?.cfi || !currentLocation?.end?.cfi) return;

        const startCfi = currentLocation.start.cfi;
        const endCfi = currentLocation.end.cfi;

        const contents = rendition.getContents?.();
        if (!contents?.length) return;
        const content = contents[0];
        if (!content?.document) return;

        const startRange = content.range(startCfi);
        const endRange = content.range(endCfi);

        if (startRange && endRange) {
            const pageRange = content.document.createRange();
            pageRange.setStart(startRange.startContainer, startRange.startOffset);
            pageRange.setEnd(endRange.endContainer, endRange.endOffset);

            if (!pageRange.collapsed) {
                const extractedPageText = pageRange.toString().trim();
                return extractedPageText;
            }
        }
    } catch (error) {
        console.error("Error extracting text:", error);
    }
}

export default extractCurrPage;