export enum OrderStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  PREPARING = 'preparing',
  PICKED = 'picked',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled', // DB value lowercase
}
