// import { useEffect, useState } from 'react';
// import TestContainer from '../../TestContainer';

// const TestLayout = ({
// 	activeButton,
// 	isCheck,
// 	handleButtonClick,
// 	handleOnTest,
// 	phase,
// 	data,
// }) => {
// 	const [progress, setProgress] = useState(100);
// 	const duration = 8000; // 5초
// 	const interval = 100; // 0.1초마다 업데이트
// 	const steps = duration / interval; // 총 몇 번 업데이트할지 계산
// 	const decrement = 100 / steps; // 매 업데이트마다 줄어드는 비율
// 	const activeEnter = e => {
// 		if (e.key === 'Enter') {
// 			onSubmit();
// 		}
// 	};
// 	const onSubmit = () => {
// 		console.log('제출');
// 	};

// 	useEffect(() => {
// 		const timer = setInterval(() => {
// 			setProgress(prev => {
// 				if (prev <= 0) {
// 					clearInterval(timer); // 0%에 도달하면 타이머 종료
// 					return 0;
// 				}
// 				return prev - decrement; // 진행률 감소
// 			});
// 		}, interval);
// 		return () => {
// 			clearInterval(timer);
// 		};
// 	}, []);
// 	return (
// 		<>
// 			<div className="w-[40rem] mx-auto mt-12 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
// 				<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
// 					<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
// 						단어 시험
// 					</h3>
// 				</div>
// 				{/* {phase === 1 ? (
// 					<TestContainer
// 						activeButton={activeButton}
// 						isCheck={isCheck}
// 						handleButtonClick={handleButtonClick}
// 						handleOnTest={handleOnTest}
// 					/>
// 				) : (
// 					<div className="p-6 mt-5 border relative text-center">
// 						<div
// 							className="  h-1 bg-green-500 h-5 absolute top-0 left-0"
// 							style={{
// 								width: `${progress}%`,
// 								height: '12px',
// 								transition: 'width 0.1s ease-in-out',
// 							}}
// 						></div>
// 						<div className="mb-5">
// 							<button className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
// 								???
// 							</button>
// 						</div>
// 						<div
// 							style={{ height: '100px' }}
// 							className="text-center"
// 						>
// 							<label
// 								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
// 								htmlFor="answer"
// 							>
// 								<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
// 									정답을 입력하세요.
// 								</h3>
// 							</label>
// 							<input
// 								onKeyDown={e => activeEnter(e)}
// 								type="text"
// 								name="answer"
// 								className="w-[20rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
// 								required
// 							/>
// 						</div>
// 						<div className="text-center">
// 							<button
// 								type="button"
// 								className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
// 								onClick={onSubmit}
// 							>
// 								제출
// 							</button>
// 						</div>
// 					</div>
// 				)} */}
// 			</div>
// 		</>
// 	);
// };
// export default TestLayout;
