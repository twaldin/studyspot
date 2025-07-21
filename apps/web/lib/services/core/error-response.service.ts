import { NextResponse } from "next/server";
import logger, { LogContext } from "@/lib/logger";

/**
 * Standard error types used across the application
 */
export type ErrorType =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation_error"
  | "duplicate_resource"
  | "database_error"
  | "external_service_error"
  | "file_upload_error"
  | "processing_error"
  | "rate_limit_exceeded"
  | "server_error"
  | "not_onboarded"
  | "no_school"
  | "no_course"
  | "school_access_denied"
  | "course_access_denied";

/**
 * Standard error response interface
 */
export interface ErrorResponse {
  message: string;
  type: ErrorType;
  details?: Record<string, any>;
  code?: string;
}

/**
 * Internal error details for logging and processing
 */
export interface ServiceError {
  message: string;
  type: ErrorType;
  status: number;
  originalError?: any;
  context?: Record<string, any>;
  userMessage?: string;
  details?: Record<string, any>;
  code?: string;
}

/**
 * HTTP status code mapping for different error types
 */
const ERROR_STATUS_MAP: Record<ErrorType, number> = {
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  validation_error: 400,
  duplicate_resource: 409,
  database_error: 500,
  external_service_error: 502,
  file_upload_error: 400,
  processing_error: 500,
  rate_limit_exceeded: 429,
  server_error: 500,
  not_onboarded: 400,
  no_school: 400,
  no_course: 400,
  school_access_denied: 403,
  course_access_denied: 403,
};

/**
 * User-friendly error messages for different error types
 */
const USER_FRIENDLY_MESSAGES: Record<ErrorType, string> = {
  unauthorized: "You must be logged in to access this resource",
  forbidden: "You do not have permission to access this resource",
  not_found: "The requested resource was not found",
  validation_error: "The provided data is invalid",
  duplicate_resource: "This resource already exists",
  database_error: "A database error occurred. Please try again",
  external_service_error:
    "An external service is currently unavailable. Please try again later",
  file_upload_error: "File upload failed. Please check your file and try again",
  processing_error: "Failed to process your request. Please try again",
  rate_limit_exceeded: "Too many requests. Please wait before trying again",
  server_error: "An unexpected error occurred. Please try again later",
  not_onboarded: "Please complete your account setup first",
  no_school: "Please select a school to continue",
  no_course: "Please select a course to continue",
  school_access_denied: "You do not have access to this school's data",
  course_access_denied: "You do not have access to this course",
};

/**
 * Service for standardizing error handling and responses across the application
 */
