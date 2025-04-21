import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose"
import {ApiProperty} from "@nestjs/swagger"
import {HydratedDocument, Types} from "mongoose"

export type InstitutionDocument = HydratedDocument<Institution>

@Schema()
export class Institution {
	@ApiProperty({description: "Идентификатор"})
	_id?: Types.ObjectId

	@ApiProperty({description: "Дата следующего платежа"})
	@Prop()
	payAt: Date
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution)
