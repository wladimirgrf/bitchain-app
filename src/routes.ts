import { Router } from 'express';
import { container } from 'tsyringe';

import CreateWalletService from './services/CreateWalletService';
import ShowWalletBalanceService from './services/ShowWalletBalanceService';

import ShowTransactionService from './services/ShowTransactionService';

const routes = Router();

routes.get('/wallet/create', async (request, response) => {
  const createWalletService = container.resolve(CreateWalletService);

  const wallet = await createWalletService.execute();

  return response.json(wallet);
});

routes.get('/wallet/:publicAddress', async (request, response) => {
  const showWalletBalanceService = container.resolve(ShowWalletBalanceService);

  const { publicAddress } = request.params;

  const walletBalance = await showWalletBalanceService.execute(publicAddress);

  return response.json(walletBalance);
});

routes.get('/transaction/:publicId', async (request, response) => {
  const showTransactionService = container.resolve(ShowTransactionService);

  const { publicId } = request.params;

  const transaction = await showTransactionService.execute(publicId);

  return response.json(transaction);
});

export default routes;
