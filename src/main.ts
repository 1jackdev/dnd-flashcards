import { createApp } from "./app";

const PORT = Number(process.env.PORT ?? 3000);

const app = await createApp();

export default {
	port: PORT,
	fetch: app.fetch,
};

console.log(`Server running on http://localhost:${PORT}`);
