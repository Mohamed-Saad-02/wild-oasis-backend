import { Injectable } from '@nestjs/common';

@Injectable()
export class ConstantsService {
  readonly CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER;
  readonly CLOUDINARY_FOLDER_AVATAR = `${this.CLOUDINARY_FOLDER}/avatar`;
  readonly CLOUDINARY_FOLDER_CABIN = `${this.CLOUDINARY_FOLDER}/cabin`;
}
