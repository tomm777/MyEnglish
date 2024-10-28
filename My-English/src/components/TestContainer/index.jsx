import { useEffect, useRef, useState } from 'react';

const buttons = [
	{ index: 1, value: '동사', class: 'V' },
	{ index: 2, value: '형용사', class: 'A' },
	{ index: 3, value: '부사', class: 'AD' },
	{ index: 4, value: '명사', class: 'N' },
	{ index: 5, value: '숙어', class: 'I' },
];

const TestContainer = ({
	activeButton,
	isCheck,
	handleButtonClick,
	handleOnTest,
	phase,
	onSubmit,
	currentWordNum,
	activeEnter,
}) => {
	const [progress, setProgress] = useState(100);
	const inputRef = useRef('');
	const timerRef = useRef(null);

	useEffect(() => {
		const duration = 5000;
		const interval = 100; // 0.1초마다 업데이트
		const steps = duration / interval;
		const decrement = 100 / steps;

		if (phase === 2) {
			clearInterval(timerRef.current); // 이전 타이머 종료
			timerRef.current = setInterval(() => {
				setProgress(prev => {
					if (prev <= 0) {
						clearInterval(timerRef.current);
						return 0;
					}
					return prev - decrement;
				});
			}, interval);
		}

		return () => clearInterval(timerRef.current); // 컴포넌트 언마운트 시 타이머 종료
	}, [phase]);

	useEffect(() => {
		if (currentWordNum === 10) {
			setProgress(0); // 진행률을 0으로 설정
			clearInterval(timerRef.current); // 타이머 종료
		}
	}, [currentWordNum]);

	const handleSubmit = () => {
		setProgress(100); // 타이머 초기화
		onSubmit(); // 부모의 onSubmit 호출
		inputRef.current.value = '';
	};

	return (
		<>
			{phase === 1 ? (
				<>
					<div className="p-5">
						<p className="text-gray-500 whitespace-nowrap dark:text-gray-400">
							본인이 추가한 영단어 중 10개의 단어가 무작위로
							출제됩니다.
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
							<p className="mt-2 text-sm text-red-600 dark:text-red-500">
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
			) : (
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
							???
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
					<div className="text-center">
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
		</>
	);
};

export default TestContainer;
