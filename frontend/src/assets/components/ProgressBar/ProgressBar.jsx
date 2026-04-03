import React, { useEffect, useState } from 'react';
import styles from '../ProgressBar/ProgressBar.module.css';
import { useNavigate } from 'react-router-dom';

const CircularProgressBar = ({ totalDuration, initialRemaining, endTime }) => {
    const navigate = useNavigate();

    const [remainingTime, setRemainingTime] = useState(null);
    const [isReady, setIsReady] = useState(false); // Чтобы избежать NaN

    const totalLength = 377;

    useEffect(() => {
        if (
            typeof totalDuration === 'number' &&
            typeof initialRemaining === 'number'
        ) {
            setRemainingTime(initialRemaining);
            setIsReady(true);
        }
    }, [totalDuration, initialRemaining]);

    useEffect(() => {
        if (!isReady || remainingTime === null) return;

        const interval = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    endTime()
                    navigate("/home");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isReady, remainingTime, navigate]);

    const formatTime = (seconds) => {
        if (seconds == null || isNaN(seconds)) return '--:--';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours > 0 ? hours + ':' : ''}${minutes > 0 || hours > 0 ? ((minutes < 10) ? '0' + minutes + ':' : minutes + ':') : ''}${secs < 10 ? '0' + secs : secs}`;
    };

    const getProgress = () => {
        if (!isReady || typeof remainingTime !== 'number' || typeof totalDuration !== 'number') {
            return totalLength;
        }
        return (remainingTime / totalDuration) * totalLength;
    };

    return (
        <div className={styles["progress-container"]}>
            <svg width="150" height="150">
                <circle cx="75" cy="75" r="60" stroke="#27AE60" strokeWidth="10" fill="none" />
                <circle
                    className={styles["progress-circle"]}
                    cx="75"
                    cy="75"
                    r="60"
                    stroke="#D2D2D2"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={totalLength}
                    strokeDashoffset={getProgress()}
                />
            </svg>
            <div className={styles["progress-text"]}>
                {formatTime(remainingTime)}
            </div>
        </div>
    );
};

export default CircularProgressBar;
