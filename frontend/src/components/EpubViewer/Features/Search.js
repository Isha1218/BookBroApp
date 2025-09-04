import React, { useState, useEffect, useRef, useCallback } from "react";
import { LuSearch } from "react-icons/lu";

const SearchResultItem = ({ chapter, context, cfi, onNavigate }) => {
    const handleClick = () => {
        if (cfi && onNavigate) {
            onNavigate(cfi);
        }
    };
    
    return (
        <button
            onClick={handleClick}
            style={{
                all: 'unset',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                padding: '20px 0',
                width: '95%',
                margin: '0 auto',
                borderBottom: '1px solid #eee',
                boxSizing: 'border-box',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                cursor: cfi ? 'pointer' : 'default',
                textAlign: 'left',
            }}
        >
            <p style={{
                margin: 0,
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                whiteSpace: 'normal'
            }}>{context}</p>
            <p style={{
                margin: 0,
                color: '#919191',
                fontSize: '14px',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                whiteSpace: 'normal'
            }}>{chapter}</p>
        </button>
    );    
};

const SearchBar = ({ onSearch, isSearching }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchTerm.trim().length >= 2) {
            e.target.blur();
            onSearch(searchTerm.trim());
        }
    };

    const handleBlur = () => {
        if (searchTerm.trim().length >= 2) {
            onSearch(searchTerm.trim());
        } else if (searchTerm.trim().length === 0) {
            onSearch('');
        }
    };

    return (
        <div style={{
            backgroundColor: '#ececec',
            borderRadius: '10px',
            padding: '10px 16px 10px 16px',
            width: '90%',
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            alignItems: 'center'
        }}>
            <LuSearch />
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder="Search in book..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                style={{
                    margin: 0,
                    color: '#919191',
                    fontSize: '14px',
                    wordSpacing: '2px',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    color: searchTerm ? '#000' : '#919191'
                }}
                disabled={isSearching}
            />
            {isSearching && (
                <div style={{
                    fontSize: '12px',
                    color: '#666'
                }}>
                    Searching...
                </div>
            )}
        </div>
    );
};

const Search = ({ book, toc, onNavigate }) => {
    const [allSearchResults, setAllSearchResults] = useState([]);
    const [displayedResults, setDisplayedResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const scrollContainerRef = useRef(null);
    const ITEMS_PER_PAGE = 50;

    const getChapterName = (href) => {
        if (!toc || toc.length === 0) return 'Unknown Chapter';
        
        const cleanHref = href.replace(/^.*\//, '').replace(/#.*$/, '');
        
        const findInToc = (items) => {
            for (const item of items) {
                const cleanItemHref = item.href.replace(/^.*\//, '').replace(/#.*$/, '');
                if (cleanItemHref === cleanHref || item.href.includes(cleanHref)) {
                    return item.label || item.title || 'Chapter';
                }
                if (item.subitems && item.subitems.length > 0) {
                    const found = findInToc(item.subitems);
                    if (found) return found;
                }
            }
            return null;
        };

        return findInToc(toc) || 'Unknown Chapter';
    };

    const loadMoreResults = useCallback(() => {
        if (isLoadingMore || displayedResults.length >= allSearchResults.length) return;

        setIsLoadingMore(true);
        
        setTimeout(() => {
            const nextBatch = allSearchResults.slice(
                displayedResults.length, 
                displayedResults.length + ITEMS_PER_PAGE
            );
            setDisplayedResults(prev => [...prev, ...nextBatch]);
            setIsLoadingMore(false);
        }, 100);
    }, [allSearchResults, displayedResults.length, isLoadingMore]);

    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current || isLoadingMore) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const threshold = 200;

        if (scrollHeight - scrollTop - clientHeight < threshold) {
            loadMoreResults();
        }
    }, [loadMoreResults, isLoadingMore]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const performSearch = async (query) => {
        if (!book || !query) {
            setAllSearchResults([]);
            setDisplayedResults([]);
            setHasSearched(false);
            return;
        }

        setIsSearching(true);
        setHasSearched(true);
        setAllSearchResults([]);
        setDisplayedResults([]);

        try {
            const searchResults = [];
            const spineItems = book.spine.spineItems || [];
            
            for (let i = 0; i < spineItems.length; i++) {
                const spineItem = spineItems[i];
                
                try {
                    if (!spineItem.loaded) {
                        await spineItem.load(book.load.bind(book));
                    }
                    
                    const results = spineItem.find(query);
                    
                    if (results && results.length > 0) {
                        const chapterName = getChapterName(spineItem.href);
                        
                        for (const result of results) {
                            const excerpt = result.excerpt || '';
                            
                            searchResults.push({
                                id: `${i}-${searchResults.length}`,
                                context: excerpt,
                                chapter: chapterName,
                                cfi: result.cfi,
                                href: spineItem.href,
                                spineIndex: i
                            });
                        }
                    }
                    
                    if (spineItem.loaded) {
                        setTimeout(() => {
                            spineItem.unload();
                        }, 100);
                    }
                    
                } catch (chapterError) {
                    console.warn(`Error searching chapter ${i} (${spineItem.href}):`, chapterError);
                    continue;
                }

                if (i % 3 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }

            setAllSearchResults(searchResults);
            setDisplayedResults(searchResults.slice(0, ITEMS_PER_PAGE));
            
        } catch (error) {
            console.error('Search error:', error);
            setAllSearchResults([]);
            setDisplayedResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleNavigateToResult = (cfi) => {
        if (onNavigate) {
            onNavigate(cfi);
        }
    };

    return (
        <div 
            ref={scrollContainerRef}
            style={{ 
                width: "95%", 
                overflowY: "auto", 
                overflowX: "hidden", 
                maxHeight: "100%"
            }}
        >
            <p
                style={{
                fontSize: "25px",
                fontWeight: "700",
                margin: 0,
                marginBottom: "15px",
                marginTop: "15px",
                wordSpacing: "3px",
                }}
            >
                Search
            </p>
            <SearchBar onSearch={performSearch} isSearching={isSearching} />
            
            {hasSearched && !isSearching && (
                <div style={{ marginTop: '20px' }}>
                    {allSearchResults.length > 0 ? (
                        <>
                            <p style={{
                                margin: '10px 0',
                                color: '#666',
                                fontSize: '14px',
                                paddingLeft: '20px'
                            }}>
                                Found {allSearchResults.length} result{allSearchResults.length !== 1 ? 's' : ''}
                            </p>
                            {displayedResults.map((result) => (
                                <SearchResultItem
                                    key={result.id}
                                    chapter={result.chapter}
                                    context={result.context}
                                    cfi={result.cfi}
                                    onNavigate={handleNavigateToResult}
                                />
                            ))}
                            {isLoadingMore && (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    color: '#666',
                                    fontSize: '14px'
                                }}>
                                    Loading more results...
                                </div>
                            )}
                            {displayedResults.length < allSearchResults.length && !isLoadingMore && (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center'
                                }}>
                                    <button
                                        onClick={loadMoreResults}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#f0f0f0',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Load More Results
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p style={{
                            margin: '20px',
                            color: '#666',
                            fontSize: '14px',
                            textAlign: 'center'
                        }}>
                            No results found
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;