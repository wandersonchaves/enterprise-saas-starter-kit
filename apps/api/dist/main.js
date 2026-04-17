/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
const global_exception_filter_1 = __webpack_require__(64);
const tenant_interceptor_1 = __webpack_require__(65);
const common_1 = __webpack_require__(3);
const nest_winston_1 = __webpack_require__(67);
const winston = __importStar(__webpack_require__(68));
const Sentry = __importStar(__webpack_require__(69));
const profiling_node_1 = __webpack_require__(70);
const helmet_1 = __importDefault(__webpack_require__(71));
const swagger_1 = __webpack_require__(72);
async function bootstrap() {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
            (0, profiling_node_1.nodeProfilingIntegration)(),
        ],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
    });
    const logger = nest_winston_1.WinstonModule.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(winston.format.timestamp(), process.env.NODE_ENV === 'production'
                    ? winston.format.json()
                    : winston.format.combine(winston.format.colorize(), winston.format.simple())),
            }),
        ],
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger,
        rawBody: true,
    });
    app.use((0, helmet_1.default)());
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new tenant_interceptor_1.TenantInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Enterprise SaaS Public API')
        .setDescription('The public API for integrating with the Enterprise SaaS platform')
        .setVersion('1.0')
        .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs/api', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`API is running on: http://localhost:${port}`);
}
bootstrap();


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const app_controller_1 = __webpack_require__(4);
const app_service_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(6);
const organization_module_1 = __webpack_require__(16);
const nestjs_prometheus_1 = __webpack_require__(24);
const cache_manager_1 = __webpack_require__(21);
const cache_manager_redis_yet_1 = __webpack_require__(25);
const billing_module_1 = __webpack_require__(26);
const bullmq_1 = __webpack_require__(30);
const notifications_module_1 = __webpack_require__(31);
const throttler_1 = __webpack_require__(35);
const ai_module_1 = __webpack_require__(36);
const analytics_module_1 = __webpack_require__(41);
const tasks_module_1 = __webpack_require__(44);
const webhooks_module_1 = __webpack_require__(47);
const backup_module_1 = __webpack_require__(51);
const plugins_module_1 = __webpack_require__(57);
const marketplace_module_1 = __webpack_require__(61);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            organization_module_1.OrganizationModule,
            billing_module_1.BillingModule,
            notifications_module_1.NotificationsModule,
            ai_module_1.AiModule,
            analytics_module_1.AnalyticsModule,
            tasks_module_1.TasksModule,
            webhooks_module_1.WebhooksModule,
            backup_module_1.BackupModule,
            plugins_module_1.PluginsModule,
            marketplace_module_1.MarketplaceModule,
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            bullmq_1.BullModule.forRoot({
                connection: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                },
            }),
            nestjs_prometheus_1.PrometheusModule.register(),
            cache_manager_1.CacheModule.register({
                isGlobal: true,
                store: cache_manager_redis_yet_1.redisStore,
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                ttl: 600,
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(3);
const app_service_1 = __webpack_require__(5);
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(3);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(3);
const jwt_1 = __webpack_require__(7);
const passport_1 = __webpack_require__(8);
const auth_service_1 = __webpack_require__(9);
const auth_controller_1 = __webpack_require__(15);
const prisma_service_1 = __webpack_require__(10);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'secret',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, prisma_service_1.PrismaService],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(3);
const jwt_1 = __webpack_require__(7);
const prisma_service_1 = __webpack_require__(10);
const bcrypt = __importStar(__webpack_require__(14));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(email, passwordHash, name) {
        const existingUser = await this.prisma.client.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User already exists');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(passwordHash, salt);
        const user = await this.prisma.client.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                name,
                memberships: {
                    create: {
                        role: 'OWNER',
                        organization: {
                            create: {
                                name: `${name ?? email.split('@')[0]}'s Workspace`,
                                slug: `${name?.toLowerCase().replace(/\s+/g, '-') ?? email.split('@')[0]}-${Math.random().toString(36).substring(7)}`,
                            },
                        },
                    },
                },
            },
            include: {
                memberships: {
                    include: {
                        organization: true,
                    },
                },
            },
        });
        return this.generateTokens(user.id);
    }
    async login(email, passwordHash) {
        const user = await this.prisma.client.user.findUnique({
            where: { email },
        });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateTokens(user.id);
    }
    async generateTokens(userId) {
        const payload = { sub: userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(3);
const database_1 = __webpack_require__(11);
let PrismaService = class PrismaService {
    _prisma;
    _readReplica;
    constructor() {
        this._prisma = database_1.prisma;
        if (process.env.DATABASE_URL_READ_REPLICA) {
            this._readReplica = new database_1.PrismaClient({
                datasources: { db: { url: process.env.DATABASE_URL_READ_REPLICA } },
            });
        }
    }
    get client() {
        return this._prisma;
    }
    get readReplica() {
        return this._readReplica || this._prisma;
    }
    async onModuleInit() {
        await this._prisma.$connect();
        if (this._readReplica) {
            await this._readReplica.$connect();
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prisma = exports.tenantContext = void 0;
__exportStar(__webpack_require__(12), exports);
const client_1 = __webpack_require__(12);
const node_async_hooks_1 = __webpack_require__(13);
exports.tenantContext = new node_async_hooks_1.AsyncLocalStorage();
exports.prisma = new client_1.PrismaClient().$extends({
    query: {
        $allModels: {
            async $allOperations({ model, operation, args, query }) {
                const context = exports.tenantContext.getStore();
                const globalModels = ['User', 'Account', 'Organization'];
                if (globalModels.includes(model)) {
                    return query(args);
                }
                if (context?.organizationId) {
                    const anyArgs = args;
                    if (['findFirst', 'findMany', 'count', 'updateMany', 'deleteMany'].includes(operation)) {
                        anyArgs.where = { ...anyArgs.where, organizationId: context.organizationId };
                    }
                    else if (['create', 'createMany'].includes(operation)) {
                        if (Array.isArray(anyArgs.data)) {
                            anyArgs.data = anyArgs.data.map((item) => ({
                                ...item,
                                organizationId: context.organizationId,
                            }));
                        }
                        else {
                            anyArgs.data = { ...anyArgs.data, organizationId: context.organizationId };
                        }
                    }
                }
                return query(args);
            },
        },
    },
});


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("node:async_hooks");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(9);
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(data) {
        return this.authService.register(data.email, data.password, data.name);
    }
    async login(data) {
        return this.authService.login(data.email, data.password);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationModule = void 0;
const common_1 = __webpack_require__(3);
const organization_controller_1 = __webpack_require__(17);
const organization_service_1 = __webpack_require__(18);
const prisma_service_1 = __webpack_require__(10);
const email_interface_1 = __webpack_require__(20);
const resend_adapter_1 = __webpack_require__(22);
let OrganizationModule = class OrganizationModule {
};
exports.OrganizationModule = OrganizationModule;
exports.OrganizationModule = OrganizationModule = __decorate([
    (0, common_1.Module)({
        controllers: [organization_controller_1.OrganizationController],
        providers: [
            organization_service_1.OrganizationService,
            prisma_service_1.PrismaService,
            {
                provide: email_interface_1.EMAIL_PROVIDER,
                useClass: resend_adapter_1.ResendAdapter,
            },
        ],
    })
], OrganizationModule);


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationController = void 0;
const common_1 = __webpack_require__(3);
const organization_service_1 = __webpack_require__(18);
const database_1 = __webpack_require__(11);
let OrganizationController = class OrganizationController {
    organizationService;
    constructor(organizationService) {
        this.organizationService = organizationService;
    }
    async getOrganization(id) {
        return this.organizationService.getOrganization(id);
    }
    async inviteMember(organizationId, email, role, req) {
        const authorId = req.user.id;
        return this.organizationService.inviteMember(organizationId, email, role, authorId);
    }
};
exports.OrganizationController = OrganizationController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getOrganization", null);
__decorate([
    (0, common_1.Post)(':id/invites'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('email')),
    __param(2, (0, common_1.Body)('role')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_b = typeof database_1.Role !== "undefined" && database_1.Role) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "inviteMember", null);
exports.OrganizationController = OrganizationController = __decorate([
    (0, common_1.Controller)('organizations'),
    __metadata("design:paramtypes", [typeof (_a = typeof organization_service_1.OrganizationService !== "undefined" && organization_service_1.OrganizationService) === "function" ? _a : Object])
], OrganizationController);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(10);
const crypto = __importStar(__webpack_require__(19));
const email_interface_1 = __webpack_require__(20);
const cache_manager_1 = __webpack_require__(21);
let OrganizationService = class OrganizationService {
    prisma;
    emailProvider;
    cacheManager;
    constructor(prisma, emailProvider, cacheManager) {
        this.prisma = prisma;
        this.emailProvider = emailProvider;
        this.cacheManager = cacheManager;
    }
    async getOrganization(id) {
        const cachedOrg = await this.cacheManager.get(`org:${id}`);
        if (cachedOrg)
            return cachedOrg;
        const org = await this.prisma.client.organization.findUnique({
            where: { id },
        });
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        await this.cacheManager.set(`org:${id}`, org);
        return org;
    }
    async inviteMember(organizationId, email, role, authorId) {
        const authorMember = await this.prisma.client.member.findUnique({
            where: {
                organizationId_userId: {
                    organizationId,
                    userId: authorId,
                },
            },
        });
        if (!authorMember || !['OWNER', 'ADMIN'].includes(authorMember.role)) {
            throw new common_1.ForbiddenException('Only owners and admins can invite members');
        }
        const existingMember = await this.prisma.client.member.findFirst({
            where: {
                organizationId,
                user: { email },
            },
        });
        if (existingMember) {
            throw new common_1.ForbiddenException('User is already a member of this organization');
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const invite = await this.prisma.client.invite.create({
            data: {
                email,
                role,
                token,
                expiresAt,
                organizationId,
                authorId,
            },
        });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        const inviteLink = `${frontendUrl}/invite?token=${token}`;
        await this.emailProvider.sendEmail({
            to: email,
            subject: 'You have been invited to join an organization',
            html: `<p>You have been invited to join. Click <a href="${inviteLink}">here</a> to accept.</p>`,
        });
        return invite;
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(email_interface_1.EMAIL_PROVIDER)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, Object, Object])
], OrganizationService);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EMAIL_PROVIDER = void 0;
exports.EMAIL_PROVIDER = Symbol('EMAIL_PROVIDER');


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("@nestjs/cache-manager");

/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ResendAdapter_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResendAdapter = void 0;
const common_1 = __webpack_require__(3);
const resend_1 = __webpack_require__(23);
let ResendAdapter = ResendAdapter_1 = class ResendAdapter {
    logger = new common_1.Logger(ResendAdapter_1.name);
    resend;
    constructor() {
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY || 're_123456789');
    }
    async sendEmail(options) {
        try {
            const response = await this.resend.emails.send({
                from: process.env.EMAIL_FROM || 'Acme <onboarding@resend.dev>',
                to: options.to,
                subject: options.subject,
                text: options.text || '',
                html: options.html || options.text || '',
            });
            if (response.error) {
                this.logger.error(`Failed to send email: ${response.error.message}`);
                return false;
            }
            this.logger.log(`Email sent successfully to ${options.to}`);
            return true;
        }
        catch (error) {
            this.logger.error('Unexpected error sending email', error);
            return false;
        }
    }
};
exports.ResendAdapter = ResendAdapter;
exports.ResendAdapter = ResendAdapter = ResendAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ResendAdapter);


/***/ }),
/* 23 */
/***/ ((module) => {

module.exports = require("resend");

/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("@willsoto/nestjs-prometheus");

/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("cache-manager-redis-yet");

/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillingModule = void 0;
const common_1 = __webpack_require__(3);
const billing_service_1 = __webpack_require__(27);
const billing_controller_1 = __webpack_require__(29);
const prisma_service_1 = __webpack_require__(10);
let BillingModule = class BillingModule {
};
exports.BillingModule = BillingModule;
exports.BillingModule = BillingModule = __decorate([
    (0, common_1.Module)({
        controllers: [billing_controller_1.BillingController],
        providers: [billing_service_1.BillingService, prisma_service_1.PrismaService],
        exports: [billing_service_1.BillingService],
    })
], BillingModule);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BillingService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillingService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(10);
const Stripe = __webpack_require__(28);
let BillingService = BillingService_1 = class BillingService {
    prisma;
    stripe;
    logger = new common_1.Logger(BillingService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
            apiVersion: '2023-10-16',
        });
    }
    async createCheckoutSession(organizationId, plan) {
        const organization = await this.prisma.client.organization.findUnique({
            where: { id: organizationId },
            include: { subscription: true },
        });
        if (!organization)
            throw new Error('Organization not found');
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env[`STRIPE_PRICE_ID_${plan.toUpperCase()}`],
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/billing?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/billing?canceled=true`,
            customer: organization.subscription?.stripeCustomerId || undefined,
            client_reference_id: organizationId,
            subscription_data: {
                metadata: { organizationId },
            },
        });
        return { url: session.url };
    }
    async handleWebhook(signature, payload) {
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
        }
        catch (err) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            throw new Error('Webhook Error');
        }
        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutCompleted(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await this.handleSubscriptionDeleted(event.data.object);
                break;
        }
    }
    async handleCheckoutCompleted(session) {
        const organizationId = session.client_reference_id;
        if (!organizationId)
            return;
        await this.prisma.client.subscription.upsert({
            where: { organizationId },
            create: {
                organizationId,
                stripeCustomerId: session.customer,
                stripeSubscriptionId: session.subscription,
                plan: 'PRO',
                status: 'ACTIVE',
            },
            update: {
                stripeSubscriptionId: session.subscription,
                status: 'ACTIVE',
            },
        });
    }
    async handleSubscriptionDeleted(subscription) {
        await this.prisma.client.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: { status: 'CANCELED', plan: 'FREE' },
        });
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = BillingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], BillingService);


/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("stripe");

/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BillingController = void 0;
const common_1 = __webpack_require__(3);
const billing_service_1 = __webpack_require__(27);
let BillingController = class BillingController {
    billingService;
    constructor(billingService) {
        this.billingService = billingService;
    }
    async createCheckout(organizationId, plan) {
        return this.billingService.createCheckoutSession(organizationId, plan);
    }
    async webhook(signature, req) {
        if (!signature) {
            throw new common_1.BadRequestException('Missing stripe-signature header');
        }
        const body = req.rawBody;
        if (!body) {
            throw new common_1.BadRequestException('Missing raw body');
        }
        await this.billingService.handleWebhook(signature, body);
        return { received: true };
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Post)('checkout'),
    __param(0, (0, common_1.Body)('organizationId')),
    __param(1, (0, common_1.Body)('plan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createCheckout", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "webhook", null);
exports.BillingController = BillingController = __decorate([
    (0, common_1.Controller)('billing'),
    __metadata("design:paramtypes", [typeof (_a = typeof billing_service_1.BillingService !== "undefined" && billing_service_1.BillingService) === "function" ? _a : Object])
], BillingController);


/***/ }),
/* 30 */
/***/ ((module) => {

module.exports = require("@nestjs/bullmq");

/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsModule = void 0;
const common_1 = __webpack_require__(3);
const bullmq_1 = __webpack_require__(30);
const notifications_service_1 = __webpack_require__(32);
const notifications_processor_1 = __webpack_require__(34);
const email_interface_1 = __webpack_require__(20);
const resend_adapter_1 = __webpack_require__(22);
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'notifications',
            }),
        ],
        providers: [
            notifications_service_1.NotificationsService,
            notifications_processor_1.NotificationsProcessor,
            {
                provide: email_interface_1.EMAIL_PROVIDER,
                useClass: resend_adapter_1.ResendAdapter,
            },
        ],
        exports: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsService = void 0;
const common_1 = __webpack_require__(3);
const bullmq_1 = __webpack_require__(30);
const bullmq_2 = __webpack_require__(33);
let NotificationsService = class NotificationsService {
    notificationsQueue;
    constructor(notificationsQueue) {
        this.notificationsQueue = notificationsQueue;
    }
    async sendWelcomeEmail(email, name) {
        await this.notificationsQueue.add('welcome-email', {
            email,
            name,
        });
    }
    async sendUsageAlert(email, percentage) {
        await this.notificationsQueue.add('usage-alert', {
            email,
            percentage,
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('notifications')),
    __metadata("design:paramtypes", [typeof (_a = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _a : Object])
], NotificationsService);


/***/ }),
/* 33 */
/***/ ((module) => {

module.exports = require("bullmq");

/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsProcessor_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsProcessor = void 0;
const bullmq_1 = __webpack_require__(30);
const common_1 = __webpack_require__(3);
const email_interface_1 = __webpack_require__(20);
let NotificationsProcessor = NotificationsProcessor_1 = class NotificationsProcessor extends bullmq_1.WorkerHost {
    emailProvider;
    logger = new common_1.Logger(NotificationsProcessor_1.name);
    constructor(emailProvider) {
        super();
        this.emailProvider = emailProvider;
    }
    async process(job) {
        switch (job.name) {
            case 'welcome-email':
                await this.emailProvider.sendEmail({
                    to: job.data.email,
                    subject: 'Welcome to our platform!',
                    text: `Hello ${job.data.name || 'there'}, welcome to our SaaS!`,
                });
                break;
            case 'usage-alert':
                await this.emailProvider.sendEmail({
                    to: job.data.email,
                    subject: 'Usage Limit Alert',
                    text: `You have reached ${job.data.percentage}% of your plan limit.`,
                });
                break;
        }
    }
};
exports.NotificationsProcessor = NotificationsProcessor;
exports.NotificationsProcessor = NotificationsProcessor = NotificationsProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('notifications'),
    __param(0, (0, common_1.Inject)(email_interface_1.EMAIL_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], NotificationsProcessor);


/***/ }),
/* 35 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiModule = void 0;
const common_1 = __webpack_require__(3);
const ai_service_1 = __webpack_require__(37);
const ai_controller_1 = __webpack_require__(40);
const prisma_service_1 = __webpack_require__(10);
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        controllers: [ai_controller_1.AiController],
        providers: [ai_service_1.AiService, prisma_service_1.PrismaService],
        exports: [ai_service_1.AiService],
    })
], AiModule);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiService = void 0;
const common_1 = __webpack_require__(3);
const google_1 = __webpack_require__(38);
const ai_1 = __webpack_require__(39);
const prisma_service_1 = __webpack_require__(10);
let AiService = class AiService {
    prisma;
    model;
    embeddingModel = google_1.google.textEmbeddingModel('text-embedding-004');
    constructor(prisma) {
        this.prisma = prisma;
        this.model = (0, google_1.google)('gemini-1.5-pro-latest');
    }
    async generateEmbedding(text) {
        const { embedding } = await (0, ai_1.embed)({
            model: this.embeddingModel,
            value: text,
        });
        return embedding;
    }
    async saveDocument(content, organizationId) {
        const embedding = await this.generateEmbedding(content);
        await this.prisma.client.$executeRaw `
      INSERT INTO "Document" ("id", "content", "embedding", "organizationId", "updatedAt")
      VALUES (gen_random_uuid(), ${content}, ${embedding}::vector, ${organizationId}, NOW())
    `;
    }
    async generateChatResponse(messages, organizationId) {
        return (0, ai_1.streamText)({
            model: this.model,
            messages,
            system: `You are a helpful AI assistant for the organization ${organizationId}. 
               You have access only to documents belonging to this organization.
               Always maintain a professional tone and provide accurate information.`,
        });
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AiService);


/***/ }),
/* 38 */
/***/ ((module) => {

module.exports = require("@ai-sdk/google");

/***/ }),
/* 39 */
/***/ ((module) => {

module.exports = require("ai");

/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiController = void 0;
const common_1 = __webpack_require__(3);
const ai_service_1 = __webpack_require__(37);
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    async chat(messages, organizationId, res) {
        const result = await this.aiService.generateChatResponse(messages, organizationId);
        result.pipeTextStreamToResponse(res);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Body)('messages')),
    __param(1, (0, common_1.Body)('organizationId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "chat", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [typeof (_a = typeof ai_service_1.AiService !== "undefined" && ai_service_1.AiService) === "function" ? _a : Object])
], AiController);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsModule = void 0;
const common_1 = __webpack_require__(3);
const analytics_service_1 = __webpack_require__(42);
const analytics_controller_1 = __webpack_require__(43);
const prisma_service_1 = __webpack_require__(10);
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [analytics_service_1.AnalyticsService, prisma_service_1.PrismaService],
        exports: [analytics_service_1.AnalyticsService],
    })
], AnalyticsModule);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(10);
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(organizationId) {
        const [membersCount, documentsCount, activeInvites] = await Promise.all([
            this.prisma.client.member.count({ where: { organizationId } }),
            this.prisma.client.document.count({ where: { organizationId } }),
            this.prisma.client.invite.count({ where: { organizationId, expiresAt: { gt: new Date() } } }),
        ]);
        const growthData = [
            { date: '2024-01', value: 10 },
            { date: '2024-02', value: 25 },
            { date: '2024-03', value: 45 },
            { date: '2024-04', value: membersCount },
        ];
        return {
            overview: {
                membersCount,
                documentsCount,
                activeInvites,
            },
            growthData,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AnalyticsService);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsController = void 0;
const common_1 = __webpack_require__(3);
const analytics_service_1 = __webpack_require__(42);
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getDashboard(organizationId) {
        return this.analyticsService.getDashboardStats(organizationId);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Headers)('organization-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboard", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [typeof (_a = typeof analytics_service_1.AnalyticsService !== "undefined" && analytics_service_1.AnalyticsService) === "function" ? _a : Object])
], AnalyticsController);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksModule = void 0;
const common_1 = __webpack_require__(3);
const bullmq_1 = __webpack_require__(30);
const tasks_service_1 = __webpack_require__(45);
const tasks_processor_1 = __webpack_require__(46);
const prisma_service_1 = __webpack_require__(10);
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'tasks',
            }),
        ],
        providers: [tasks_service_1.TasksService, tasks_processor_1.TasksProcessor, prisma_service_1.PrismaService],
        exports: [tasks_service_1.TasksService],
    })
], TasksModule);


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksService = void 0;
const common_1 = __webpack_require__(3);
const bullmq_1 = __webpack_require__(30);
const bullmq_2 = __webpack_require__(33);
let TasksService = class TasksService {
    tasksQueue;
    constructor(tasksQueue) {
        this.tasksQueue = tasksQueue;
    }
    async createReportTask(organizationId, format) {
        return await this.tasksQueue.add('generate-report', {
            organizationId,
            format,
        });
    }
    async createAiTask(organizationId, documentId) {
        return await this.tasksQueue.add('ai-process-document', {
            organizationId,
            documentId,
        });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('tasks')),
    __metadata("design:paramtypes", [typeof (_a = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _a : Object])
], TasksService);


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TasksProcessor_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksProcessor = void 0;
const bullmq_1 = __webpack_require__(30);
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(10);
let TasksProcessor = TasksProcessor_1 = class TasksProcessor extends bullmq_1.WorkerHost {
    prisma;
    logger = new common_1.Logger(TasksProcessor_1.name);
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async process(job) {
        const { organizationId } = job.data;
        this.logger.log(`Processing task ${job.name} for organization ${organizationId}`);
        switch (job.name) {
            case 'generate-report':
                await new Promise(resolve => setTimeout(resolve, 5000));
                this.logger.log(`Report generated for organization ${organizationId}`);
                break;
            case 'ai-process-document':
                await new Promise(resolve => setTimeout(resolve, 3000));
                this.logger.log(`AI processing completed for organization ${organizationId}`);
                break;
        }
    }
};
exports.TasksProcessor = TasksProcessor;
exports.TasksProcessor = TasksProcessor = TasksProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('tasks'),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], TasksProcessor);


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebhooksModule = void 0;
const common_1 = __webpack_require__(3);
const bullmq_1 = __webpack_require__(30);
const webhooks_service_1 = __webpack_require__(48);
const webhooks_processor_1 = __webpack_require__(49);
const prisma_service_1 = __webpack_require__(10);
let WebhooksModule = class WebhooksModule {
};
exports.WebhooksModule = WebhooksModule;
exports.WebhooksModule = WebhooksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'webhooks',
            }),
        ],
        providers: [webhooks_service_1.WebhooksService, webhooks_processor_1.WebhooksProcessor, prisma_service_1.PrismaService],
        exports: [webhooks_service_1.WebhooksService],
    })
], WebhooksModule);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebhooksService = void 0;
const common_1 = __webpack_require__(3);
const bullmq_1 = __webpack_require__(30);
const bullmq_2 = __webpack_require__(33);
const prisma_service_1 = __webpack_require__(10);
let WebhooksService = class WebhooksService {
    webhooksQueue;
    prisma;
    constructor(webhooksQueue, prisma) {
        this.webhooksQueue = webhooksQueue;
        this.prisma = prisma;
    }
    async triggerEvent(organizationId, event, payload) {
        const webhooks = await this.prisma.client.webhook.findMany({
            where: { organizationId, active: true, events: { has: event } },
        });
        for (const webhook of webhooks) {
            await this.webhooksQueue.add('dispatch-webhook', {
                webhookId: webhook.id,
                url: webhook.url,
                secret: webhook.secret,
                event,
                payload,
            }, {
                attempts: 5,
                backoff: { type: 'exponential', delay: 1000 },
            });
        }
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('webhooks')),
    __metadata("design:paramtypes", [typeof (_a = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object])
], WebhooksService);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WebhooksProcessor_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebhooksProcessor = void 0;
const bullmq_1 = __webpack_require__(30);
const common_1 = __webpack_require__(3);
const axios_1 = __importDefault(__webpack_require__(50));
const crypto = __importStar(__webpack_require__(19));
let WebhooksProcessor = WebhooksProcessor_1 = class WebhooksProcessor extends bullmq_1.WorkerHost {
    logger = new common_1.Logger(WebhooksProcessor_1.name);
    async process(job) {
        const { url, secret, event, payload } = job.data;
        const signature = crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(payload))
            .digest('hex');
        try {
            await axios_1.default.post(url, payload, {
                headers: {
                    'x-saas-event': event,
                    'x-saas-signature': signature,
                    'Content-Type': 'application/json',
                },
                timeout: 5000,
            });
            this.logger.log(`Webhook successfully delivered to ${url}`);
        }
        catch (error) {
            this.logger.error(`Webhook delivery failed to ${url}: ${error.message}`);
            throw error;
        }
    }
};
exports.WebhooksProcessor = WebhooksProcessor;
exports.WebhooksProcessor = WebhooksProcessor = WebhooksProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('webhooks')
], WebhooksProcessor);


/***/ }),
/* 50 */
/***/ ((module) => {

module.exports = require("axios");

/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BackupModule = void 0;
const common_1 = __webpack_require__(3);
const bullmq_1 = __webpack_require__(30);
const bullmq_2 = __webpack_require__(33);
const backup_processor_1 = __webpack_require__(52);
let BackupModule = class BackupModule {
    backupQueue;
    constructor(backupQueue) {
        this.backupQueue = backupQueue;
    }
    async onModuleInit() {
        await this.backupQueue.add('daily-db-backup', {}, {
            repeat: { pattern: '0 3 * * *' },
        });
    }
};
exports.BackupModule = BackupModule;
exports.BackupModule = BackupModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'backups',
            }),
        ],
        providers: [backup_processor_1.BackupProcessor],
    }),
    __param(0, (0, bullmq_1.InjectQueue)('backups')),
    __metadata("design:paramtypes", [typeof (_a = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _a : Object])
], BackupModule);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BackupProcessor_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BackupProcessor = void 0;
const bullmq_1 = __webpack_require__(30);
const common_1 = __webpack_require__(3);
const client_s3_1 = __webpack_require__(53);
const child_process_1 = __webpack_require__(54);
const util_1 = __webpack_require__(55);
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let BackupProcessor = BackupProcessor_1 = class BackupProcessor extends bullmq_1.WorkerHost {
    logger = new common_1.Logger(BackupProcessor_1.name);
    s3Client;
    constructor() {
        super();
        this.s3Client = new client_s3_1.S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
    }
    async process(job) {
        if (job.name === 'daily-db-backup') {
            this.logger.log('Starting daily database backup...');
            const fileName = `backup-${new Date().toISOString()}.sql`;
            const filePath = `/tmp/${fileName}`;
            try {
                await execAsync(`pg_dump ${process.env.DATABASE_URL} > ${filePath}`);
                await this.s3Client.send(new client_s3_1.PutObjectCommand({
                    Bucket: process.env.BACKUP_BUCKET_NAME || 'my-backups',
                    Key: fileName,
                    Body: (__webpack_require__(56).createReadStream)(filePath),
                }));
                this.logger.log('Database backup successfully uploaded to S3.');
            }
            catch (error) {
                this.logger.error(`Database backup failed: ${error.message}`);
                throw error;
            }
        }
    }
};
exports.BackupProcessor = BackupProcessor;
exports.BackupProcessor = BackupProcessor = BackupProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('backups'),
    __metadata("design:paramtypes", [])
], BackupProcessor);


/***/ }),
/* 53 */
/***/ ((module) => {

module.exports = require("@aws-sdk/client-s3");

/***/ }),
/* 54 */
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),
/* 55 */
/***/ ((module) => {

module.exports = require("util");

/***/ }),
/* 56 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginsModule = void 0;
const common_1 = __webpack_require__(3);
const plugins_service_1 = __webpack_require__(58);
const sandbox_service_1 = __webpack_require__(59);
const prisma_service_1 = __webpack_require__(10);
let PluginsModule = class PluginsModule {
};
exports.PluginsModule = PluginsModule;
exports.PluginsModule = PluginsModule = __decorate([
    (0, common_1.Module)({
        providers: [plugins_service_1.PluginsService, sandbox_service_1.SandboxService, prisma_service_1.PrismaService],
        exports: [plugins_service_1.PluginsService],
    })
], PluginsModule);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(10);
const sandbox_service_1 = __webpack_require__(59);
let PluginsService = class PluginsService {
    prisma;
    sandbox;
    constructor(prisma, sandbox) {
        this.prisma = prisma;
        this.sandbox = sandbox;
    }
    onModuleInit() {
    }
    async runPluginsForEvent(event, organizationId, payload) {
        const activePlugins = await this.prisma.client.plugin.findMany({
            where: {
                organizationId,
                active: true,
                events: { has: event },
            },
        });
        for (const plugin of activePlugins) {
            try {
                await this.sandbox.execute(plugin.code, {
                    event,
                    payload,
                    organizationId
                });
            }
            catch (error) {
            }
        }
    }
};
exports.PluginsService = PluginsService;
exports.PluginsService = PluginsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof sandbox_service_1.SandboxService !== "undefined" && sandbox_service_1.SandboxService) === "function" ? _b : Object])
], PluginsService);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var SandboxService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SandboxService = void 0;
const common_1 = __webpack_require__(3);
const vm = __importStar(__webpack_require__(60));
let SandboxService = SandboxService_1 = class SandboxService {
    logger = new common_1.Logger(SandboxService_1.name);
    async execute(code, context) {
        const sandbox = {
            ...context,
            console: {
                log: (...args) => this.logger.log(`[Plugin Log]: ${args.join(' ')}`),
                error: (...args) => this.logger.error(`[Plugin Error]: ${args.join(' ')}`),
            },
            setTimeout,
            Buffer,
        };
        const script = new vm.Script(code);
        const vmContext = vm.createContext(sandbox);
        try {
            return script.runInContext(vmContext, { timeout: 1000 });
        }
        catch (error) {
            this.logger.error(`Sandbox execution failed: ${error.message}`);
            throw error;
        }
    }
};
exports.SandboxService = SandboxService;
exports.SandboxService = SandboxService = SandboxService_1 = __decorate([
    (0, common_1.Injectable)()
], SandboxService);


/***/ }),
/* 60 */
/***/ ((module) => {

module.exports = require("node:vm");

/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MarketplaceModule = void 0;
const common_1 = __webpack_require__(3);
const marketplace_service_1 = __webpack_require__(62);
const marketplace_controller_1 = __webpack_require__(63);
const prisma_service_1 = __webpack_require__(10);
let MarketplaceModule = class MarketplaceModule {
};
exports.MarketplaceModule = MarketplaceModule;
exports.MarketplaceModule = MarketplaceModule = __decorate([
    (0, common_1.Module)({
        controllers: [marketplace_controller_1.MarketplaceController],
        providers: [marketplace_service_1.MarketplaceService, prisma_service_1.PrismaService],
        exports: [marketplace_service_1.MarketplaceService],
    })
], MarketplaceModule);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MarketplaceService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(10);
let MarketplaceService = class MarketplaceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listExtensions() {
        return this.prisma.client.marketplaceExtension.findMany();
    }
    async installExtension(extensionId, organizationId) {
        const extension = await this.prisma.client.marketplaceExtension.findUnique({
            where: { id: extensionId },
        });
        if (!extension)
            throw new common_1.NotFoundException('Extension not found');
        const existingInstallation = await this.prisma.client.installedExtension.findUnique({
            where: {
                extensionId_organizationId: { extensionId, organizationId },
            },
        });
        if (existingInstallation)
            throw new common_1.ConflictException('Extension already installed');
        return this.prisma.client.installedExtension.create({
            data: {
                extensionId,
                organizationId,
                active: true,
            },
        });
    }
    async updateConfig(extensionId, organizationId, config) {
        return this.prisma.client.installedExtension.update({
            where: {
                extensionId_organizationId: { extensionId, organizationId },
            },
            data: { config },
        });
    }
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], MarketplaceService);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MarketplaceController = void 0;
const common_1 = __webpack_require__(3);
const marketplace_service_1 = __webpack_require__(62);
let MarketplaceController = class MarketplaceController {
    marketplaceService;
    constructor(marketplaceService) {
        this.marketplaceService = marketplaceService;
    }
    async list() {
        return this.marketplaceService.listExtensions();
    }
    async install(extensionId, organizationId) {
        return this.marketplaceService.installExtension(extensionId, organizationId);
    }
    async updateConfig(extensionId, organizationId, config) {
        return this.marketplaceService.updateConfig(extensionId, organizationId, config);
    }
};
exports.MarketplaceController = MarketplaceController;
__decorate([
    (0, common_1.Get)('extensions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('extensions/:id/install'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('organization-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "install", null);
__decorate([
    (0, common_1.Patch)('extensions/:id/config'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('organization-id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "updateConfig", null);
exports.MarketplaceController = MarketplaceController = __decorate([
    (0, common_1.Controller)('marketplace'),
    __metadata("design:paramtypes", [typeof (_a = typeof marketplace_service_1.MarketplaceService !== "undefined" && marketplace_service_1.MarketplaceService) === "function" ? _a : Object])
], MarketplaceController);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalExceptionFilter = void 0;
const common_1 = __webpack_require__(3);
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Internal server error';
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof message === 'object' ? message.message || message : message,
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TenantInterceptor = void 0;
const common_1 = __webpack_require__(3);
const rxjs_1 = __webpack_require__(66);
const database_1 = __webpack_require__(11);
let TenantInterceptor = class TenantInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const organizationId = request.headers['organization-id'];
        if (organizationId) {
            return new rxjs_1.Observable((observer) => {
                database_1.tenantContext.run({ organizationId }, () => {
                    next.handle().subscribe(observer);
                });
            });
        }
        return next.handle();
    }
};
exports.TenantInterceptor = TenantInterceptor;
exports.TenantInterceptor = TenantInterceptor = __decorate([
    (0, common_1.Injectable)()
], TenantInterceptor);


/***/ }),
/* 66 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 67 */
/***/ ((module) => {

module.exports = require("nest-winston");

/***/ }),
/* 68 */
/***/ ((module) => {

module.exports = require("winston");

/***/ }),
/* 69 */
/***/ ((module) => {

module.exports = require("@sentry/nestjs");

/***/ }),
/* 70 */
/***/ ((module) => {

module.exports = require("@sentry/profiling-node");

/***/ }),
/* 71 */
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),
/* 72 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;