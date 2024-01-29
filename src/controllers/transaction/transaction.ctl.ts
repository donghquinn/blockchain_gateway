import { Body, Controller, Post } from "@nestjs/common";
import { sendTransactionValidator } from "@validators/transaction/send.validator";
import { setErrorResponse, setResponse } from "dto/response.dto";
import { TransactionProvider } from "providers/transaction/transaction.pvd";
import { SendTransactionRequest } from "types/transaction/request.type";

@Controller("tx")
export class TransactionController {
  constructor(private readonly transaction: TransactionProvider) {}

  @Post("send")
  async sendTransactionController(@Body() request: SendTransactionRequest) {
    try {
      const { from, to, value, gas } = await sendTransactionValidator(request);

      const txHash = await this.transaction.sendTransaction(
        from,
        to,
        value,
        gas,
      );

      return setResponse(200, { txHash });
    } catch (error) {
      return setErrorResponse(error);
    }
  }
}
