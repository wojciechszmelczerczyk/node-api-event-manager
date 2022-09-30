declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DB_URI?: string;
      AT_SECRET?: string;
      RT_SECRET?: string;
    }
  }
}

export {};
