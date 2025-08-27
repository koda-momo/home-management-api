export interface LineMessage {
  type: 'text';
  text: string;
}

export interface LinePushMessagePayload {
  to: string;
  messages: LineMessage[];
  notificationDisabled?: boolean;
}

export interface LineApiResponse {
  message: string;
}
