import { useEffect, useState } from 'react';
import TestContainer from '../../components/TestContainer';
import TestLayout from '../../components/Layout/TestLayout';

const buttons = [
	{ index: 1, value: '동사', class: 'V' },
	{ index: 2, value: '형용사', class: 'A' },
	{ index: 3, value: '부사', class: 'AD' },
	{ index: 4, value: '명사', class: 'N' },
	{ index: 5, value: '숙어', class: 'I' },
];
const Test = () => {
	const [activeButton, setActiveButton] = useState([]);
	const [isCheck, setIsCheck] = useState(false);
	const [phase, setPhase] = useState(1);
	const [progress, setProgress] = useState(100);
	const [currentWordNum, setCurrentWordNum] = useState(1);

	const handleOnTest = () => {
		if (activeButton.length < 1) {
			setIsCheck(true);
			return;
		}
		// API
		confirm('시험이 바로 시작됩니다.');
		setPhase(2);
	};
	const handleButtonClick = index => {
		setActiveButton(prev => {
			// 이미 선택된 버튼이면 제거, 그렇지 않으면 추가
			if (prev.includes(index)) {
				return prev.filter(i => i !== index);
			} else {
				setIsCheck(false);
				return [...prev, index];
			}
		});
	};
	//

	const activeEnter = e => {
		if (e.key === 'Enter') {
			onSubmit();
		}
	};
	const onSubmit = () => {
		console.log('제출');
		console.log(currentWordNum);

		setCurrentWordNum(prev => prev + 1);
	};
	return (
		<>
			{/* <TestLayout
				phase={phase}
				data="data"
				activeButton={activeButton}
				isCheck={isCheck}
				handleButtonClick={handleButtonClick}
				handleOnTest={handleOnTest}
			/> */}
			<div className="w-[40rem] mx-auto mt-12 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
						단어 시험
					</h3>
				</div>
				<TestContainer
					phase={phase}
					data={buttons}
					progress={progress}
					activeEnter={activeEnter}
					currentWordNum={currentWordNum}
					activeButton={activeButton}
					isCheck={isCheck}
					handleButtonClick={handleButtonClick}
					handleOnTest={handleOnTest}
					onSubmit={onSubmit}
				/>
			</div>
		</>
	);
};
export default Test;
