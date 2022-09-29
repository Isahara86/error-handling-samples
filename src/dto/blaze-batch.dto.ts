export interface BlazeBatchDto {
  id: string;
  // purchased quantity
  quantity?: number;
  // quantity in stock
  liveQuantity?: number;
  productId?: string;
  purchasedDate?: number; // 1598189484951
  metrcTagId?: string; // "1A4060300003BC9000088086"

  active: boolean;
  actualWeightPerUnit: number;
  archived: boolean;
  archivedDate: number;
  armsLengthType: string;
  attachments: [
    {
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
    },
  ];
  batchNo: number;
  batchQRAsset: {
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
  batchType: string;
  brandId: string;
  brandName: string;
  bundleItems: [
    {
      batchItems: [
        {
          batchId: string;
          inventoryId: string;
          quantity: number;
        },
      ];
      productId: string;
    },
  ];
  cannabinoidInfo: {
    cbd: string;
    cbda: string;
    cbn: string;
    thc: string;
    thca: string;
  };
  cbd: number;
  cbda: number;
  cbn: number;
  companyId: string;
  complianceError: string;
  complianceInfo: {
    allergens: string;
    directions: string;
    extractionProcess: string;
    finalTestingDate: number;
    ingredients: string;
    labName: string;
    lotNumber: string;
    mjTypeAndSolventUsed: string;
    nutritionInfo: {
      sodium: number;
      sugar: number;
      totalCarbs: number;
      totalFat: number;
    };
    packageDate: number;
    packagedBy: string;
    packagedByLicense: string;
    packedBy: string;
    packedByRegistrationNo: string;
    produceDate: number;
    producerEmail: string;
    producerLicense: string;
    producerName: string;
    producerPhone: string;
    producerRegistrationNo: string;
    producerWebsite: string;
    productionRunNumber: string;
    refrigeration: string;
    registrationCertificateNo: string;
    servingSize: number;
    servingsPerContainer: number;
    strain: string;
    testDate: number;
    testedBy: string;
    totalThcPerServing: number;
  };
  connectedBatchId: string;
  cost: number;
  costPerUnit: number;
  created: number;
  customerCompanyId: string;
  deleted: boolean;
  derivedLogId: string;
  dirty: boolean;
  expirationDate: number;
  externalId: string;
  externalLicense: string;
  finalTestingDate: number;
  flowerSourceType: string;
  fromTestSample: boolean;
  labelInfo: string;
  licenseId: string;
  lotId: string;
  metrcCategory: string;
  metrcLabTestingState: string;
  metrcQuantity: number;
  modified: number;
  moistureLoss: number;
  notes: [
    {
      created: number;
      deleted: boolean;
      enableOnFleet: boolean;
      id: string;
      message: string;
      modified: number;
      updated: boolean;
      writerId: string;
      writerName: string;
    },
  ];
  packageDate: number;
  perUnitExciseTax: number;
  poNumber: string;
  potencyAmount: {
    cbd: number;
    cbda: number;
    cbn: number;
    thc: number;
    thca: number;
  };
  potencyAmountInfo: {
    cbd: string;
    cbda: string;
    cbn: string;
    thc: string;
    thca: string;
  };
  prepaidTax: boolean;
  produceDate: number;
  productBatchLabel: {
    enableCultivationName: boolean;
    enableTestDate: boolean;
    enableTestResults: boolean;
    enabledBarCode: boolean;
    enabledPackageId: boolean;
    enabledProductName: boolean;
    enabledQRCode: boolean;
    enablesBatchId: boolean;
    enablesLotId: boolean;
    enablesNetWeight: boolean;
    labelType: string;
  };
  productName: string;
  productionBatch: boolean;
  published: boolean;
  publishedDate: number;
  publishedQuantity: number;
  purchaseOrderId: string;
  receiveDate: number;
  referenceNote: {
    created: number;
    deleted: boolean;
    enableOnFleet: boolean;
    id: string;
    message: string;
    modified: number;
    updated: boolean;
    writerId: string;
    writerName: string;
  };
  requestedStatus: string;
  roomId: string;
  sellBy: number;
  shopId: string;
  sku: string;
  status: string;
  terpenoids: {
    '<key>': number;
  };
  thc: number;
  thca: number;
  totalCultivationTax: number;
  totalExciseTax: number;
  trackHarvestBatch: string;
  trackHarvestDate: string;
  trackHarvestName: string;
  trackPackageId: number;
  trackPackageLabel: string;
  trackTraceSystem: string;
  trackTraceVerified: boolean;
  trackWeight: string;
  unProcessed: boolean;
  updated: boolean;
  vendorId: string;
  vendorName: string;
  voidStatus: boolean;
  waste: number;
}
