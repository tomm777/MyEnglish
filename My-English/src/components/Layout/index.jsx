import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';

const classNames = (...classes) => {
	return classes.filter(Boolean).join(' ');
};

const userNavigation = [
	{ name: 'Your Profile', href: '#' },
	{ name: 'Settings', href: '#' },
	{ name: '로그아웃', href: '#' },
];
const Layout = () => {
	const auth = getAuth();
	const { authUser } = useAuth();
	console.log(auth.currentUser);

	const user = {
		name: authUser.displayName,
		email: authUser.email,
		imageUrl: authUser.photoURL
			? authUser.photoURL
			: '/assets/img/icons/default_Profile.png',
	};

	const handleClick = async type => {
		if (type === '로그아웃') {
			try {
				await signOut(auth);
			} catch (error) {
				console.error('로그아웃 중 오류 발생:', error);
			}
		}
	};
	return (
		<>
			<div className="min-h-full">
				<Disclosure as="nav" className="bg-gray-800">
					{({ open }) => (
						<>
							<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
								<div className="flex h-16 items-center justify-between">
									<div className="flex items-center">
										<div className="flex-shrink-0">
											<img
												className="h-8 w-8"
												src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
												alt="My English"
											/>
										</div>
										<NavBar></NavBar>
									</div>
									<div className="hidden md:block">
										<div className="ml-4 flex items-center md:ml-6">
											{/* <BellIcon
													className="h-6 w-6"
													aria-hidden="true"
												/> */}
											{/* Profile dropdown */}
											<Menu
												as="div"
												className="relative ml-3"
											>
												<div>
													<MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
														<span className="absolute -inset-1.5" />
														<span className="sr-only">
															Open user menu
														</span>
														<img
															className="h-8 w-8 rounded-full"
															src={user.imageUrl}
															alt=""
														/>
													</MenuButton>
												</div>
												<MenuItems
													transition
													className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
												>
													{userNavigation.map(
														item => (
															<MenuItem
																key={item.name}
																onClick={() =>
																	handleClick(
																		item.name,
																	)
																}
															>
																{({
																	focus,
																}) => (
																	<a
																		href={
																			item.href
																		}
																		className={classNames(
																			focus
																				? 'bg-gray-100'
																				: '',
																			'block px-4 py-2 text-sm text-gray-700',
																		)}
																	>
																		{
																			item.name
																		}
																	</a>
																)}
															</MenuItem>
														),
													)}
												</MenuItems>
											</Menu>
										</div>
									</div>
									<div className="-mr-2 flex md:hidden">
										{/* Mobile menu button */}
										<DisclosureButton className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
											<span className="absolute -inset-0.5" />
											<span className="sr-only">
												Open main menu
											</span>
											{open ? (
												<XMarkIcon
													className="block h-6 w-6"
													aria-hidden="true"
												/>
											) : (
												<Bars3Icon
													className="block h-6 w-6"
													aria-hidden="true"
												/>
											)}
										</DisclosureButton>
									</div>
								</div>
							</div>

							<DisclosurePanel className="md:hidden">
								<div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
									{/* {navigation.map(item => (
										<DisclosureButton
											key={item.name}
											as="a"
											href={item.href}
											className={classNames(
												item.current
													? 'bg-gray-900 text-white'
													: 'text-gray-300 hover:bg-gray-700 hover:text-white',
												'block rounded-md px-3 py-2 text-base font-medium',
											)}
											aria-current={
												item.current
													? 'page'
													: undefined
											}
										>
											{item.name}
										</DisclosureButton>
									))} */}
								</div>
								<div className="border-t border-gray-700 pb-3 pt-4">
									<div className="flex items-center px-5">
										<div className="flex-shrink-0">
											<img
												className="h-10 w-10 rounded-full"
												src={user.imageUrl}
												alt=""
											/>
										</div>
										<div className="ml-3">
											<div className="text-base font-medium leading-none text-white">
												{user.name}
											</div>
											<div className="text-sm font-medium leading-none text-gray-400">
												{user.email}
											</div>
										</div>

										{/* <BellIcon
												className="h-6 w-6"
												aria-hidden="true"
											/> */}
									</div>
									<div className="mt-3 space-y-1 px-2">
										{userNavigation.map(item => (
											<DisclosureButton
												key={item.name}
												as="a"
												href={item.href}
												className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
											>
												{item.name}
											</DisclosureButton>
										))}
									</div>
								</div>
							</DisclosurePanel>
						</>
					)}
				</Disclosure>
			</div>
			<Outlet />
		</>
	);
};
export default Layout;
