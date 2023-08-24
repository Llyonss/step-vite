const http = require('http');
const fs = require('fs');
const path = require('path');
const miniVueParse = require('./mini-vue-parser')
function rewirteVueImport(content) {
    console.log(content)
    return content.replace(/from ['"]vue['"]/g, (s1, s2) => {
        // s1, 匹配部分， s2: 匹配分组内容
        if (s2.startsWith("./") || s2.startsWith("/") || s2.startsWith("../")) {
            // 相对路劲直接返回
            return s1;
        } else {
            return ` from "./node_modules/vue/dist/vue.esm-browser.js"`
        }
    });
}


const server = http.createServer((req, res) => {
    // 获取请求的路径
    const reqPath = req.url;

    // 构建本地文件路径
    const filePath = path.join(__dirname, reqPath);
    console.log(filePath)
    // 检查文件是否存在
    fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err) {
            console.error('文件不存在:', err);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('文件不存在');
        } else {
            // 读取文件并发送给客户端
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('读取文件出错:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('内部服务器错误');
                } else {
                    // 根据文件类型设置合适的 Content-Type
                    const extname = path.extname(filePath);
                    let contentType = 'text/plain';
                    switch (extname) {
                        case '.html':
                            contentType = 'text/html';
                            break;
                        case '.js':
                            contentType = 'text/javascript';
                            break;
                        case '.vue':
                            contentType = 'text/javascript';
                            break;
                        case '.css':
                            contentType = 'text/css';
                            break;
                        // 添加其他需要支持的文件类型
                    }

                    res.writeHead(200, { 'Content-Type': contentType });

                    if (extname === '.js') {
                        data = data.replace(/from ['"]vue['"]/g, "from './node_modules/vue/dist/vue.esm-browser.js'");
                    }

                    if (extname === '.vue') {
                        const fileName = path.basename(filePath);
                        data = miniVueParse.parse(data, fileName)
                    }

                    res.end(data);
                }
            });
        }
    });
});

const port = 3000;

server.listen(port, () => {
    console.log(`代理服务器正在监听端口 ${port}`);
});