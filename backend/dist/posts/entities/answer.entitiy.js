"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerEntity = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
class AnswerEntity {
    id;
    content;
    userId;
    user;
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.user) {
            this.user = new user_entity_1.UserEntity(partial.user);
        }
    }
}
exports.AnswerEntity = AnswerEntity;
//# sourceMappingURL=answer.entitiy.js.map