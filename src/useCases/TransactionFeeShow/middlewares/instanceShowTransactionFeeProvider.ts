import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import { createProviderUseCase } from '@useCases/ProviderCreate';
import { selectProviderUseCase } from '@useCases/ProviderSelect';

import { IShowTransactionFeeProvider } from '../providers/IShowTransactionFeeProvider';
import { BlockcypherShowTransactionFeeProvider } from '../providers/implementations/BlockcypherShowTransactionFeeProvider';

const blockcypherTransactionFeeShow = container.resolve(
  BlockcypherShowTransactionFeeProvider,
);

const providers = {
  [blockcypherTransactionFeeShow.providerKey]: blockcypherTransactionFeeShow,
};

export async function instanceShowTransactionFeeProvider(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  if (!container.isRegistered('ShowTransactionFeeProvider')) {
    const providerKeys = Object.keys(providers);

    await createProviderUseCase.execute(providerKeys);

    const providerKey = await selectProviderUseCase.execute(providerKeys);

    container.registerInstance<IShowTransactionFeeProvider>(
      'ShowTransactionFeeProvider',
      providers[providerKey],
    );
  }
  next();
}
