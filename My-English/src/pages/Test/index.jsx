import { useEffect, useRef, useState } from 'react';
import TestContainer from '../../components/TestContainer';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { db } from '../../firebase/firebase';
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
	const [words, setWords] = useState([]);
	const handleOnTest = () => {
		console.log(activeButton[1]);
		const arr = [];
		if (activeButton.length < 1) {
			setIsCheck(true);
			return;
		}
		if (getRandomWords(words, 10).length < 10) {
			alert(
				'추가된 영단어가 10개 미만입니다. 더 많은 단어를 추가해주세요.',
			);
			return;
		}
		if (!confirm('시험이 바로 시작됩니다.')) {
			return;
		} else {
			activeButton.map(item => arr.push(buttons[item - 1].class));
			loadData(arr);

			setPhase(2);
		}
	};

	const getRandomWords = (arr, count) => {
		const shuffled = arr.sort(() => Math.random() - 0.5);
		return shuffled.slice(0, count);
	};
	// 품사 선택
	const handleButtonClick = index => {
		setActiveButton(prev => {
			if (prev.includes(index)) {
				return prev.filter(i => i !== index);
			} else {
				setIsCheck(false);
				return [...prev, index];
			}
		});
	};
	const handleResult = () => {
		setPhase(3);
	};
	const loadData = async arr => {
		try {
			const queryList = query(
				collection(db, 'words'),
				where('classification', 'in', arr), // 선택한 classification에 따라 필터링
			);
			const getData = await getDocs(queryList);
			const data = getData.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}));

			setWords(getRandomWords(data, 10));
		} catch (err) {
			throw new Error(err);
		}
	};
	return (
		<>
			<div className="w-[40rem] mx-auto mt-12 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
						{phase === 3 ? '단어 시험 결과' : '단어 시험'}
					</h3>
				</div>
				<TestContainer
					phase={phase}
					// progress={progress}
					// activeEnter={activeEnter}
					// currentWordNum={currentWordNum}
					loadData={loadData}
					activeButton={activeButton}
					isCheck={isCheck}
					handleButtonClick={handleButtonClick}
					handleOnTest={handleOnTest}
					words={words}
					handleResult={handleResult}
					buttons={buttons}
				/>
			</div>
		</>
	);
};

export default Test;
