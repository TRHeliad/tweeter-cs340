import { PostSegmentDto } from "../dto/PostSegmentDto";
import { DtoConvertible } from "./DtoConvertible";

export enum Type {
  text = "Text",
  alias = "Alias",
  url = "URL",
  newline = "Newline",
}

export class PostSegment extends DtoConvertible<PostSegmentDto> {
  private _text: string;
  private _startPosition: number;
  private _endPosition: number;
  private _type: Type;

  public constructor(
    text: string,
    startPosition: number,
    endPosition: number,
    type: Type
  ) {
    super();
    this._text = text;
    this._startPosition = startPosition;
    this._endPosition = endPosition;
    this._type = type;
  }

  public get text(): string {
    return this._text;
  }

  public get startPosition(): number {
    return this._startPosition;
  }

  public get endPosition(): number {
    return this._endPosition;
  }

  public get type(): Type {
    return this._type;
  }

  public static fromDto(dto: PostSegmentDto | null): PostSegment | null {
    return dto == null
      ? null
      : new PostSegment(dto.text, dto.startPosition, dto.endPosition, dto.type);
  }

  public get dto(): PostSegmentDto {
    return {
      text: this.text,
      startPosition: this.startPosition,
      endPosition: this.endPosition,
      type: this.type,
    };
  }
}
