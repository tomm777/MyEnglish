import { useEffect, useState } from 'react';
import data from '../../../../public/Data/mockData.json';
import Modal from '../../Modal';

const WordsTable = () => {
	const type = 'edit';
	const [editIndex, setEditIndex] = useState(null);
	const [tableData, setTableData] = useState([]);
	const [category, setCatecory] = useState('ALL');
	const [isModalOpen, setIsModalOpen] = useState(false);
	// const [editMode, setEditMode] = useState(false);
	const [updatedData, setUpdatedData] = useState(tableData);
	useEffect(() => {
		setTableData(data);
		setUpdatedData(data);
	}, []);
	// Edit모드에서 카테고리를 변경할 때 Edit모드 종료
	useEffect(() => {
		setEditIndex(null);
	}, [category]);
	// Table Data에서 select 박스 옵션 변경 핸들러
	const handleChange = value => {
		setCatecory(value);
	};

	const filteredData =
		category === 'ALL'
			? tableData
			: tableData.filter(item => item.classification === category);

	// 품사 구분
	const getPartOfSpeech = classification => {
		if (classification === 'V') return '동사';
		if (classification === 'A') return '형용사';
		if (classification === 'N') return '명사';
		if (classification === 'AD') return '부사';
		return '숙어';
	};
	const handleInputChange = (index, field, value) => {
		console.log(index, field, value);

		const newData = [...updatedData];
		newData[index] = { ...newData[index], [field]: value }; // 수정된 필드 업데이트
		setUpdatedData(newData); // 상태 업데이트
	};
	// 수정 후 저장
	const handleSave = () => {
		setEditIndex(null);
		setTableData(updatedData);
		// 여기에서 업데이트된 데이터를 서버에 저장하거나 추가 로직을 실행할 수 있습니다.
	};
	// 수정 취소
	const handleCancel = index => {
		setEditIndex(null);
		// 원래 데이터 복원
		setUpdatedData(data);
	};
	// 수정 버튼 클릭 이벤트
	const handleEdit = index => {
		console.log(index);

		setEditIndex(index);
	};
	// 삭제 버튼 클릭 이벤트
	const handleRemove = index => {
		console.log(index);
	};
	const openModal = () => {
		setIsModalOpen(true); // 모달 열기
	};
	const closeModal = () => {
		setIsModalOpen(false); // 모달 닫기
	};

	return (
		<>
			{isModalOpen && <Modal onClose={closeModal} />}
			<div style={{ maxWidth: '90rem', margin: '0 auto' }}>
				{type === 'edit' ? (
					<div className="flex justify-end">
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
									id="category"
									value={category}
									name="category"
									className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 font-medium"
									onChange={e => handleChange(e.target.value)}
								>
									<option value={'ALL'} label="전체"></option>
									<option value={'V'} label="동사"></option>
									<option value={'N'} label="명사"></option>
									<option value={'A'} label="형용사"></option>
									<option value={'AD'} label="부사"></option>
									<option
										value={'OTHER'}
										label="숙어"
									></option>
								</select>
							</th>
							{type === 'edit' ? (
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
							<tr key={data.index}>
								<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
									{Number(index) + 1}
								</td>
								<td
									className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500"
									// style={{ minWidth: '16rem' }}
								>
									{editIndex === data.index - 1 &&
									type === 'edit' ? (
										<input
											type="text"
											value={
												updatedData[data.index - 1].word
											}
											onChange={e =>
												handleInputChange(
													data.index - 1,
													'word',
													e.target.value,
												)
											}
											className="border rounded p-1"
										/>
									) : (
										data.word
									)}
								</td>
								<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
									{editIndex === data.index - 1 &&
									type === 'edit' ? (
										<input
											type="text"
											value={
												updatedData[data.index - 1]
													.meaning
											}
											onChange={e =>
												handleInputChange(
													data.index - 1,
													'meaning',
													e.target.value,
												)
											}
											className="border rounded p-1"
										/>
									) : (
										data.meaning
									)}
								</td>
								<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
									{editIndex === data.index - 1 &&
									type === 'edit' ? (
										<select
											value={
												updatedData[data.index - 1]
													.classification
											}
											onChange={e =>
												handleInputChange(
													data.index - 1,
													'classification',
													e.target.value,
												)
											}
											className="border rounded p-1"
										>
											<option value="V">동사</option>
											<option value="A">형용사</option>
											<option value="N">명사</option>
											<option value="AD">부사</option>
											<option value="OTHER">숙어</option>
										</select>
									) : (
										getPartOfSpeech(data.classification)
									)}
								</td>
								{type === 'edit' ? (
									<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
										{editIndex === data.index - 1 ? (
											<>
												<button
													type="button"
													onClick={() =>
														handleSave(
															data.index - 1,
														)
													}
													className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
												>
													저장
												</button>
												<button
													type="button"
													onClick={handleCancel}
													className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
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
													className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
												>
													수정
												</button>
												<button
													type="button"
													onClick={() =>
														handleRemove(data.index)
													}
													className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
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
					</tbody>
				</table>
			</div>
		</>
	);
};
export default WordsTable;
