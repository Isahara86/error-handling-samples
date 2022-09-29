import { BlazeBatchDto } from './blaze-batch.dto';

export interface BlazeInventorySyncLogDto {
  batchesRaw?: BlazeBatchDto[];
  batchesToSync?: any;

  validationError?: any;
  validationTimingMs?: number;
  fetchTimingMs?: number;
  fetchError?: any;
  handleErrors?: any;
  handleTimingMs?: number;
}
