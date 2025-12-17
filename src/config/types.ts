export interface MongoConfig {
  uri: string;
  options: {
    maxPoolSize?: number;
  };
}

export interface ThrottleConfig {
  ttl: number;
  limit: number;
}
