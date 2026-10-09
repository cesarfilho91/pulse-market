import 'dotenv/config';

function parsePort(value: string | undefined): number {
  const port = Number(value ?? 3001);
  return Number.isInteger(port) && port > 0 && port <= 65535 ? port : 3001;
}

export const env = {
  port: parsePort(process.env.PORT),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
};
