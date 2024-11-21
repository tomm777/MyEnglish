import correctIcon from '/assets/img/icons/correct_answer.png';
import wrongIcon from '/assets/img/icons/wrong_answer.png';

const ResultTable = ({ correctAnswers, myAnswers }) => {
	// console.log(myAnswers, 'myAnswers');
	// console.log(correctAnswers, 'correctAnswers');
	let correctArr = [];
	// 정답 체크
	const answerCheck = myAnswer => {
		for (let i = 0; i < 10; i++) {
			console.log(correctAnswers[i].meaning);

			correctArr.push(
				correctAnswers[i].meaning
					.split(',')
					.filter(item => myAnswer[i].includes(item)),
			);
		}
	};
	answerCheck(myAnswers);

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
								<img
									src={
										correctArr[index].length > 0
											? correctIcon
											: wrongIcon
									}
									alt="체크 아이콘"
									className="w-5 h-5 mr-2 float-right"
									aria-hidden="true"
								/>
							</td>
							<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
								<span
									className={
										correctArr[index].length > 0
											? 'text-green-400 font-bold'
											: 'text-red-700 font-bold'
									}
								>
									{item.meaning}
								</span>
							</td>
							<td className="border-b border-r border-slate-100 dark:border-slate-700 p-2 pl-4 text-slate-500">
								<span>{myAnswers[index]}</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
export default ResultTable;
