import { useEffect, useState } from 'react';

export default function () {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    function handleOnlineStatus() {
      setIsOnline(window.navigator.onLine);
    }

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  return isOnline;
}
