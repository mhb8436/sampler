export class AttachmentEntity {
  id: number;
  postId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;

  constructor(partial: Partial<AttachmentEntity>) {
    Object.assign(this, partial);
  }
}
