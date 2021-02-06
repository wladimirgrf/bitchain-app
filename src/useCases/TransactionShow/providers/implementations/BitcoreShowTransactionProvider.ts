import axios from 'axios';

import { ApplicationError } from '@errors/ApplicationError';
import networkConfig from '@config/network';

import { IShowTransactionDTO } from '../../ShowTransactionDTO';

const networks = {
  mainnet: process.env.BITCORE_MAINNET_API,
  testnet: process.env.BITCORE_TESTNET_API,
};

const network = axios.create({
  baseURL: networks[networkConfig.networkType],
});

interface Input {
  address: string;
  value: number;
}

interface Output {
  address: string;
  value: number;
}

export class BitcoreShowTransactionProvider {
  public async run(publicId: string): Promise<IShowTransactionDTO> {
    try {
      const responseTx = await network.get(`/tx/${publicId}`);

      const { txid, fee, confirmations } = responseTx.data;

      const responseCoins = await network.get(`/tx/${publicId}/coins`);

      const { inputs, outputs } = responseCoins.data;

      const walletsFrom = inputs.map((input: Input) => {
        return { publicAddress: input.address, value: input.value };
      });

      const walletsTo = outputs
        .filter((output: Output) => output.address !== 'false')
        .map((output: Output) => {
          return { publicAddress: output.address, value: output.value };
        });

      return {
        publicId: txid,
        fee,
        confirmations,
        walletsFrom,
        walletsTo,
      };
    } catch (error) {
      const { response } = error;
      throw new ApplicationError(response.data, response.status);
    }
  }
}