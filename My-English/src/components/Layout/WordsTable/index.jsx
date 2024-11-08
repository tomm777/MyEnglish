import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../../Modal';
import useFocusOutValidation from '../../../hooks/useValidation';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	startAt,
	updateDoc,
} from '@firebase/firestore';
import { db } from '../../../firebase/firebase';
import Loading from '../../Loading';

const WordsTable = ({ props }) => {
	const [editIndex, setEditIndex] = useState(null);
	const [tableData, setTableData] = useState([]);
	const [classification, setClassification] = useState('ALL');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1);
	const lastElementRef = useRef();
	const observer = useRef();
	const [totalLength, setTotalLength] = useState(0);
	const [currentLength, setCurrentLength] = useState(0);
	// let lastVisible = null;
	// Edit 모드의 classification
	const [modifyClassification, setModifyClassification] = useState('');
	// 유효성 검사 hook
	const [wordRef, isCheckWord, handleWordFocusOut, handleResetWordCheck] =
		useFocusOutValidation();
	const [
		meaningRef,
		isCheckMeaning,
		handleMeaningFocusOut,
		handleResetMeaningCheck,
	] = useFocusOutValidation();

	// Edit모드에서 카테고리를 변경할 때 Edit모드 종료
	useEffect(() => {
		setEditIndex(null);
	}, [classification]);
	useEffect(() => {
		console.log('페이지바뀔때마다');

		loadData();
	}, [page]);
	useEffect(() => {
		console.log('데이터바뀔때마다');
		observer.current = new IntersectionObserver(observerCallback);
		// const observer = new IntersectionObserver(observerCallback);
		if (lastElementRef.current) {
			observer.current.observe(lastElementRef.current);
		}

		return () => {
			if (lastElementRef.current) {
				// observer.unobserve(lastElementRef.current);
				observer.current.disconnect();
			}
		};
	}, [lastElementRef, tableData, page]);

	const observerCallback = entries => {
		if (totalLength <= currentLength) {
			console.log('모든 데이터가 로드되었습니다.');
			setIsLoading(false);
			return;
		}
		if (entries[0].isIntersecting && !isLoading) {
			setIsLoading(true);
			setPage(prev => prev + 1);
			console.log('끝');
		}
	};

	// 데이터 로드
	const loadData = async () => {
		setIsLoading(true);
		try {
			const totalSnapshot = await getDocs(query(collection(db, 'words')));
			setTotalLength(totalSnapshot.docs.length);

			const q = query(
				collection(db, 'words'),
				orderBy('createdAt', 'asc'),
				limit(20),
			);
			console.log(page);

			// 첫 페이지 데이터 로드
			if (page === 1) {
				const getData = await getDocs(q);
				const data = getData.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				}));
				setCurrentLength(data.length);
				setTableData(data);
			} else {
				// 두 번째 페이지 이상에서 데이터 로드
				const documentSnapshots = await getDocs(q);
				const lastVisible =
					documentSnapshots.docs[documentSnapshots.docs.length - 1];

				// 다음 페이지 데이터 로드
				const next = await getDocs(
					query(
						collection(db, 'words'),
						orderBy('createdAt', 'asc'),
						startAfter(lastVisible),
						limit(20),
					),
				);

				const nextData = next.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				}));
				setTableData(prevData => [...prevData, ...nextData]); // 기존 데이터와 병합
				// 현재 데이터 개수 업데이트
				setCurrentLength(prev => prev + nextData.length);
			}
			// 현재 데이터 개수
		} catch (err) {
			console.error(
				'데이터를 불러오는 중 오류가 발생했습니다:',
				err.message,
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Table Data에서 select 박스 옵션 변경 핸들러
	// 필터링된 데이터 계산
	const filteredData = useMemo(() => {
		return classification === 'ALL'
			? tableData
			: tableData.filter(item => item.classification === classification);
	}, [classification, tableData]);

	// 품사 구분
	const getPartOfSpeech = classification => {
		if (classification === 'V') return '동사';
		if (classification === 'A') return '형용사';
		if (classification === 'N') return '명사';
		if (classification === 'AD') return '부사';
		return '숙어';
	};
	const handleChange = value => {
		setClassification(value);
	};

	// Edit 모드에서의 select 박스
	const handleEditChange = e => {
		const { value } = e.target;
		setModifyClassification(value);
	};
	// 수정 후 저장
	const handleSave = async id => {
		if (isCheckWord || isCheckMeaning) {
			return;
		}
		const docRef = doc(db, 'words', id);
		const newData = {
			word: wordRef.current.value,
			meaning: meaningRef.current.value,
			classification: modifyClassification,
		};
		await updateDoc(docRef, newData);
		setEditIndex(null);
		loadData();
	};
	// 수정 취소
	const handleCancel = () => {
		// Input에 잘못된 값 입력 후 취소 시 false로 초기화
		if (isCheckMeaning) {
			handleResetMeaningCheck();
		}
		if (isCheckWord) {
			handleResetWordCheck();
		}
		setEditIndex(null);
	};
	// 수정 버튼 클릭 이벤트
	const handleEdit = index => {
		setModifyClassification(tableData[index].classification);
		setEditIndex(index);
	};
	// 삭제 버튼 클릭 이벤트
	const handleRemove = async id => {
		console.log(id);

		try {
			const docRef = doc(db, 'words', id);
			await deleteDoc(docRef);
			// loadData();
			setTableData(prevData => prevData.filter(item => item.id !== id));
		} catch (error) {
			console.log(error);
		}
	};
	const openModal = () => {
		handleCancel();
		setIsModalOpen(true); // 모달 열기
	};
	const closeModal = () => {
		setIsModalOpen(false); // 모달 닫기
	};
	// 단어 추가
	const handleAddWord = async newWord => {
		try {
			const addDateWord = {
				...newWord,
				createdAt: Date.now(),
			};
			await addDoc(collection(db, 'words'), addDateWord);
			loadData(); // 데이터 재로드
			setIsModalOpen(false); // 모달 닫기
		} catch (err) {
			console.log(err);

			throw new Error('err', err);
		}

		// setTableData(prevData => [...prevData, newWord]);
		// // setUpdatedData(prevData => [...prevData, newWord]);
		// setIsModalOpen(false);
	};
	return (
		<>
			{isModalOpen && (
				<Modal onClose={closeModal} onAddWord={handleAddWord} />
			)}
			{isLoading && <Loading />} {/* 로딩 중일 때 로딩 스피너 표시 */}
			{!isLoading && (
				<div
					style={{
						maxWidth: '90rem',
						margin: '0 auto',
					}}
				>
					{props === 'edit' ? (
						<div className="flex justify-end ">
							<button
								onClick={openModal}
								type="button"
								className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
							>
								단어추가
							</button>
						</div>
					) : (
						''
					)}
					<table className="border-collapse border table-auto w-full">
						<thead>
							<tr>
								<th className="border-b border-r dark:border-slate-600 font-medium p-2 pl-4 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left w-1/12">
									번호
								</th>
								<th className="border-b border-r dark:border-slate-600 font-medium p-4 pl-4 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left w-1/4">
									영어
								</th>
								<th className="border-b border-r dark:border-slate-600 font-medium p-4 pl-4 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left w-1/4 min-w-28">
									뜻
								</th>
								<th className="border-b border-r dark:border-slate-600 font-medium p-4 pl-4 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left w-1/4">
									<select
										id="classification"
										value={classification}
										name="classification"
										className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 font-medium"
										onChange={e =>
											handleChange(e.target.value)
										}
									>
										<option
											value={'ALL'}
											label="전체"
										></option>
										<option
											value={'V'}
											label="동사"
										></option>
										<option
											value={'N'}
											label="명사"
										></option>
										<option
											value={'A'}
											label="형용사"
										></option>
										<option
											value={'AD'}
											label="부사"
										></option>
										<option
											value={'OTHER'}
											label="숙어"
										></option>
									</select>
								</th>
								{props === 'edit' ? (
									<th
										className="border-b border-r dark:border-slate-600 font-medium p-4 pl-4 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left"
										style={{ width: '12%' }}
									>
										편집
									</th>
								) : (
									''
								)}
							</tr>
						</thead>
						<tbody>
							{filteredData.map((data, index) => (
								<tr key={data.id}>
									<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
										{Number(index) + 1}
									</td>
									<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
										{editIndex === index &&
										props === 'edit' ? (
											<>
												<input
													type="text"
													name="word"
													ref={wordRef}
													defaultValue={data.word}
													onBlur={handleWordFocusOut}
													className="border rounded p-0"
												/>
												{isCheckWord && (
													<p className="mt-2 text-sm text-red-600 dark:text-red-500">
														<span className="font-medium">
															영어를 올바르게
															입력하세요.
														</span>
													</p>
												)}
											</>
										) : (
											data.word
										)}
									</td>
									<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
										{editIndex === index &&
										props === 'edit' ? (
											<>
												<input
													type="text"
													ref={meaningRef}
													defaultValue={data.meaning}
													name="meaning"
													onBlur={
														handleMeaningFocusOut
													}
													className="border rounded p-0"
												/>
												{isCheckMeaning && (
													<p className="mt-2 text-sm text-red-600 dark:text-red-500">
														<span className="font-medium">
															한글을 올바르게
															입력하세요.
														</span>
													</p>
												)}
											</>
										) : (
											data.meaning
										)}
									</td>
									<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
										{editIndex === index &&
										props === 'edit' ? (
											<select
												value={modifyClassification}
												onChange={handleEditChange}
												className="border rounded p-0"
											>
												<option value="V">동사</option>
												<option value="A">
													형용사
												</option>
												<option value="N">명사</option>
												<option value="AD">부사</option>
												<option value="OTHER">
													숙어
												</option>
											</select>
										) : (
											getPartOfSpeech(data.classification)
										)}
									</td>
									{props === 'edit' ? (
										<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
											{editIndex === index ? (
												<>
													<button
														type="button"
														onClick={() =>
															handleSave(data.id)
														}
														className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
													>
														저장
													</button>
													<button
														type="button"
														onClick={handleCancel}
														className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-1 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
													>
														취소
													</button>
												</>
											) : (
												<>
													<button
														type="button"
														onClick={() =>
															handleEdit(index)
														}
														className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-4 py-1 me-2 mb-2"
													>
														수정
													</button>
													<button
														type="button"
														onClick={() =>
															handleRemove(
																data.id,
															)
														}
														className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-1 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
													>
														삭제
													</button>
												</>
											)}
										</td>
									) : (
										''
									)}
								</tr>
							))}
							<tr ref={lastElementRef}>
								<td colSpan="4" className="text-center"></td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
		</>
	);
};
export default WordsTable;
