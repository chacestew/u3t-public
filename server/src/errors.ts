import { IdFields } from '@u3t/common';

enum Errors {
  NotFoundError = 'NotFoundError',
  BadRequestError = 'BadRequestError',
}

export class NotFoundError extends Error {
  data: Partial<IdFields> = {};

  constructor(message: string, data: Partial<IdFields>) {
    super(message);
    this.name = Errors.NotFoundError;
    this.data = data;
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = Errors.BadRequestError;
  }
}
