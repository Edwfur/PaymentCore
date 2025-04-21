import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose"
import {ApiProperty} from "@nestjs/swagger"
import {HydratedDocument, Types} from "mongoose"

export type OrderDocument = HydratedDocument<OrderErisa>

@Schema()
export class OrderErisa {
	@ApiProperty({description: "Идентификатор"})
	_id?: Types.ObjectId

	@ApiProperty({description: "Название"})
	@Prop()
	name: string

	@ApiProperty({description: "Точка для которой происходит оплата"})
	@Prop()
	place: Types.ObjectId

	@ApiProperty({description: "Стоимость с копейками"})
	@Prop()
	price: number

	@ApiProperty({description: "Тариф"})
	@Prop()
	tariff: Types.ObjectId

	@ApiProperty({description: "Статус"})
	@Prop({default: "NEW"})
	status: string

	@ApiProperty({description: "Номер телефона"})
	@Prop()
	phone: number

	@ApiProperty({description: "Номер оплаты"})
	@Prop()
	paymentId?: number

	@ApiProperty({description: "Ссылка на оплату"})
	@Prop()
	paymentUrl?: string

	@ApiProperty({description: "Дата создания"})
	@Prop({default: new Date()})
	createdAt: Date

	@ApiProperty({description: "Дата оплаты"})
	@Prop()
	paidAt?: Date

	@ApiProperty({description: "Оплата произведена"})
	@Prop()
	successPay?: boolean

	@ApiProperty({description: "Маска карты"})
	@Prop()
	cardMask?: string

	@ApiProperty({description: "Id карты"})
	@Prop()
	cardId?: number
}

export const OrderSchema = SchemaFactory.createForClass(OrderErisa)
