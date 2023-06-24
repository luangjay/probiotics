"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

type ReactSwaggerProps = {
  spec?: Record<string, any>;
};

function Swagger({ spec }: ReactSwaggerProps) {
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

export default Swagger;
