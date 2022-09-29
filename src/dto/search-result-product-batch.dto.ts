import { BlazeBatchDto } from './blaze-batch.dto';

export interface SearchResultProductBatchDto {
  limit: number;
  skip: number;
  total: number;
  values: BlazeBatchDto[];
}
