import { useEffect, useState } from 'react';

export function useCurrentTime(): number {
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1_000);

        return () => clearInterval(interval);
    }, []);

    return currentTime;
}