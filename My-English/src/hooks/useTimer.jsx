import { useEffect, useRef, useState, useCallback } from 'react';

const useTimer = (duration, onTimeOut) => {
	const [progress, setProgress] = useState(100);
	const timerRef = useRef(null);
	// 타이머 시작
	// console.log('TIMER');

	const startTimer = useCallback(() => {
		const interval = 100; // 0.1초마다 업데이트
		const steps = duration / interval;
		const decrement = 100 / steps;

		timerRef.current = setInterval(() => {
			setProgress(prev => {
				if (prev <= 0) {
					clearInterval(timerRef.current);
					if (onTimeOut) onTimeOut('on'); // 타이머가 끝났을 때 호출
					return 0;
				}
				return prev - decrement;
			});
		}, interval);
	}, [duration]);

	const stopTimer = useCallback(() => {
		clearInterval(timerRef.current); // 타이머 종료
		setProgress(100); // 진행률 초기화
	}, []);
	useEffect(() => {
		return () => clearInterval(timerRef.current); // 컴포넌트 언마운트 시 타이머 종료
	}, []);

	return { progress, startTimer, stopTimer };
};

export default useTimer;
