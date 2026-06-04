import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined): number => {
    const raw = String(value ?? "4000").trim().replace(/;$/, "");
    const port = Number(raw);
    return Number.isInteger(port) && port > 0 && port < 65536 ? port : 4000;
};

const config = {
        port: parsePort(process.env.PORT),
    databaseUrl: process.env.DATABASE_URL,
};
export default config;