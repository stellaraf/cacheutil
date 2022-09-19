export interface SetOptions {
  expireIn: number;
  expireAt: Date;
}

export interface CacheType<Backend> {
  readonly backend: Backend;

  // get<Value = unknown>(key: string): Promise<Value | null>;
  get(key: string): Promise<unknown | null>;

  set(key: string, value: unknown, options?: Partial<SetOptions>): Promise<void>;

  keys(): Promise<string[]>;

  delete(key: string): Promise<void>;
}

export abstract class Cache<Backend> implements CacheType<Backend> {
  readonly backend: Backend;

  constructor(backend: Backend) {
    this.backend = backend;
  }

  // abstract get<Value = unknown>(key: string): Promise<Value | null>;
  abstract get(key: string): Promise<unknown | null>;

  abstract set(key: string, value: unknown, options?: Partial<SetOptions>): Promise<void>;

  abstract keys(): Promise<string[]>;

  abstract delete(key: string): Promise<void>;
}
