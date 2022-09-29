export interface BlazeOrderCreateDto {
  blazeUserId: string;
  items: BlazeOrderItemCreateDto[];
  total: number;
  deliveryAddress: BlazeAddressCreateDto;
  deliveryDate: number; // TIMESLOT
  completeAfter: number; // TIMESLOT
}

export interface BlazeOrderItemCreateDto {
  productId: string;
  quantity: number;
  price: number;
}

export interface BlazeAddressCreateDto {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
