declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DB_URI?: string;
      AT_SECRET?: string;
      RT_SECRET?: string;
      JWT?: string;
      INVALID_JWT?: string;
      EXPIRED_JWT?: string;
    }
  }
}

export {};
