import {Module} from "@nestjs/common"
import {MongooseModule} from "@nestjs/mongoose"

import {Modules} from "./modules"

@Module({
	imports: [MongooseModule.forRoot(process.env.MONGODB_URI, {dbName: process.env.MONGODB_DB}), Modules],
})
export class AppModule {}
