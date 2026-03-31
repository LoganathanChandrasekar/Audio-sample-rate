import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to check media device availability.
 * Tests microphone access and reports status.
 */
const useMediaDevices = () => {
  const [hasMicrophone, setHasMicrophone] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'granted' | 'denied' | 'prompt'
  const [checking, setChecking] = useState(true);

  const checkDevices = useCallback(async () => {
    setChecking(true);
    try {
      // Check if MediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        setHasMicrophone(false);
        setChecking(false);
        return;
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter((d) => d.kind === 'audioinput');
      setHasMicrophone(audioInputs.length > 0);

      // Check permission status if API available
      if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' });
          setPermissionStatus(result.state);

          result.addEventListener('change', () => {
            setPermissionStatus(result.state);
          });
        } catch {
          // Permission API not supported for microphone in some browsers
        }
      }
    } catch (err) {
      console.error('Error checking media devices:', err);
    } finally {
      setChecking(false);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermissionStatus('granted');
      return true;
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setPermissionStatus('denied');
      }
      return false;
    }
  }, []);

  useEffect(() => {
    checkDevices();
  }, [checkDevices]);

  return {
    hasMicrophone,
    permissionStatus,
    isPermissionGranted: permissionStatus === 'granted',
    isPermissionDenied: permissionStatus === 'denied',
    checking,
    requestPermission,
    recheckDevices: checkDevices,
  };
};

export default useMediaDevices;
