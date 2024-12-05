import { Response } from "express";

type props = {
  res: Response;

  message?: string;
  data?: any;
  status?: number;
  token?: string;
};

function formatResponse({
  res,
  data,
  status = 200,
  message = "Success",
  token,
}: props) {
  return res.status(status).json({
    status,
    message,
    data,
    token,
  });
}

export default formatResponse;
