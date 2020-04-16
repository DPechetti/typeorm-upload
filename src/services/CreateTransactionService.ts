import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Invalid type.');
    }

    if (value <= 0) {
      throw new AppError('The value must be greater than 0.');
    }

    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();

      if (balance.total - value < 0) {
        throw new AppError('Output should be less than the balance.');
      }
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
    });

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (categoryExists) {
      transaction.category_id = categoryExists.id;
      transaction.category = categoryExists;
    } else {
      const newCategory = categoryRepository.create({ title: category });

      await categoryRepository.save(newCategory);

      transaction.category_id = newCategory.id;
      transaction.category = newCategory;
    }

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
