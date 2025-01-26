import { array, Infer, number, object } from 'superstruct';
import { createPaginatedContract } from '@/shared/api';

export const VDBenchStorageDataItemContract = object({
	interval: number(),
	rate: number(),
	resp: number(),
	'MB/sec': number(),
	read_resp: number(),
	write_resp: number(),
});

export const GetDecimatedVDBenchStorageMetricsContract = array(VDBenchStorageDataItemContract);
export const GetPaginatedVDStorageMetricsContract = createPaginatedContract(VDBenchStorageDataItemContract);

export type VDBenchStorageDataItemContract = Infer<typeof VDBenchStorageDataItemContract>;