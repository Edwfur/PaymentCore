import {Module} from "@nestjs/common"
import {MongooseModule} from "@nestjs/mongoose"

import {OrderController} from "./controllers/order.controller"
import {Institution, InstitutionSchema} from "./schema/Institution.schema"
import {OrderErisa, OrderSchema} from "./schema/Order.schema"
import {Tariff, TariffSchema} from "./schema/Tariff.schema"
import {OrderService} from "./services/order.service"

@Module({
	imports: [
		MongooseModule.forFeature([{name: OrderErisa.name, schema: OrderSchema}]),
		MongooseModule.forFeature([{name: Tariff.name, schema: TariffSchema}]),
		MongooseModule.forFeature([{name: Institution.name, schema: InstitutionSchema}]),
	],
	controllers: [OrderController],
	providers: [OrderService],
})
export class OrdersModule {}
