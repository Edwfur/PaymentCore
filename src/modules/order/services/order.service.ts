import {BadRequestException, Injectable} from "@nestjs/common"
import {InjectModel} from "@nestjs/mongoose"
import axios from "axios"
import * as dayjs from "dayjs"
import {Model, Types} from "mongoose"
import {clearPhone} from "utils/clearPhone"
import {createToken} from "utils/createToken"

import {Institution} from "../schema/Institution.schema"
import {OrderErisa} from "../schema/Order.schema"
import {Tariff} from "../schema/Tariff.schema"

export interface CallbackTBank {
	TerminalKey: string
	OrderId: string
	Success: boolean
	Status: string
	PaymentId: number
	ErrorCode: string
	Amount: number
	CardId: number
	Pan: string
	ExpDate: string
	Token: string
}

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(Tariff.name) private readonly tariffModel: Model<Tariff>,
		@InjectModel(OrderErisa.name) private readonly orderModel: Model<OrderErisa>,
		@InjectModel(Institution.name) private readonly institutionModel: Model<Institution>
	) {}

	async createOrder(placeId: string, tariffId: string, phone: string): Promise<{orderId: string; paymentUrl: string}> {
		const tariff = await this.tariffModel.findOne({_id: new Types.ObjectId(tariffId)}).lean()

		if (!tariff) throw new BadRequestException("Tariff not found")

		const order = new this.orderModel({
			name: tariff.title,
			place: new Types.ObjectId(placeId),
			price: tariff.price,
			tariff: new Types.ObjectId(tariffId),
			phone: `+${clearPhone(phone)}`,
		})

		order.save()

		const data = {
			TerminalKey: process.env.TERMINAL_ID,
			Amount: order.price,
			OrderId: order._id.toString(),
			Description: order.name,
			SuccessURL: process.env.SUCCESS_URL_CREATE,
		}

		const result = await axios
			.post(`${process.env.TBANK_API}/v2/Init`, {
				...data,
				Receipt: {
					Phone: order.phone,
					Taxation: "usn_income",
					Items: [
						{
							Name: order.name,
							Price: order.price,
							Quantity: 1,
							Amount: order.price,
							PaymentObject: "service",
							Tax: "none",
						},
					],
				},
				Token: createToken(data),
			})
			.then((res) => res.data)

		order.paymentId = result.PaymentId
		order.paymentUrl = result.PaymentURL

		order.save()

		return {
			orderId: order._id.toString(),
			paymentUrl: result.PaymentURL,
		}
	}

	async callback({Token, ...data}: CallbackTBank) {
		const token = createToken(data)

		if (token !== Token) throw new BadRequestException("Invalid token")

		const order = await this.orderModel.findOne({_id: new Types.ObjectId(data.OrderId)})

		if (!order) throw new BadRequestException("Order not found")

		if (order.successPay) throw new BadRequestException("Order already paid")

		order.paidAt = data.Success ? new Date() : null
		order.status = data.Status
		order.successPay = data.Success
		order.cardId = data.CardId
		order.cardMask = data.Pan

		order.save()

		if (data.Success) {
			const institution = await this.institutionModel.findOne({_id: new Types.ObjectId(order.place.toString())})

			if (institution) {
				const tariff = await this.tariffModel.findOne({_id: order.tariff})
				if (!tariff) return

				if (dayjs(institution.payAt).isBefore()) {
					institution.payAt = dayjs().add(tariff.period, "month").toDate()
				} else {
					institution.payAt = dayjs(institution.payAt).add(tariff.period, "month").toDate()
				}
				institution.save()
			}
		}

		return true
	}
}
