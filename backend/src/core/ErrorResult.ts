export type ErrorResponseJSON = {
  message: string;
  status: number;
};

export default class ErrorResult extends Error implements ErrorResponseJSON {
  status: number;

  constructor(message = "Unknown error", status = 500) {
    super(message);
    this.status = status;
  }
}
