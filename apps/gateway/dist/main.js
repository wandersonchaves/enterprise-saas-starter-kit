"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_proxy_middleware_1 = require("http-proxy-middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use('/api', (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: process.env.API_URL || 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
            '^/api': '',
        },
    }));
    await app.listen(8080);
}
bootstrap();
//# sourceMappingURL=main.js.map