export class Exception extends Error {
  public readonly internalMessage: string;
  public readonly externalMessage: string;
  public readonly statusCode: number;
  public readonly context: string;
  public readonly timestamp: Date;

  constructor(
    internalMessage: string,
    externalMessage: string,
    statusCode: number,
    context: string
  ) {
    super(internalMessage);
    this.internalMessage = internalMessage;
    this.externalMessage = externalMessage;
    this.statusCode = statusCode;
    this.context = context;
    this.timestamp = new Date();

    this.name = this.constructor.name;

    // clean stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  toResponse() {
    return {
      message: this.externalMessage,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp,
    };
  }
}
