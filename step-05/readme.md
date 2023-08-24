## 目标：
1. 写一个常规的 SFC vue 组件 App.vue 在 main.js 引用

## 思路：
1. 写一个 mini-vue-parser 用于把 App.vue 转化成浏览器可执行的 js。
    1. 学会使用 @vue/compiler-sfc
    2. 使用 @vue/compiler-sfc 包里的 compileTemplate 函数 解析 App.vue 中的 <tempalte></tempalte>
    3. 使用 @vue/compiler-sfc 包里的 compileScript   函数 解析 App.vue 中的 <script></script>
    4. 处理一下解析后的 template 和 script, 然后组合成浏览器可执行的 js .
2. 当请求 .vue 时, 用 mini-vue-parser 把 .vue 文件转化成 js。


 