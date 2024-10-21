const navigation = [
	{ name: '홈', href: '/' },
	{ name: '단어시험', href: '/test' },
	{ name: '단어장관리', href: '/wordsset' }, // 변경된 href
	{ name: '단어추가', href: '/addword' }, // 변경된 href
];
const classNames = (...classes) => {
	return classes.filter(Boolean).join(' ');
};
const current = location.pathname;

const NavBar = () => {
	return (
		<div className="hidden md:block">
			<div className="ml-10 flex items-baseline space-x-4">
				{navigation.map(item => (
					<a
						key={item.name}
						href={item.href}
						className={classNames(
							item.href === current
								? 'bg-gray-900 text-white'
								: 'text-gray-300 hover:bg-gray-700 hover:text-white',
							'rounded-md px-3 py-2 text-sm font-medium',
						)}
						// aria-current={item.current ? 'page' : undefined}
					>
						{item.name}
					</a>
				))}
			</div>
		</div>
	);
};
export default NavBar;
