export class PopupFailed extends Error {}
export class OAuth2Error extends Error {}
export class InvalidRequest extends OAuth2Error {}
export class UnauthorizedClient extends OAuth2Error {}
export class AccessDenied extends OAuth2Error {}
export class UnsupportedResponseType extends OAuth2Error {}
export class InvalidScope extends OAuth2Error {}
export class ServerError extends OAuth2Error {}
export class TemporarilyUnavailable extends OAuth2Error {}

export const ERROR_MAPPING: Record<string, typeof OAuth2Error> = {
  invalid_request: InvalidRequest,
  unauthorized_client: UnauthorizedClient,
  access_denied: AccessDenied,
  unsupported_response_type: UnsupportedResponseType,
  invalid_scope: InvalidScope,
  server_error: ServerError,
  temporarily_unavailable: TemporarilyUnavailable,
};
