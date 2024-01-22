import { RegisterRoutes } from "../build/routes";
import express, { json, urlencoded, Response as ExResponse, Request as ExRequest } from "express";
import swaggerUi from "swagger-ui-express";
import { logger } from "./configs/logger";
import { httpLogger } from "./configs/httpLogger";

export const app = express();
app.use(httpLogger);

// Use body parser to read sent json payloads
app.use(
    urlencoded({
        extended: true,
    })
);
app.use(json());

app.use("/api/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
    logger.info("Serving Swagger UI");
    return res.send(
        swaggerUi.generateHTML(await import("../build/swagger.json"))
    );
});

RegisterRoutes(app);