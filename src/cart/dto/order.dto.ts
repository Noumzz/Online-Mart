import { OrderItemDto } from './order-item.dto';

export class OrderDto {
  id: number;
  totalAmount: number;
  orderStatus: string;
  orderItems: OrderItemDto[];
}
