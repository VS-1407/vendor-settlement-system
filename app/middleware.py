import time
import traceback

from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse

from app.logger import logger


class RequestLoggerMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request, call_next):

        start_time = time.time()

        try:
            response = await call_next(request)

            process_time = (
                time.time() - start_time
            )

            log_message = (
                f"{request.method} "
                f"{request.url.path} - "
                f"{response.status_code} - "
                f"{process_time:.4f} sec"
            )


            if response.status_code >= 500:

                logger.error(log_message)

            else:

                logger.info(log_message)


            return response


        except Exception as e:

            process_time = (
                time.time() - start_time
            )

            logger.error(
                f"CRASH: {request.method} "
                f"{request.url.path} - "
                f"{process_time:.4f} sec"
            )

            logger.error(
                f"Exception: {str(e)}"
            )

            logger.error(
                traceback.format_exc()
            )


            return JSONResponse(
                status_code=500,
                content={
                    "detail": "Internal server error"
                }
            )