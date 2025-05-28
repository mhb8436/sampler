"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostEntity = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const answer_entitiy_1 = require("./answer.entitiy");
const attachment_entitiy_1 = require("./attachment.entitiy");
class PostEntity {
    id;
    title;
    content;
    userId;
    user;
    answers;
    attachments;
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.user) {
            this.user = new user_entity_1.UserEntity(partial.user);
        }
        if (partial.answers) {
            this.answers = partial.answers.map((answer) => new answer_entitiy_1.AnswerEntity(answer));
        }
        if (partial.attachments) {
            this.attachments = partial.attachments.map((attachment) => new attachment_entitiy_1.AttachmentEntity(attachment));
        }
    }
}
exports.PostEntity = PostEntity;
//# sourceMappingURL=post.entity.js.map