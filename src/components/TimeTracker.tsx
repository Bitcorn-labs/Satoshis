import React, { useState, useRef, useEffect } from 'react';

interface TimeTrackerProps {
  bStartTimer: boolean;
  bStopTimer: boolean;
  bResetTimer: boolean;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({
  bStartTimer,
  bStopTimer,
  bResetTimer,
}) => {
  const [time, setTime] = useState(0); // Time in hundredths of a second
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startTimer();
  }, [bStartTimer]);

  useEffect(() => {
    stopTimer();
  }, [bStopTimer]);

  useEffect(() => {
    resetTimer();
  }, [bResetTimer]);

  // Start the timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      const startTime = Date.now() - time; // Adjust for current elapsed time
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10); // Update every 10ms for hundredth of a second precision
    }
  };

  // Stop the timer
  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resetTimer = () => {
    setTime(0);
  };

  // Format time to display as seconds with hundredths
  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const hundredths = Math.floor((time % 1000) / 10);
    return `${seconds}.${hundredths < 10 ? '0' : ''}${hundredths} seconds`;
  };

  // Cleanup the interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      {formatTime(time)}
      {/* <button onClick={startTimer} disabled={isRunning}>
        Start
      </button>
      <button onClick={stopTimer} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={resetTimer} disabled={isRunning}>
        reset
      </button> */}
    </>
  );
};

export default TimeTracker;
