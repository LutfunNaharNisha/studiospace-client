import dns from "node:dns";

// Use Cloudflare DNS for MongoDB Atlas SRV resolution.
dns.setServers(["1.1.1.1", "1.0.0.1"]);
