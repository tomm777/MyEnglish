import { Link, useLocation } from 'react-router-dom';

const navigation = [
	{ name: '홈', href: '/' },
	{ name: '단어시험', href: '/test' },
	{ name: '단어장관리', href: '/wordsset' },
];

const classNames = (...classes) => {
	return classes.filter(Boolean).join(' ');
};

const NavBar = () => {
	const location = useLocation();
	const current = location.pathname;

	return (
		<div className="hidden md:block">
			<div className="ml-10 flex items-baseline space-x-4">
				{navigation.map(item => (
					<Link
						key={item.name}
						to={item.href}
						className={classNames(
							item.href === current
								? 'bg-gray-900 text-white'
								: 'text-gray-300 hover:bg-gray-700 hover:text-white',
							'rounded-md px-3 py-2 text-sm font-medium',
						)}
						aria-current={
							item.href === current ? 'page' : undefined
						}
					>
						{item.name}
					</Link>
				))}
			</div>
		</div>
	);
};

export default NavBar;
