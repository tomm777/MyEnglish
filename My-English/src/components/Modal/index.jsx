import React, { useEffect, useRef, useState } from 'react';
import InputValidation from '../../constant/regex';
import useFocusOutValidation from '../../hooks/useValidation';

const Modal = ({ onClose, onAddWord }) => {
	// 품사구분
	const [classficationValue, setClassfication] = useState('');
	// custom hook 사용
	// hook에 Word와 meaning의 정규식을 구분하여 넘겨서 리턴값 취득
	const [wordRef, isCheckWord, handleWordFocusOut] = useFocusOutValidation(
		InputValidation.en,
	);
	const [meaningRef, isCheckMeaning, handleMeaningFocusOut] =
		useFocusOutValidation(InputValidation.kr);

	const handleOnChange = e => {
		const { value } = e.target;
		setClassfication(value);
	};
	// Submit 핸들러
	const handleSubmit = e => {
		e.preventDefault();
		if (isCheckWord || isCheckMeaning) {
			return;
		}
		const newWords = {
			word: wordRef.current.value,
			meaning: meaningRef.current.value,
			classification: classficationValue,
		};
		onAddWord(newWords);
		setClassfication('');
		wordRef.current.value = '';
		meaningRef.current.value = '';
		// setInputValue({ word: '', meaning: '', classification: '' });
	};

	return (
		<>
			<div className="fixed inset-0 bg-black bg-opacity-50 z-40">
				<div className="flex justify-center items-center h-full">
					<div className="relative p-4 w-full max-w-lg">
						<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
							<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									단어 추가
								</h3>
								<button
									onClick={onClose}
									type="button"
									className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
								>
									<svg
										className="w-3 h-3"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 14 14"
									>
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
										/>
									</svg>
								</button>
							</div>
							<form
								className="p-4 md:p-5"
								onSubmit={handleSubmit}
							>
								<div className="grid gap-4 mb-4 grid-cols-2">
									<div className="col-span-2">
										<label
											htmlFor="word"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
										>
											단어
										</label>
										<input
											ref={wordRef}
											type="text"
											name="word"
											onBlur={handleWordFocusOut}
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
											required
										/>
										{isCheckWord && (
											<p className="mt-2 text-sm text-red-600 dark:text-red-500">
												<span className="font-medium">
													영어를 입력하세요.
												</span>
											</p>
										)}
									</div>
									<div className="col-span-2">
										<label
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
											htmlFor="meaning"
										>
											뜻
										</label>
										<input
											ref={meaningRef}
											type="text"
											name="meaning"
											// value={inputValue.meaning}
											// onChange={handleOnChange}
											onBlur={handleMeaningFocusOut}
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
											required
										/>
										{isCheckMeaning && (
											<p className="mt-2 text-sm text-red-600 dark:text-red-500">
												<span className="font-medium">
													한글을 입력하세요.
												</span>
											</p>
										)}
									</div>
									<div className="col-span-2 sm:col-span-1">
										<label
											htmlFor="classification"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
										>
											품사
										</label>
										<select
											name="classification"
											onChange={handleOnChange}
											required
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
										>
											<option value="">===선택===</option>
											<option value="A">형용사</option>
											<option value="AD">부사</option>
											<option value="N">명사</option>
											<option value="V">동사</option>
											<option value="I">숙어</option>
										</select>
									</div>
								</div>
								<div
									style={{ textAlign: 'center' }}
									className="mt-6"
								>
									<button
										type="submit"
										className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
									>
										<svg
											className="me-1 -ms-1 w-5 h-5"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
												clipRule="evenodd"
											></path>
										</svg>
										단어 추가하기
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Modal;
