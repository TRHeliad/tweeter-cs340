import { Type } from "../domain/PostSegment";

export interface PostSegmentDto {
  readonly text: string;
  readonly startPosition: number;
  readonly endPosition: number;
  readonly type: Type;
}
