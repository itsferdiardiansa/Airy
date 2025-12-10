import argon2, { Options } from 'argon2';

const ARGON_OPTIONS: Options = {
  timeCost: 2,
  memoryCost: 19456,
  parallelism: 1,
  type: argon2.argon2id,
};

export class CryptoService {
  static async hash(plain: string): Promise<string> {
    return argon2.hash(plain, ARGON_OPTIONS);
  }

  static async verify(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain, ARGON_OPTIONS);
    } catch {
      return false;
    }
  }
}

export const hash = CryptoService.hash;
export const verify = CryptoService.verify;
