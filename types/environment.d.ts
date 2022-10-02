declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DB_URI?: string;
      AT_SECRET?: string;
      RT_SECRET?: string;
      AT?: string;
      RT?: string;
      INVALID_AT?: string;
      EXPIRED_AT?: string;
    }
  }
}

export {};
