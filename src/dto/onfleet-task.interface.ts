export interface OnfleetTask {
  data: {
    task: {
      id: string; //'qLnFbnFUDF0iIGqgMEHGMMhk';
      notes: string;
      state: number;
      worker: string;
      creator: string;
      shortId: string;
      executor: string;
      feedback: any[];
      identity: { checksum: any; failedScanCount: number };
      merchant: string;
      metadata: Array<{
        name: 'companyId' | 'transId' | 'transNo' | 'shopId' | 'driverId';
        type: 'string';
        value: string;
        visibility: string[];
      }>;
      quantity: number;
      container: {
        type: string; // 'WORKER';
        worker: string;
      };
      overrides: {
        recipientName: any;
        recipientNotes: any;
        useMerchantForProxy: any;
        recipientSkipSMSNotifications: any;
      };
      appearance: { triangleColor: number };
      pickupTask: boolean;
      recipients: Array<{
        id: string;
        name: string;
        notes: string;
        phone: string;
        metadata: [];
        timeCreated: number;
        organization: string;
        timeLastModified: number;
        skipSMSNotifications: boolean;
      }>;
      destination: {
        id: string;
        notes: string;
        address: {
          city: string; //'Fremont';
          state: string; //'CA';
          number: string; //'4504';
          street: string; //'Leonato Way, Fremont, CA 94555, USA';
          country: string; //'US';
          apartment: string; //'';
          postalCode: string; //'94555';
        };
        location: [number, number];
        metadata: any[];
        warnings: any[];
        timeCreated: number;
        googlePlaceId: string;
        timeLastModified: number;
      };
      serviceTime: number;
      timeCreated: number;
      trackingURL: string;
      dependencies: any[];
      organization: string;
      completeAfter: number;
      completeBefore: number;
      trackingViewed: boolean;
      timeLastModified: number;
      completionDetails: {
        time?: number;
        events: any[];
        actions: any[];
        failureNotes: string;
        lastLocation: any[];
        failureReason: string;
        firstLocation: any[];
        photoUploadId: any;
        photoUploadIds: any;
        signatureUploadId: any;
        unavailableAttachments: any[];
      };
      additionalQuantities: { quantityA: number; quantityB: number; quantityC: number };
      estimatedArrivalTime?: number;
      estimatedCompletionTime?: number;
      scanOnlyRequiredBarcodes: boolean;
    };
  };
  time: number;
  taskId: string;
  adminId?: string;
  workerId: string;
  triggerId: 0;
  triggerName: string; //'taskStarted';
  actionContext: {
    id: string;
    type: string; //'WORKER'
  };
}
