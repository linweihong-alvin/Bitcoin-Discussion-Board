import Layout from "@/components/layout";
import Content from "@/modules/home/content";

// Next.js automatically pass searchParams（URL parameter）
interface HomeProps {
	searchParams: Promise<{ page?: string }>;
}

// root director (localhost:3000)
export default function Home({ searchParams }: HomeProps) {
	return (
		<Layout>
			<Content searchParams={searchParams} />
		</Layout>
	);
}
