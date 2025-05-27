"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlingModule = void 0;
const common_1 = require("@nestjs/common");
const crawling_service_1 = require("./crawling.service");
const crawling_controller_1 = require("./crawling.controller");
let CrawlingModule = class CrawlingModule {
};
exports.CrawlingModule = CrawlingModule;
exports.CrawlingModule = CrawlingModule = __decorate([
    (0, common_1.Module)({
        controllers: [crawling_controller_1.CrawlingController],
        providers: [crawling_service_1.CrawlingService],
    })
], CrawlingModule);
//# sourceMappingURL=crawling.module.js.map