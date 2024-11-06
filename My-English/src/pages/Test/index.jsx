import { useEffect, useRef, useState } from 'react';
import TestContainer from '../../components/TestContainer';

const Test = () => {
	const [activeButton, setActiveButton] = useState([]);
	const [isCheck, setIsCheck] = useState(false);
	const [phase, setPhase] = useState(1);
	// const [currentWordNum, setCurrentWordNum] = useState(0);
	const [words, _] = useState([]);
	// 컴포넌트에 width전달, 시작, 중지 메서드
	// const { progress, startTimer, stopTimer } = useTimer(5000); // 5초 타이머
	// 정답 제출
	const onSubmit = () => {
		console.log('=========onSubmit===============');

		// setCurrentWordNum(prev => prev + 1);
		// stopTimer(); // 타이머 정지
		// startTimer(onSubmit); // 다음 단어를 위해 타이머 다시 시작
	};
	console.log('부모');

	// 타이머 만료 시 호출되는 useEffect
	// useEffect(() => {
	// 	if (currentWordNum === 10) {
	// 		stopTimer(); // 타이머 종료
	// 	}
	// }, [currentWordNum, stopTimer]);

	const handleOnTest = () => {
		if (activeButton.length < 1) {
			setIsCheck(true);
			return;
		}
		if (!confirm('시험이 바로 시작됩니다.')) {
			return;
		}

		setPhase(2);
		// startTimer(onSubmit); // phase가 2일 때 타이머 시작
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
	// const loadData = async () => {
	// 	setIsLoading(true); // 로딩 시작
	// 	try {
	// 		const q = query(
	// 			collection(db, 'words'),
	// 			where('classification', '==', classificationValue), // 선택한 classification에 따라 필터링
	// 			orderBy('createdAt', 'desc') // 생성일 기준으로 정렬
	// 		);
	// 		const querySnapshot = await getDocs(q);
	// 		const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	// 		setTableData(data);
	// 	} catch (err) {
	// 		setError("데이터를 불러오는 중 오류가 발생했습니다: " + err.message);
	// 	} finally {
	// 		setIsLoading(false); // 로딩 종료
	// 	}
	// };
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
					activeButton={activeButton}
					isCheck={isCheck}
					handleButtonClick={handleButtonClick}
					handleOnTest={handleOnTest}
					onSubmit={onSubmit}
					words={words}
					handleResult={handleResult}
				/>
			</div>
		</>
	);
};

export default Test;
