import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomesList = await this.find({ where: { type: 'income' } });
    const outcomesList = await this.find({ where: { type: 'outcome' } });

    const income = incomesList.reduce(
      (total, transaction) => total + transaction.value,
      0,
    );

    const outcome = outcomesList.reduce(
      (total, transaction) => total + transaction.value,
      0,
    );

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
