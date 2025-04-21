import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose"
import {ApiProperty} from "@nestjs/swagger"
import {HydratedDocument, Types} from "mongoose"

export type TariffDocument = HydratedDocument<Tariff>

@Schema()
export class Tariff {
	@ApiProperty({description: "Идентификатор"})
	_id?: Types.ObjectId

	@ApiProperty({description: "Название"})
	@Prop()
	title: string

	@ApiProperty({description: "Стоимость с копейками"})
	@Prop()
	price: number

	@ApiProperty({description: "Тариф"})
	@Prop({default: "qr"})
	plan: "qr" | "erp"

	@ApiProperty({description: "Период оплаты"})
	@Prop()
	period: 1 | 6 | 12
}

export const TariffSchema = SchemaFactory.createForClass(Tariff)
