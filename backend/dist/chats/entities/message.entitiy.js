"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEntity = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
class MessageEntity {
    id;
    content;
    createdAt;
    updatedAt;
    user;
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.user) {
            this.user = new user_entity_1.UserEntity(partial.user);
        }
    }
}
exports.MessageEntity = MessageEntity;
//# sourceMappingURL=message.entitiy.js.map