export class ErrorResponseService {
  private static instance: ErrorResponseService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): ErrorResponseService {
    if (!ErrorResponseService.instance) {
      ErrorResponseService.instance = new ErrorResponseService();
    }
    return ErrorResponseService.instance;
  }

  /**
   * Create a standardized ServiceError
   * @param type - Error type
   * @param message - Error message (for developers/logging)
   * @param options - Additional error options
   * @returns ServiceError object
   */
  public createError(
    type: ErrorType,
    message: string,
    options: {
      originalError?: any;
      context?: Record<string, any>;
      userMessage?: string;
      details?: Record<string, any>;
      code?: string;
      status?: number;
    } = {},
  ): ServiceError {
    return {
      message,
      type,
      status: options.status || ERROR_STATUS_MAP[type],
      originalError: options.originalError,
      context: options.context,
      userMessage: options.userMessage || USER_FRIENDLY_MESSAGES[type],
      details: options.details,
      code: options.code,
    };
  }

  /**
   * Map common database errors to service errors
   * @param error - Database error object
   * @param context - Additional context for logging
   * @returns ServiceError object
   */
  public mapDatabaseError(
    error: any,
    context?: Record<string, any>,
  ): ServiceError {
    const errorCode = error?.code;
    const errorMessage = error?.message || "Database operation failed";

    // Handle common PostgreSQL/Supabase error codes
    switch (errorCode) {
      case "23505": // unique_violation
        return this.createError("duplicate_resource", errorMessage, {
          originalError: error,
          context,
          code: errorCode,
          userMessage: "This resource already exists",
        });

      case "23503": // foreign_key_violation
        return this.createError("validation_error", errorMessage, {
          originalError: error,
          context,
          code: errorCode,
          userMessage: "Referenced resource does not exist",
        });

      case "23502": // not_null_violation
        return this.createError("validation_error", errorMessage, {
          originalError: error,
          context,
          code: errorCode,
          userMessage: "Required field is missing",
        });

      case "42501": // insufficient_privilege
        return this.createError("forbidden", errorMessage, {
          originalError: error,
          context,
          code: errorCode,
          userMessage: "Insufficient permissions to perform this operation",
        });

      default:
        return this.createError("database_error", errorMessage, {
          originalError: error,
          context,
          code: errorCode,
        });
    }
  }

  /**
   * Map validation errors to service errors
   * @param validationErrors - Array of validation error messages or single message
   * @param context - Additional context for logging
   * @returns ServiceError object
   */
  public mapValidationError(
    validationErrors: string | string[],
    context?: Record<string, any>,
  ): ServiceError {
    const errors = Array.isArray(validationErrors)
      ? validationErrors
      : [validationErrors];
    const message = `Validation failed: ${errors.join(", ")}`;

    return this.createError("validation_error", message, {
      context,
      details: { validationErrors: errors },
      userMessage: errors.length === 1
        ? errors[0]
        : "Please check your input and try again",
    });
  }

  /**
   * Map external service errors (AI, file upload, etc.) to service errors
   * @param error - External service error
   * @param serviceName - Name of the external service
   * @param context - Additional context for logging
   * @returns ServiceError object
   */
  public mapExternalServiceError(
    error: any,
    serviceName: string,
    context?: Record<string, any>,
  ): ServiceError {
    const errorMessage = error?.message || `${serviceName} service error`;

    // Check if it's a rate limiting error
    if (error?.status === 429 || error?.code === "rate_limit_exceeded") {
      return this.createError("rate_limit_exceeded", errorMessage, {
        originalError: error,
        context: { ...context, service: serviceName },
        userMessage:
          `${serviceName} is currently experiencing high demand. Please try again in a few minutes`,
      });
    }

    // Check if it's a file upload error
    if (
      serviceName.toLowerCase().includes("upload") ||
      error?.type === "file_upload"
    ) {
      return this.createError("file_upload_error", errorMessage, {
        originalError: error,
        context: { ...context, service: serviceName },
      });
    }

    return this.createError("external_service_error", errorMessage, {
      originalError: error,
      context: { ...context, service: serviceName },
      userMessage:
        `${serviceName} is currently unavailable. Please try again later`,
    });
  }

  /**
   * Log error with appropriate level and context
   * @param error - ServiceError to log
   * @param additionalContext - Additional context for logging
   */
  public logError(
    error: ServiceError,
    additionalContext?: Record<string, any>,
  ): void {
    const logContext = {
      error: {
        message: error.message,
        type: error.type,
        status: error.status,
        code: error.code,
        ...(error.originalError && { originalError: error.originalError }),
      },
      ...(error.context && { context: error.context }),
      ...(additionalContext && { additional: additionalContext }),
    };

    // Log at different levels based on error type
    switch (error.type) {
      case "unauthorized":
      case "forbidden":
      case "not_found":
      case "validation_error":
      case "duplicate_resource":
      case "not_onboarded":
      case "no_school":
      case "no_course":
      case "school_access_denied":
      case "course_access_denied":
        // These are expected/client errors - log at info level
        logger.info({
          ...logContext,
          ...LogContext.service("ErrorResponse", "client_error"),
        }, error.message);
        break;

      case "rate_limit_exceeded":
        logger.warn({
          ...logContext,
          ...LogContext.service("ErrorResponse", "rate_limit"),
        }, error.message);
        break;

      case "database_error":
      case "external_service_error":
      case "file_upload_error":
      case "processing_error":
      case "server_error":
        // These are server errors - log at error level
        logger.error({
          ...logContext,
          ...LogContext.service("ErrorResponse", "server_error"),
        }, error.message);
        break;

      default:
        logger.error({
          ...logContext,
          ...LogContext.service("ErrorResponse", "unknown_error"),
        }, error.message);
    }
  }

  /**
   * Convert ServiceError to NextResponse
   * @param error - ServiceError to convert
   * @param includeDetails - Whether to include error details in response (default: false in production)
   * @returns NextResponse with appropriate status and error payload
   */
  public toResponse(
    error: ServiceError,
    includeDetails: boolean = false,
  ): NextResponse {
    // Log the error
    this.logError(error);

    // Prepare response payload
    const errorResponse: ErrorResponse = {
      message: error.userMessage || error.message,
      type: error.type,
      ...(error.code && { code: error.code }),
    };

    // Include details only if explicitly requested (useful for development)
    if (includeDetails && error.details) {
      errorResponse.details = error.details;
    }

    return NextResponse.json(errorResponse, { status: error.status });
  }

  /**
   * Handle unknown errors by converting them to ServiceError
   * @param error - Unknown error object
   * @param context - Additional context for logging
   * @returns ServiceError object
   */
  public handleUnknownError(
    error: any,
    context?: Record<string, any>,
  ): ServiceError {
    // If it's already a ServiceError, return it
    if (this.isServiceError(error)) {
      return error;
    }

    // Try to extract meaningful information from the error
    const message = error?.message || "An unexpected error occurred";
    const code = error?.code;
    const status = error?.status || error?.statusCode;

    return this.createError("server_error", message, {
      originalError: error,
      context,
      code,
      status,
    });
  }

  /**
   * Type guard to check if an object is a ServiceError
   * @param error - Object to check
   * @returns True if object is ServiceError
   */
  public isServiceError(error: any): error is ServiceError {
    return (
      error &&
      typeof error.message === "string" &&
      typeof error.type === "string" &&
      typeof error.status === "number" &&
      Object.values(ERROR_STATUS_MAP).includes(error.status)
    );
  }

  /**
   * Create common auth-related errors
   */
  public createAuthError(
    type:
      | "unauthorized"
      | "not_onboarded"
      | "no_school"
      | "no_course"
      | "school_access_denied"
      | "course_access_denied",
    context?: Record<string, any>,
  ): ServiceError {
    return this.createError(type, USER_FRIENDLY_MESSAGES[type], { context });
  }

  /**
   * Create validation error from field-specific issues
   * @param fieldErrors - Object mapping field names to error messages
   * @param context - Additional context for logging
   * @returns ServiceError object
   */
  public createFieldValidationError(
    fieldErrors: Record<string, string | string[]>,
    context?: Record<string, any>,
  ): ServiceError {
    const allErrors: string[] = [];

    Object.entries(fieldErrors).forEach(([field, errors]) => {
      const fieldErrors = Array.isArray(errors) ? errors : [errors];
      fieldErrors.forEach((error) => {
        allErrors.push(`${field}: ${error}`);
      });
    });

    return this.createError(
      "validation_error",
      `Field validation failed: ${allErrors.join(", ")}`,
      {
        context,
        details: { fieldErrors },
        userMessage: "Please check the highlighted fields and try again",
      },
    );
  }

  /**
   * Quick helper to create and return error response
   * @param type - Error type
   * @param message - Error message
   * @param options - Additional options
   * @returns NextResponse with error
   */
  public quickError(
    type: ErrorType,
    message: string,
    options: {
      originalError?: any;
      context?: Record<string, any>;
      userMessage?: string;
      details?: Record<string, any>;
      code?: string;
      status?: number;
      includeDetails?: boolean;
    } = {},
  ): NextResponse {
    const error = this.createError(type, message, options);
    return this.toResponse(error, options.includeDetails);
  }
}

// Export singleton instance for convenience
export const errorService = ErrorResponseService.getInstance();

/**
 * Wraps an async API route handler to automatically catch and standardize errors.
 *
 * Converts any thrown errors into structured service errors and returns a consistent JSON error response. Optionally includes error details and additional logging context.
 *
 * @param handler - The async API route handler to wrap
 * @param options - Optional settings to include error details in the response and provide additional logging context
 * @returns A new handler function with integrated error handling
 */
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<Response>,
  options: {
    includeDetails?: boolean;
    context?: Record<string, any>;
  } = {},
) {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      const serviceError = errorService.handleUnknownError(
        error,
        options.context,
      );
      return errorService.toResponse(serviceError, options.includeDetails);
    }
  };
}

// Types are exported through the main service index for centralized access
