# Simple Auth

Simple Auth 是一个简洁的用户、会话管理系统（以下简称 “auth 系统”），以 serverless 部署。

+ Deno Deploy
+ PostgreSQL (User)
+ Redis (Session)

## FAQ

##### 为什么是“单独可部署的微服务”而不是“SDK”

+ auth 系统与业务系统解耦，不用考虑业务系统的技术栈，不论是 Nodejs，Java，Python，IOS App……
+ 使业务系统更简洁（代码、数据库都更简洁）
+ 多个业务系统可共享同一个 auth 系统
+ auth 系统可以单独迭代升级（不重要的业务系统可以比较随意）

##### 为什么登录走 http，而会话直接读 redis

+ http 简单成熟稳定，所以应尽量走 http，但 http 太慢
