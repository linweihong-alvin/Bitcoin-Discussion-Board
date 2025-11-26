const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		// vertical center: Tailwind combo for a centered, responsive container
		// 1. w-full: takes the full width of its parent on all screen sizes
		// 2. md:max-w-[500px]: Small screens: full width | Medium or larger: max 500px-wide “card”
		//                      if over md: (medium breakpoint), max width 500 px take effect
		// 3. mx-auto: margin-left: auto; margin-right: auto; = horizontally center a block element
		// 4. py-10: padding-top & padding-bottom (y-axis) = Tailwind spacing 10 (2.5rem ≈ 40px)
		// 5. px-4:  padding-left & padding-right (x-axis) = spacing 4 (1rem ≈ 16px)
		<div className="w-full md:max-w-[500px] mx-auto py-10 px-4">
			{children}
		</div>
	);
};

export default Layout;
