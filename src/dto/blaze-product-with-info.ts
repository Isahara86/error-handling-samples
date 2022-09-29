import { BlazeAssetDto } from './blaze-asset.dto';

export interface BlazeProductWithInfo {
  id: string;
  quantities: Array<{
    companyId: string;
    created: number;
    deleted: boolean;
    dirty: boolean;
    id: string;
    inventoryId: string;
    modified: number;
    quantity: number;
    shopId: string;
    updated: boolean;
  }>;
  active: boolean;
  assets: BlazeAssetDto[];
  automaticReOrder: boolean;
  brand: {
    active: boolean;
    brandLogo: {
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
    companyId: string;
    created: number;
    default: boolean;
    deleted: boolean;
    externalId: string;
    id: string;
    modified: number;
    name: string;
    phoneNo: string;
    updated: boolean;
    vendorList: [string];
    website: string;
  };
  brandId: string;
  bundleItems: Array<{
    productId: string;
    quantity: number;
  }>;
  byGram: boolean;
  byPrepackage: boolean;
  cannabisType: string;
  category: {
    active: boolean;
    cannabis: boolean;
    cannabisType: string;
    companyId: string;
    complianceId: string;
    created: number;
    deleted: boolean;
    dirty: boolean;
    externalId: string;
    id: string;
    lowThreshold: number;
    modified: number;
    name: string;
    photo: {
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
    priority: number;
    shopId: string;
    unitType: string;
    updated: boolean;
    wmCategory: string;
  };
  categoryId: string;
  cbd: number;
  cbda: number;
  cbn: number;
  committedQuantities: {
    [key: string]: number;
  };
  companyId: string;
  companyLinkId: string;
  complianceId: string;
  created: number;
  customGramType: string;
  customTaxInfo: {
    cityTax: number;
    created: number;
    deleted: boolean;
    federalTax: number;
    id: string;
    modified: number;
    stateTax: number;
    updated: boolean;
  };
  customWeight: number;
  deleted: boolean;
  description: string;
  dirty: boolean;
  discountEnabled: boolean;
  discountable: boolean;
  dispatchPrepackageItemId: string;
  enableExciseTax: boolean;
  enableMixMatch: boolean;
  enableWeedmap: boolean;
  externalId: string;
  flowerType: string;
  genetics: string;
  importId: string;
  importSrc: string;
  instock: boolean;
  lastLeaflySyncStatus: boolean;
  lastLeaflySyncTime: number;
  lastWMSyncTime: number;
  lowInventoryNotification: boolean;
  lowThreshold: number;
  medicalConditions: Array<{
    created: number;
    deleted: boolean;
    id: string;
    modified: number;
    name: string;
    updated: boolean;
  }>;
  medicinal: boolean;
  modified: number;
  name: string;
  notes: Array<{
    created: number;
    deleted: boolean;
    enableOnFleet: boolean;
    id: string;
    message: string;
    modified: number;
    updated: boolean;
    writerId: string;
    writerName: string;
  }>;
  overrideMetrcCategoryId: string;
  potency: boolean;
  potencyAmount: {
    cbd: number;
    cbda: number;
    cbn: number;
    thc: number;
    thca: number;
  };
  prepackageQuantities: {
    [key: string]: {
      committedQuantities: {
        [key: string]: number;
      };
      sellableQuantities: {
        [key: string]: number;
      };
      totalCommittedQuantity: number;
      totalSellableQuantity: number;
    };
  };
  priceBreaks: Array<{
    active: boolean;
    assignedPrice: number;
    companyId: string;
    created: number;
    deleted: boolean;
    displayName: string;
    id: string;
    modified: number;
    name: string;
    price: number;
    priceBreakType: string;
    priority: number;
    quantity: number;
    salePrice: number;
    updated: boolean;
  }>;
  priceIncludesALExcise: boolean;
  priceIncludesExcise: boolean;
  priceRanges: Array<{
    assignedPrice: number;
    id: string;
    price: number;
    priority: number;
    salePrice: number;
    weightTolerance: {
      companyId: string;
      created: number;
      deleted: boolean;
      enabled: boolean;
      endWeight: number;
      id: string;
      modified: number;
      name: string;
      priority: number;
      startWeight: number;
      unitValue: number;
      updated: boolean;
      weightKey: string;
      weightValue: number;
    };
    weightToleranceId: string;
  }>;
  pricingTemplateId: string;
  producerAddress: {
    address: string;
    addressLine2: string;
    city: string;
    companyId: string;
    country: string;
    created: number;
    deleted: boolean;
    id: string;
    latitude: number;
    longitude: number;
    modified: number;
    state: string;
    updated: boolean;
    zipCode: string;
  };
  producerLicense: string;
  producerMfg: string;
  productSaleType: string;
  productType: string;
  qbItemRef: string;
  reOrderLevel: number;
  salesPrice: number;
  secondaryVendors: string[];
  sellable: boolean;
  sellableQuantities: {
    [key: string]: number;
  };
  shopId: string;
  showInWidget: boolean;
  sku: string;
  syncToThirdPartyMenus: boolean;
  tags: [string];
  taxOrder: string;
  taxTables: Array<{
    active: boolean;
    cityTax: {
      active: boolean;
      activeExciseTax: boolean;
      companyId: string;
      compound: boolean;
      created: number;
      deleted: boolean;
      dirty: boolean;
      displayName: string;
      id: string;
      modified: number;
      shopId: string;
      taxOrder: string;
      taxRate: number;
      territory: string;
      updated: boolean;
    };
    companyId: string;
    consumerType: string;
    countyTax: {
      active: boolean;
      activeExciseTax: boolean;
      companyId: string;
      compound: boolean;
      created: number;
      deleted: boolean;
      dirty: boolean;
      displayName: string;
      id: string;
      modified: number;
      shopId: string;
      taxOrder: string;
      taxRate: number;
      territory: string;
      updated: boolean;
    };
    created: number;
    deleted: boolean;
    dirty: boolean;
    federalTax: {
      active: boolean;
      activeExciseTax: boolean;
      companyId: string;
      compound: boolean;
      created: number;
      deleted: boolean;
      dirty: boolean;
      displayName: string;
      id: string;
      modified: number;
      shopId: string;
      taxOrder: string;
      taxRate: number;
      territory: string;
      updated: boolean;
    };
    id: string;
    modified: number;
    name: string;
    shopId: string;
    stateTax: {
      active: boolean;
      activeExciseTax: boolean;
      companyId: string;
      compound: boolean;
      created: number;
      deleted: boolean;
      dirty: boolean;
      displayName: string;
      id: string;
      modified: number;
      shopId: string;
      taxOrder: string;
      taxRate: number;
      territory: string;
      updated: boolean;
    };
    taxOrder: string;
    taxType: string;
    updated: boolean;
  }>;
  taxType: string;
  thc: number;
  thca: number;
  toleranceId: string;
  totalCommittedQuantity: number;
  totalSellableQuantity: number;
  unitPrice: number;
  unitValue: number;
  updated: boolean;
  usableMarijuana: number;
  vendor: {
    accountOwnerId: string;
    active: boolean;
    additionalAddressList: Array<{
      address: string;
      addressLine2: string;
      city: string;
      companyId: string;
      country: string;
      created: number;
      deleted: boolean;
      id: string;
      latitude: number;
      longitude: number;
      modified: number;
      state: string;
      updated: boolean;
      zipCode: string;
    }>;
    address: {
      address: string;
      addressLine2: string;
      city: string;
      companyId: string;
      country: string;
      created: number;
      deleted: boolean;
      id: string;
      latitude: number;
      longitude: number;
      modified: number;
      state: string;
      updated: boolean;
      zipCode: string;
    };
    armsLengthType: string;
    assets: Array<{
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
    }>;
    backOrderEnabled: boolean;
    brands: [string];
    companyId: string;
    companyLicenses: Array<{
      companyType: string;
      created: number;
      deleted: boolean;
      id: string;
      licenseExpirationDate: number;
      licenseNumber: string;
      licenseType: string;
      modified: number;
      toDefault: boolean;
      updated: boolean;
    }>;
    companyType: string;
    connectedShop: string;
    contactPerson: string;
    created: number;
    createdBy: string;
    credits: number;
    dbaName: string;
    defaultContactId: string;
    defaultPaymentTerm: string;
    deleted: boolean;
    description: string;
    email: string;
    externalId: string;
    fax: string;
    firstName: string;
    id: string;
    importId: string;
    lastName: string;
    licenceType: string;
    licenseExpirationDate: number;
    licenseNumber: string;
    mobileNumber: string;
    modified: number;
    name: string;
    notes: Array<{
      created: number;
      deleted: boolean;
      enableOnFleet: boolean;
      id: string;
      message: string;
      modified: number;
      updated: boolean;
      writerId: string;
      writerName: string;
    }>;
    phone: string;
    qbVendorRef: Array<{
      [key: string]: string;
    }>;
    relatedEntity: boolean;
    salesPerson: string;
    toDefault: boolean;
    updated: boolean;
    vendorKey: string;
    vendorType: string;
    website: string;
  };
  vendorId: string;
  weightPerUnit: string;
  wmOnlineSellable: boolean;
  wmThreshold: number;
}