import { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
function useInfiniteScroll(fetchData: (currentPage: number) => Promise<any[]>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const throttledFetchData = useRef(_.throttle(fetchData, 1000)).current;
    const handleScroll = useCallback(() => {
        const bottomOffset = 10;
        if (window.innerHeight + document.documentElement.scrollTop + bottomOffset >= document.documentElement.offsetHeight) {
            if (!isFetching && hasMore) setIsFetching(true);
        }
    }, [isFetching, hasMore]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (!isFetching) return;
        throttledFetchData(currentPage).then(newItems => {
            setIsFetching(false);
            if (newItems?.length > 0) {
                setItems(prevItems => [...prevItems, ...newItems]);
                setCurrentPage(currentPage + 1);
            }else{
                setHasMore(false);
            }
        });
    }, [isFetching, throttledFetchData, currentPage]);

    useEffect(() => {
        setIsFetching(true);
    }, []);

    useEffect(() => {
        return () => {
            throttledFetchData.cancel();

        };
    }, [throttledFetchData]);

    return {items, isFetching, hasMore};
}

export default useInfiniteScroll;