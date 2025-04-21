import {Module} from "@nestjs/common"

import {OrdersModule} from "./order"

@Module({
	imports: [OrdersModule],
})
export class Modules {}
