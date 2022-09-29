export interface BlazeValidBatchDto {
  id: string;
  // quantity in stock
  liveQuantity: number;
  productId: string;
  purchasedDate: Date;
  expirationDate: Date;
  receiveDate: Date;
  metrcTagId?: string;
  unique: string;
  purchaseQty: number;
  unitCost?: number;
  price?: number;
  status?: string;
}
