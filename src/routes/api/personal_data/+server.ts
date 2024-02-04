import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ platform }) => {
	const result = await platform?.env.PORTFOLIO_DB.prepare('SELECT * FROM personal_info').run();
	return new Response(JSON.stringify(result));
};
