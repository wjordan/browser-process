/// <reference path="../typings/tsd.d.ts" />
import buffer = require("buffer");
var Buffer = Buffer;

/**
 * Standard libc error codes. Add more to this enum and ErrorStrings as they are
 * needed.
 * @url http://www.gnu.org/software/libc/manual/html_node/Error-Codes.html
 */
export enum ErrorCode {
  EPERM, ENOENT, EIO, EBADF, EACCES, EBUSY, EEXIST, ENOTDIR, EISDIR, EINVAL,
  EFBIG, ENOSPC, EROFS, ENOTEMPTY, ENOTSUP
}
/**
 * Strings associated with each error code.
 */
var ErrorStrings: {[code: string]: string} = {};
ErrorStrings[ErrorCode.EPERM] = 'Operation not permitted.';
ErrorStrings[ErrorCode.ENOENT] = 'No such file or directory.';
ErrorStrings[ErrorCode.EIO] = 'Input/output error.';
ErrorStrings[ErrorCode.EBADF] = 'Bad file descriptor.';
ErrorStrings[ErrorCode.EACCES] = 'Permission denied.';
ErrorStrings[ErrorCode.EBUSY] = 'Resource busy or locked.';
ErrorStrings[ErrorCode.EEXIST] = 'File exists.';
ErrorStrings[ErrorCode.ENOTDIR] = 'File is not a directory.';
ErrorStrings[ErrorCode.EISDIR] = 'File is a directory.';
ErrorStrings[ErrorCode.EINVAL] = 'Invalid argument.';
ErrorStrings[ErrorCode.EFBIG] = 'File is too big.';
ErrorStrings[ErrorCode.ENOSPC] = 'No space left on disk.';
ErrorStrings[ErrorCode.EROFS] = 'Cannot modify a read-only file system.';
ErrorStrings[ErrorCode.ENOTEMPTY] = 'Directory is not empty.';
ErrorStrings[ErrorCode.ENOTSUP] = 'Operation is not supported.';

/**
 * Represents a BrowserFS error. Passed back to applications after a failed
 * call to the BrowserFS API.
 */
export class ApiError {
  public type: ErrorCode;
  public message: string;
  public code: string;

  /**
   * Represents a BrowserFS error. Passed back to applications after a failed
   * call to the BrowserFS API.
   *
   * Error codes mirror those returned by regular Unix file operations, which is
   * what Node returns.
   * @constructor ApiError
   * @param type The type of the error.
   * @param [message] A descriptive error message.
   */
  constructor(type: ErrorCode, message?:string) {
    this.type = type;
    this.code = ErrorCode[type];
    if (message != null) {
      this.message = message;
    } else {
      this.message = ErrorStrings[type];
    }
  }

  /**
   * @return A friendly error message.
   */
  public toString(): string {
    return this.code +  ": " + ErrorStrings[this.type] + " " + this.message;
  }

  /**
   * Writes the API error into a buffer.
   */
  public writeToBuffer(buffer: Buffer = new Buffer(this.bufferSize()), i: number = 0): Buffer {
    buffer.writeUInt8(this.type, i);
    var bytesWritten = buffer.write(this.message, i + 5);
    buffer.writeUInt32LE(bytesWritten, i + 1);
    return buffer;
  }

  /**
   * Creates an ApiError object from a buffer.
   */
  public static fromBuffer(buffer: Buffer, i: number = 0): ApiError {
    return new ApiError(buffer.readUInt8(i), buffer.toString("utf8", i + 5, i + 5 + buffer.readUInt32LE(i + 1)));
  }

  /**
   * The size of the API error in buffer-form in bytes.
   */
  public bufferSize(): number {
    // 4 bytes for string length, 1 for type.
    return 5 + Buffer.byteLength(this.message);
  }

  public static FileError(code: ErrorCode, p: string): ApiError {
    return new ApiError(code, p + ": " + ErrorStrings[code]);
  }
  public static ENOENT(path: string): ApiError {
    return this.FileError(ErrorCode.ENOENT, path);
  }

  public static EEXIST(path: string): ApiError {
    return this.FileError(ErrorCode.EEXIST, path);
  }

  public static EISDIR(path: string): ApiError {
    return this.FileError(ErrorCode.EISDIR, path);
  }

  public static ENOTDIR(path: string): ApiError {
    return this.FileError(ErrorCode.ENOTDIR, path);
  }

  public static EPERM(path: string): ApiError {
    return this.FileError(ErrorCode.EPERM, path);
  }
}
