###
###
 # 提供给服务端跑的脚本
 # @Author:  hsycc
 # @Date: 2023-03-22 17:41:10
 # @LastEditTime: 2023-03-22 18:18:57
 # @Description: 
 # 


#!/bin/sh

set -e;

export PATH=$PATH:/root/.nvm/versions/node/v16.19.1/bin;

cd /var/www/card-mgr/card-mgr-service;

echo "build server"

npm install -g pnpm

pnpm install --lockfile-only;

pnpm run build

# 前端的静态资源可以丢到这个目录, 同源策略， 不需要 ngnix 做服务转发
mkdir -p ./client

pm2 reload process.json --only card-mgr-service

exit 0;