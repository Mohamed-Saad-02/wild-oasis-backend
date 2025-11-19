import { Expose, Transform } from 'class-transformer';

export class CabinDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  maxCapacity: number;
  @Expose()
  regularPrice: number;
  @Expose()
  discount: number;
  @Expose()
  @Transform(({ value }) => value?.url)
  image?: string;
  @Expose()
  description: string;
}
