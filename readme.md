# Simple Auth

Simple Auth 是一个用户、会话系统。保证可用，尽量简单。

部署: `Deno Deploy`, `PostgreSQL`

## 临时会话 & 临时用户
用户用邮箱或 oauth 登录时，如果是新用户（未绑定 user 表），则为“临时用户”。
此时，要询问用户是否绑定到已有用户。

临时用户的信息，如 oauth id、email 存在“临时会话”里。
临时会话就是用类似 jwt 的方式（但有效期应很短），把**已验证**的 oauth id 或 email 写在 httpOnly 的 cookie 里。

## FAQ

##### 为什么是“单独可部署的微服务”而不是“SDK”

+ auth 系统与业务系统解耦，不用考虑业务系统的技术栈，不论是 Nodejs，Java，Python，IOS App……
+ 使业务系统更简洁（代码、数据库都更简洁）
+ 多个业务系统可共享同一个 auth 系统
+ auth 系统可以单独迭代升级（不重要的业务系统可以比较随意）

##### 为什么登录走 http，而会话直接读 pgsql

+ 直接读 pqsql 比较快
