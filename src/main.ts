import "dotenv-flow/config"

import {ValidationPipe} from "@nestjs/common"
import {NestFactory} from "@nestjs/core"
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger"
import * as cookieParser from "cookie-parser"

import {AppModule} from "./app"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.enableCors()
	app.useGlobalPipes(new ValidationPipe())
	app.use(cookieParser(process.env.SECRET_COOKIES))

	SwaggerModule.setup(
		`docs`,
		app,
		SwaggerModule.createDocument(
			app,
			new DocumentBuilder()
				.setTitle("AuthService API")
				.setDescription("API для авторизации в сервисах Gerasimoff.space")
				.setVersion("1.0")
				// .addTag("Авторизация")

				.build()
		),
		{
			jsonDocumentUrl: `openapi`,
			yamlDocumentUrl: `openapi.yaml`,
		}
	)

	await app.listen(4000)
}
bootstrap()
