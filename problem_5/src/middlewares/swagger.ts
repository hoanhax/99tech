import swaggerUi from 'swagger-ui-express';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

/**
 * Load OpenAPI specification from YAML file
 */
const loadOpenAPISpec = () => {
  const openApiPath = path.join(__dirname, '../../openapi.yaml');
  const fileContent = fs.readFileSync(openApiPath, 'utf8');
  return yaml.parse(fileContent);
};

/**
 * Middleware to check if API documentation should be enabled
 * Only allows access in development environment
 */
export const checkSwaggerEnabled = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (!isDevelopment) {
    res.status(404).json({
      success: false,
      error: {
        message: 'API documentation is only available in development environment',
      },
    });
    return;
  }

  next();
};

/**
 * Swagger UI options
 */
export const swaggerOptions: swaggerUi.SwaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { font-size: 2.5em; }
  `,
  customSiteTitle: 'Product Management API - Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
};

/**
 * Get Swagger UI setup
 */
export const getSwaggerSetup = () => {
  const openApiSpec = loadOpenAPISpec();
  return {
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(openApiSpec, swaggerOptions),
  };
};
