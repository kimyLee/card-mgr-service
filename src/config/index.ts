/*
 * 配置文件
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-02-22 19:55:46
 * @Description:
 *
 */

import mysqlConfig from './mysql';
import jwtConfig from './jwt';
import accountConfig from './account';
const appConfig = [jwtConfig, mysqlConfig, accountConfig];

export default appConfig;
