//import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  //private transactionsRepository: TransactionsRepository;

  // constructor(transactionsRepository: TransactionsRepository){
  //   this.transactionsRepository = transactionsRepository;
  // }

  public async execute({
    title,
    value,
    type,
    category,
    }: Request): Promise<Transaction> {

    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    // Verificar se a categoria existe
    // Se existir, buscar do banco de dados e usar o Id
    // Se não existir, cadastrar no banco de dados.

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!transactionCategory){
        transactionCategory = categoryRepository.create({
          title: category,
        })
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionsRepository.save(transaction);

   // return { id, title, type, value } as Transaction;
   return transaction;
  }
}

export default CreateTransactionService;
