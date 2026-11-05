import "./dns";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

// Reuse one Mongo client across hot reloads / serverless invocations.
const g = globalThis;
const client =
	g._authMongo ||
	new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017");
g._authMongo = client;
const db = client.db(process.env.DB_NAME || "studiospace");

const hasGoogle =
	process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
	database: mongodbAdapter(db),
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.BETTER_AUTH_URL,
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 6,
		autoSignIn: false, // after registering, the user is sent to the Login page
	},
	socialProviders: hasGoogle
		? {
				google: {
					clientId: process.env.GOOGLE_CLIENT_ID,
					clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				},
			}
		: {},
	plugins: [nextCookies()],
});
