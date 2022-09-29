export interface BlazeConsumerCreateReq {
  agreement?: {
    active: boolean;
    assetType: string;
    companyId: string;
    created: number;
    deleted: boolean;
    id: string;
    key: string;
    largeURL: string;
    largeX2URL: string;
    mediumURL: string;
    modified: number;
    name: string;
    origURL: string;
    priority: number;
    publicURL: string;
    secured: boolean;
    thumbURL: string;
    type: string;
    updated: boolean;
  };
  contractId?: string;
  dob: number;
  email: string;
  firstName: string;
  lastName: string;
  marketingSource?: string;
  password: string;
  phoneNumber: string;
  sex: string;
}
