import React, { useState, useEffect } from "react";
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
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

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

    const performSearch = async (query) => {
        if (!book || !query) {
            setSearchResults([]);
            setHasSearched(false);
            return;
        }

        setIsSearching(true);
        setHasSearched(true);

        try {
            const searchResults = [];
            
            for (let i = 0; i < book.spine.length; i++) {
                const spineItem = book.spine.get(i);
                try {
                    await spineItem.load(book.load.bind(book));
                    const results = spineItem.find(query);
                    for (const result of results) {
                        const chapterName = getChapterName(spineItem.href);
                        const excerpt = result.excerpt || '';
                        searchResults.push({
                            id: `${i}-${searchResults.length}`,
                            context: excerpt,
                            chapter: chapterName,
                            cfi: result.cfi,
                            href: spineItem.href
                        });
                    }
                    spineItem.unload();
                } catch (chapterError) {
                    console.warn('Error searching chapter:', spineItem.href, chapterError);
                }
            }

            setSearchResults(searchResults);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
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
        <div style={{ width: "95%", overflowY: "auto", overflowX: "hidden", maxHeight: "100%"}}>
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
                    {searchResults.length > 0 ? (
                        <>
                            <p style={{
                                margin: '10px 0',
                                color: '#666',
                                fontSize: '14px',
                                paddingLeft: '20px'
                            }}>
                                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                            </p>
                            {searchResults.map((result) => (
                                <SearchResultItem
                                    key={result.id}
                                    chapter={result.chapter}
                                    context={result.context}
                                    cfi={result.cfi}
                                    onNavigate={handleNavigateToResult}
                                />
                            ))}
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