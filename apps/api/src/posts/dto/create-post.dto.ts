import {
  POST_TITLE_MAX_LENGTH,
  type CreatePostInput,
} from '@my-project/shared';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// implements CreatePostInput — компилятор проверит, что DTO совпадает
// с общим типом, который использует фронтенд.
export class CreatePostDto implements CreatePostInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(POST_TITLE_MAX_LENGTH)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
