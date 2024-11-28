import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../../Modal';
import useFocusOutValidation from '../../../hooks/useValidation';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	startAfter,
	startAt,
	updateDoc,
	where,
} from '@firebase/firestore';
import { db } from '../../../firebase/firebase';
import Loading from '../../Loading';
import { useAuth } from '../../../contexts/AuthContext';

const WordsTable = ({ props }) => {
	const [editIndex, setEditIndex] = useState(null);
	const [tableData, setTableData] = useState([]);
	const [classification, setClassification] = useState('ALL');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	// const [page, setPage] = useState(1);
	const lastElementRef = useRef();
	const observerRef = useRef();
	const [totalLength, setTotalLength] = useState(0);
	const [currentLength, setCurrentLength] = useState(0);
	// 무한스크롤의 호출을 위한 배열의 요소
	const [lastVisible, setLastVisible] = useState(null);
	// Edit 모드의 classification
	const [isLoadingMore, setIsLoadingMore] = useState(false); // 추가 로딩 상태
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
	// 유저 정보
	const { authUser } = useAuth();

	// Edit모드에서 카테고리를 변경할 때 Edit모드 종료
	useEffect(() => {
		setEditIndex(null);
	}, [classification]);
	useEffect(() => {
		observerRef.current = new IntersectionObserver(observerCallback);
		if (lastElementRef.current) {
			observerRef.current.observe(lastElementRef.current);
		}
		return () => {
			if (lastElementRef.current) {
				// observerRef.unobserve(lastElementRef.current);
				observerRef.current.disconnect();
			}
		};
	}, [lastElementRef.current, tableData]);
	useEffect(() => {
		setIsLoading(true);
		if (!authUser) {
			setIsLoading(false);
			return;
		}

		const q = query(
			collection(db, 'words'),
			where('userId', '==', authUser.uid),
			orderBy('createdAt', 'asc'),
			limit(20),
		);

		// Firestore 실시간 업데이트
		const unsubscribe = onSnapshot(
			q,
			snapshot => {
				const updatedData = snapshot.docs
					.map(doc => ({
						id: doc.id,
						...doc.data(),
					}))
					.filter(doc => doc.userId === authUser.uid);
				setTableData(updatedData);

				// if (snapshot.size <= 20) {
				// 	setTotalLength(snapshot.size); // 전체 데이터 개수 업데이트
				// }

				setCurrentLength(updatedData.length); // 현재 데이터 개수 업데이트

				if (snapshot.docs.length > 0) {
					setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // 마지막 문서 저장
				}
			},
			error => {
				console.error('Snapshot error:', error);
			},
			fetchTotalLength(),
		);
		setIsLoading(false);
		// 컴포넌트 언마운트 시 리스너 해제
		return () => unsubscribe();
	}, []);
	const fetchTotalLength = async () => {
		// 전체 데이터 개수
		const totalSnapshot = await getDocs(
			query(collection(db, 'words'), where('userId', '==', authUser.uid)),
		);
		setTotalLength(totalSnapshot.docs.length); // 전체 데이터 개수 업데이트
	};
	// observe 동작
	const observerCallback = entries => {
		if (window.location.pathname === '/test') {
			return;
		}
		console.log(totalLength, 'totalLength', currentLength, 'currentLength');
		if (totalLength <= currentLength) {
			console.log('모든 데이터가 로드되었습니다.');
			// setIsLoading(false);
			return;
		}
		if (entries[0].isIntersecting && !isLoadingMore) {
			loadData(); // 다음 데이터 로드
		}
	};

	// 추가 데이터 로드
	const loadData = async () => {
		if (!lastVisible) return;
		setIsLoadingMore(true);
		console.log('API 호출');

		// setIsLoading(true);
		try {
			// 기존 20개의 초기 데이터 이 후의 처리
			const nextQuery = query(
				collection(db, 'words'),
				where('userId', '==', authUser.uid),
				orderBy('createdAt', 'asc'),
				startAfter(lastVisible),
				limit(20),
			);

			const nextData = await getDocs(nextQuery);
			const nextDocs = nextData.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}));
			// 다음 호출을 위한 마지막 요소
			setLastVisible(nextData.docs[nextData.docs.length - 1]);

			console.log(nextDocs);
			if (nextDocs.length > 0) {
				setTableData(prevData => {
					const existingIds = new Set(prevData.map(item => item.id));

					const uniqueNextDocs = nextDocs.filter(
						item => !existingIds.has(item.id),
					);

					return [...prevData, ...uniqueNextDocs]; // 기존 데이터와 병합
				});
			}
			setCurrentLength(prev => prev + nextDocs.length);
		} catch (err) {
			console.error(
				'데이터를 불러오는 중 오류가 발생했습니다:',
				err.message,
			);
		} finally {
			setIsLoadingMore(false);
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
		// 중복 체크
		const q = query(
			collection(db, 'words'),
			where('word', '==', wordRef.current.value),
			where('userId', '==', authUser.uid),
		);
		const querySnapshot = await getDocs(q);

		// 중복된 단어가 있는 경우 처리
		if (!querySnapshot.empty) {
			alert('이 단어는 이미 존재합니다.'); // 중복 경고
			return; // 함수 종료
		}

		const docRef = doc(db, 'words', id);
		const newData = {
			word: capitalizeWord(wordRef.current.value),
			meaning: meaningRef.current.value,
			classification: modifyClassification,
			userId: authUser.uid,
		};
		await updateDoc(docRef, newData);
		if (currentLength >= 20) {
			setTableData(prevData =>
				prevData.map(item =>
					item.id === id ? { ...item, ...newData } : item,
				),
			);
		}
		setEditIndex(null);
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
		try {
			const docRef = doc(db, 'words', id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists() && docSnap.data().userId === authUser.uid) {
				await deleteDoc(docRef);
			}
			if (currentLength > 20) {
				setCurrentLength(prev => (prev > 0 ? prev - 1 : 0));
			}
			setTotalLength(prev => (prev > 0 ? prev - 1 : 0));
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
			if (!authUser) {
				throw new Error('로그인 후 이용해주세요.');
			}

			const addDateWord = {
				...newWord,
				createdAt: Date.now(),
				userId: authUser.uid, // Add user ID to the word document
			};

			const docRef = await addDoc(collection(db, 'words'), addDateWord);
			// 초기 데이터는 firebase에서 실시간으로 업데이트 하기때문에 추후의 데이터는 별도로 관리
			if (currentLength >= 20) {
				setTableData(prevData => [
					...prevData,
					{ id: docRef.id, ...addDateWord }, // Firestore에서 생성된 ID를 포함
				]);
			}
			if (currentLength >= 20) {
				setCurrentLength(prev => prev + 1);
			}
			setTotalLength(prev => prev + 1);
			setIsModalOpen(false); // 모달 닫기
		} catch (err) {
			console.log(err);
			throw new Error('err', err);
		}
	};
	// 첫글자 대문자로 변환
	const capitalizeWord = str => {
		const newStr = str.trim();
		return newStr.charAt(0).toUpperCase() + newStr.slice(1);
	};
	return (
		<>
			{isModalOpen && (
				<Modal onClose={closeModal} onAddWord={handleAddWord} />
			)}
			{isLoading && <Loading />}
			{isLoadingMore && <Loading />}
			{/* 로딩 중일 때 로딩 스피너 표시 */}
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
// 모든 단어개수

// 첫 페이지 데이터 로드
// if (page === 1) {
// 	const q = query(
// 		collection(db, 'words'),
// 		orderBy('createdAt', 'asc'),
// 		limit(20),
// 	);
// 	const getData = await getDocs(q);
// 	const data = getData.docs.map(doc => ({
// 		id: doc.id,
// 		...doc.data(),
// 	}));
// 	setCurrentLength(data.length);
// 	setTableData(data);
// 	setLastVisible(getData.docs[getData.docs.length - 1]); // 마지막 문서 저장
// } else {
// 	const q = query(
// 		collection(db, 'words'),
// 		orderBy('createdAt', 'asc'),
// 		limit(20),
// 	);

// 	// 두 번째 페이지 이상에서 데이터 로드
// 	const documentSnapshots = await getDocs(q);
// 	console.log(documentSnapshots);

// 	const lastVisible =
// 		documentSnapshots.docs[documentSnapshots.docs.length - 1];

// 	// 다음 페이지 데이터 로드
// 	const nextData = await getDocs(
// 		query(
// 			collection(db, 'words'),
// 			orderBy('createdAt', 'asc'),
// 			startAfter(lastVisible),
// 			limit(20),
// 		),
// 	);

// 	const next = nextData.docs.map(doc => ({
// 		id: doc.id,
// 		...doc.data(),
// 	}));
// 	console.log(next);

// 	if (next.length > 0) {
// 		setTableData(prevData => [...prevData, ...next]); // 기존 데이터와 병합
// 		setLastVisible(nextData.docs[nextData.docs.length - 1]); // 새로운 마지막 문서 저장
// 		setCurrentLength(prev => prev + next.length);
// 	}
// }
