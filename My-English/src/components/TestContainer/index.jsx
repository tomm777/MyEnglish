import { useEffect, useRef, useState } from 'react';
import useTimer from '../../hooks/useTimer';
import WordsTable from '../Layout/WordsTable';
import ResultTable from '../ResultTable';

const TestContainer = ({
	activeButton,
	isCheck,
	handleButtonClick,
	handleOnTest,
	phase,
	handleResult,
	buttons,
	words,
}) => {
	const inputRef = useRef('');
	const [currentNum, setcurrentNum] = useState(0);
	const [wordsMeaning, setWordsMeaning] = useState([]);
	const handleSubmit = () => {
		const inputValue = inputRef.current.value;
		setWordsMeaning(prev => [...prev, inputValue]);
		inputRef.current.value = '';
		setcurrentNum(prev => prev + 1);

		stopTimer();
		startTimer();
	};
	const { progress, startTimer, stopTimer } = useTimer(5000, handleSubmit); // 5초 타이머

	useEffect(() => {
		if (phase === 2) {
			inputRef.current.focus();
			startTimer();
		} else {
			stopTimer();
		}
	}, [phase, stopTimer, startTimer]);
	useEffect(() => {
		if (currentNum === 10) {
			stopTimer();
		}
	}, [currentNum, stopTimer]);

	// 엔터 프레스
	const activeEnter = e => {
		if (e.key === 'Enter') {
			handleSubmit();
			e.target.value = '';
		}
	};
	// 결과 페이지에 정보 전달
	// const handleMoveResult = () => {
	// 	navigate('/test/result', { state: { wordsMeaning } });
	// 	console.log('Navigating...'); // 이 로그가 찍혀야 합니다.
	// };

	return (
		<>
			{phase === 1 && (
				<>
					<div className="p-5">
						<p className="text-gray-500 whitespace-nowrap dark:text-gray-400">
							추가된 영단어 중 10개의 단어가 무작위로 출제됩니다.
						</p>
					</div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white p-5">
						품사 선택
					</h3>
					<div className="p-5">
						{buttons.map(item => (
							<button
								key={item.index}
								onClick={() => handleButtonClick(item.index)}
								className={`text-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
								${activeButton.includes(item.index) ? 'text-white bg-blue-700' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
							>
								{item.value}
							</button>
						))}
						{isCheck && (
							<p className="mt-2 text-sm text-red-600 dark:text-red-500 absolute">
								<span className="font-medium">
									품사를 선택해주세요
								</span>
							</p>
						)}
					</div>
					<div className="text-center mt-10">
						<button
							type="button"
							onClick={handleOnTest}
							className="focus:outline-none text-white bg-violet-700 hover:bg-violet-400 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700"
						>
							시험응시
						</button>
					</div>
				</>
			)}
			{phase === 2 && currentNum <= 9 && (
				<div className="p-6 mt-5 border relative text-center">
					<div
						className="h-1 bg-green-500 absolute top-0 left-0"
						style={{
							width: `${progress}%`,
							height: '12px',
							transition: 'width 0.1s ease-in-out',
						}}
					></div>
					<div className="mb-5">
						<button className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
							{/* {data.button.value} */}
							{words[currentNum]?.word}
						</button>
					</div>
					<div style={{ height: '100px' }} className="text-center">
						<label
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							htmlFor="answer"
						>
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
								정답을 입력하세요.
							</h3>
						</label>
						<input
							ref={inputRef}
							onKeyDown={e => activeEnter(e)}
							type="text"
							name="answer"
							className="w-[20rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							required
						/>
					</div>
					<div className="text-center mt-5">
						<button
							type="button"
							className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
							onClick={handleSubmit}
						>
							제출
						</button>
					</div>
				</div>
			)}
			{phase === 2 && currentNum === 10 && (
				<div className="text-center mt-5">
					<p className="text-gray-500 whitespace-nowrap dark:text-gray-400">
						시험이 종료되었습니다.
					</p>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
						onClick={handleResult}
					>
						결과 보러가기
					</button>
				</div>
			)}
			{phase === 3 && (
				<div>
					<ResultTable
						correctAnswers={words}
						myAnswers={wordsMeaning}
					/>
					{/* {wordsMeaning.map((word, index) => (
						<li key={index}>{word}</li>
					))} */}
				</div>
			)}
		</>
	);
};

export default TestContainer;

// const timerRef = useRef(null);
// useEffect(() => {
// 	const duration = 5000;
// 	const interval = 100; // 0.1초마다 업데이트
// 	const steps = duration / interval;
// 	const decrement = 100 / steps;

// 	if (phase === 2) {
// 		clearInterval(timerRef.current); // 이전 타이머 종료
// 		timerRef.current = setInterval(() => {
// 			setProgress(prev => {
// 				if (prev <= 0) {
// 					clearInterval(timerRef.current);
// 					handleSubmit();

// 					return 0;
// 				}
// 				return prev - decrement;
// 			});
// 		}, interval);
// 	}

// 	return () => {
// 		clearInterval(timerRef.current); // 컴포넌트 언마운트 시 타이머 종료
// 	};
// }, [phase]);

// useEffect(() => {
// 	if (currentNum === 10) {
// 		setProgress(0); // 진행률을 0으로 설정
// 		clearInterval(timerRef.current); // 타이머 종료
// 	}
// }, [currentNum]);
