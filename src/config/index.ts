/*
 * 配置文件
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-03-19 19:10:24
 * @Description:
 *
 */

import mysqlConfig from './mysql';
import jwtConfig from './jwt';
import accountConfig from './account';
import ossConfig from './oss';

const appConfig = [jwtConfig, mysqlConfig, accountConfig, ossConfig];

export default appConfig;
