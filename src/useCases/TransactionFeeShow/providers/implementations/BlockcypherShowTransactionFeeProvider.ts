import axios from 'axios';

import networkConfig from '@config/network';
import { ApplicationError } from '@errors/ApplicationError';

import {
  IShowTransactionFeeRequestDTO,
  IShowTransactionFeeResponseDTO,
} from '../../ShowTransactionFeeDTO';
import { IShowTransactionFeeProvider } from '../IShowTransactionFeeProvider';

const networks = {
  mainnet: process.env.BLOCKCYPHER_MAINNET_API,
  testnet: process.env.BLOCKCYPHER_TESTNET_API,
};

const network = axios.create({
  baseURL: networks[networkConfig.networkType],
});

export class BlockcypherShowTransactionFeeProvider
  implements IShowTransactionFeeProvider {
  public providerKey = 'blockcypher_transaction_fee_show';

  public async execute({
    addressFrom,
    addressTo,
    value,
  }: IShowTransactionFeeRequestDTO): Promise<IShowTransactionFeeResponseDTO> {
    try {
      const inputs = [{ addresses: [addressFrom] }];
      const outputs = [{ addresses: [addressTo], value }];

      const response = await network.post('/txs/new', {
        inputs,
        outputs,
      });

      const { tx } = response.data;

      return {
        transactionEstimatedFee: tx.fees,
      };
    } catch (error) {
      const { response } = error;
      throw new ApplicationError(
        response.data.errors[0].error,
        response.status,
      );
    }
  }
}
