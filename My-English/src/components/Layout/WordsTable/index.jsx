import { useEffect, useState } from 'react';
import data from '../../../../public/Data/mockData.json';

const WordsTable = () => {
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
export default WordsTable;
