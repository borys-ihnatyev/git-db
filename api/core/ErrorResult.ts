export type ErrorResponseJSON = {
  message: string;
  status: number;
};

export default class ErrorResult extends Error implements ErrorResponseJSON {
  constructor(message = "Unknown error", public status = 500) {
    super(message);
  }
}
