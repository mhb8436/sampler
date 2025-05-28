"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentEntity = void 0;
class AttachmentEntity {
    id;
    postId;
    fileName;
    fileUrl;
    fileSize;
    fileType;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.AttachmentEntity = AttachmentEntity;
//# sourceMappingURL=attachment.entitiy.js.map