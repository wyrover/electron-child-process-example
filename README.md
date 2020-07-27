# electron-child-process-example


```bash
yarn create electron-app electron-child-process-example
```

```bash
cd electron-child-process-example
yarn add @babel/core @babel/plugin-transform-runtime @babel/preset-env @babel/register cross-env nodemon --dev
```

此例子只是使用 @babel/register 执行 es6 开发，写个例子，并不打包

--eval 参数可执行脚本文本，可 fork 一个进程执行