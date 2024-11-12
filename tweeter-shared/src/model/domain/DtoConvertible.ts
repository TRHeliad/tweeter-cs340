export abstract class DtoConvertible<DtoType> {
  public abstract get dto(): DtoType;

  public static fromDto(dto: any): DtoConvertible<any> | null {
    throw new Error("fromDto() must be implemented by subclass");
  }
}
