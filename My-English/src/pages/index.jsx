import { useEffect, useState } from 'react';
import data from '../../public/Data/mockData.json';

const Home = () => {
	const [tableData, setTableData] = useState([]);
	const [state, setState] = useState('ALL');
	useEffect(() => {
		setTableData(data);
	}, [state]);
	const handleChange = value => {
		setState(value);
	};
	const filteredData =
		state === 'ALL'
			? tableData
			: tableData.filter(item => item.classification === state);
	// 품사 구분
	const getPartOfSpeech = classification => {
		if (classification === 'V') return '동사';
		if (classification === 'A') return '형용사';
		if (classification === 'N') return '명사';
		if (classification === 'AD') return '부사';
		return '숙어';
	};
	return (
		<>
			<form className="max-w-md mx-auto mb-5">
				<label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
					Search
				</label>
				<div className="relative">
					<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
						<svg
							className="w-4 h-4 text-gray-500 dark:text-gray-400"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 20 20"
						>
							<path
								stroke="currentColor"
								d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
							/>
						</svg>
					</div>
					<input
						type="search"
						id="default-search"
						className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Search Mockups, Logos..."
						required
					/>
					<button
						type="submit"
						className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						Search
					</button>
				</div>
			</form>
			<div style={{ maxWidth: '90rem', margin: '0 auto' }}>
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
									id="currency"
									value={state}
									name="currency"
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
						</tr>
					</thead>
					<tbody>
						{filteredData.map(data => (
							<tr key={data.index}>
								<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
									{data.index}
								</td>
								<td
									className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500"
									// style={{ minWidth: '16rem' }}
								>
									{data.word}
								</td>
								<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
									{data.meaning}
								</td>
								<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
									{getPartOfSpeech(data.classification)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};
export default Home;
