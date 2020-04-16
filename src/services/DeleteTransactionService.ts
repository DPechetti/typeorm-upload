import { getRepository } from 'typeorm';
import { isUuid } from 'uuidv4';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    if (!isUuid(id)) {
      throw new AppError('Transaction not found.');
    }

    const transaction = await transactionsRepository.findOne({ where: { id } });

    if (!transaction) {
      throw new AppError('Repository not found.');
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
