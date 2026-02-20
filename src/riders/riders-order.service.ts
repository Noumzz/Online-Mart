import { OrderService } from './../orders/order.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/order.entity';
import { OrderStatus } from 'src/types/enums/order-status.enum';
import { DataSource, Repository } from 'typeorm';
import { Rider } from './rider.entity';
import { RidersService } from './riders.service';

@Injectable()
export class RidersOrderService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Rider)
    private riderRepo: Repository<Rider>,
    private riderService: RidersService,
    private orderService: OrderService,
  ) {}
  async availbleOrder() {
    const orders = await this.orderRepo.find({
      where: {
        orderStatus: OrderStatus.PENDING,
      },
      relations: ['rider'],
    });
    return orders;
  }

  async acceptOrder(orderId: number, riderId: number) {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: {
          id: orderId,
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.orderStatus !== 'pending' || order.riderId) {
        throw new ConflictException('Order already placed');
      }
      const rider = await manager.findOne(Rider, {
        where: {
          id: riderId,
        },
      });
      if (!rider) {
        throw new NotFoundException('Rider not found');
      }
      order.orderStatus = OrderStatus.ASSIGNED;
      order.rider = rider;

      const savedOrder = await manager.save(order);
      await manager.save(order);

      // Fetch order with rider and orderItems for returning
      const fullOrder = await manager.findOne(Order, {
        where: { id: orderId },
        relations: [
          'rider',
          'orderItems',
          'rider.orders',
          'orderItems.product',
        ],
      });

      return {
        OrderItems: fullOrder?.orderItems,
        OrderTotalAmount: fullOrder?.totalAmount,
      };
    });
  }

  async pickOrder(riderId: number, orderId: number) {
    const order = await this.orderRepo.findOne({
      where: {
        id: orderId,
      },
    });
    if (!order) {
      throw new NotFoundException('order not found');
    }
    // const rider = await this.riderRepo.findOne({
    //   where: {
    //     id: riderId,
    //   },
    // });
    // if (!rider) {
    //   throw new UnauthorizedException('You are not authorized');
    // }
    if (
      order.riderId !== riderId ||
      order.orderStatus !== OrderStatus.ASSIGNED
    ) {
      throw new UnauthorizedException('Not Authorized');
    }

    order.orderStatus = OrderStatus.PICKED;
    const assigned = await this.orderRepo.save(order);
    return {
      orderStatus: assigned.orderStatus,
    };
  }
  async cancelOrder(riderId: number, orderId: number) {
    const order = await this.orderService.findOrderById(orderId);

    if (
      order.riderId !== riderId ||
      (order.orderStatus !== OrderStatus.ASSIGNED &&
        order.orderStatus !== OrderStatus.PREPARING)
    ) {
      throw new UnauthorizedException('No Authorized');
    }
    order.orderStatus = OrderStatus.CANCELLED;
    const updatedOrder = await this.orderRepo.save(order);
    return {
      status: updatedOrder.orderStatus,
    };
  }

  async deliverOrder(riderId: number, orderId: number) {
    const order = await this.orderService.findOrderById(orderId);
    if (order.riderId != riderId || order.orderStatus !== OrderStatus.PICKED) {
      throw new UnauthorizedException('Not Authorized');
    }
    order.orderStatus = OrderStatus.DELIVERED;
    const updatedOrder = await this.orderRepo.save(order);
    return {
      orderStatus: updatedOrder.orderStatus,
    };
  }
}
