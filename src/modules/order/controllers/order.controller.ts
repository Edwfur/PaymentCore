import {Body, Controller, ForbiddenException, Headers, Post} from "@nestjs/common"
import {ApiOperation, ApiTags} from "@nestjs/swagger"

import {CallbackTBank, OrderService} from "../services/order.service"

@ApiTags("Order")
@Controller("order")
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post()
	@ApiOperation({summary: "Создание заказа"})
	async createOrder(@Body() body: {placeId: string; tariffId: string; phone: string}, @Headers("Authorization") auth: string) {
		if (auth !== process.env.AUTHORIZATION_KEY) throw new ForbiddenException()
		return this.orderService.createOrder(body.placeId, body.tariffId, body.phone)
	}

	@Post("callback")
	@ApiOperation({summary: "Обработка оплаты"})
	async callback(@Body() body: CallbackTBank) {
		return this.orderService.callback(body)
	}
}
