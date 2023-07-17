"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

type ReactSwaggerProps = {
  spec?: Record<string, any>;
};

export function Swagger({ spec }: ReactSwaggerProps) {
  return (
    <SwaggerUI
      spec={spec}
      tryItOutEnabled
      displayRequestDuration
      defaultModelRendering="model"
      defaultModelExpandDepth={2}
    />
  );
}
