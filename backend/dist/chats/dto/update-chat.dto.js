"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChatDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_chat_dto_1 = require("./create-chat.dto");
class UpdateChatDto extends (0, mapped_types_1.PartialType)(create_chat_dto_1.CreateChatDto) {
}
exports.UpdateChatDto = UpdateChatDto;
//# sourceMappingURL=update-chat.dto.js.map