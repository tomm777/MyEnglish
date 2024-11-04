const ResultTable = ({ correctAnswers, myAnswers }) => {
	console.log(myAnswers, 'myAnswers');
	console.log(correctAnswers, 'correctAnswers');

	return (
		<div>
			<table className="border-collapse border table-auto w-full border-t-0">
				<thead>
					<tr>
						<th className="border-b border-r dark:border-slate-600 font-medium p-2 pl-4 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left w-1/12">
							번호
						</th>
						<th className="border-b border-r dark:border-slate-600 font-medium p-4 pl-4 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left w-1/4">
							문제
						</th>
						<th className="border-b border-r dark:border-slate-600 font-medium p-4 pl-4 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left w-1/4 min-w-28">
							정답
						</th>
						<th className="border-b border-r dark:border-slate-600 font-medium p-4 pl-4 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left w-1/4 min-w-28">
							나의 정답
						</th>
					</tr>
				</thead>
				<tbody>
					{correctAnswers.map((item, index) => (
						<tr key={index}>
							<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
								{index + 1}
							</td>
							<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
								{item.word}
							</td>
							<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
								{item.meaning}
							</td>
							<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
								{myAnswers[index]}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
export default ResultTable;
