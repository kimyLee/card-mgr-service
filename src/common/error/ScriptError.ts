/**
 * 脚本错误
 */
export class ScriptError extends Error {
  /** shell脚本退出 */
  public exitCode: number;
  /** shell脚本输出的错误信息 */
  public message: string;
  /**
   *
   * @param message 脚本消息
   * @param exitCode 退出代码
   */
  constructor(message: string, exitCode: number) {
    super();
    this.exitCode = exitCode;
    this.message = message.split('\n').slice(0, -1)[0];
  }
}
