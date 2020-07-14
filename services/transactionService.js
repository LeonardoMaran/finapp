const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const TransactionModel = require('../models/TransactionModel');

const getPeriodTransactions = async (req, res) => {
  const period = req.query.period;

  if (!period) {
    return res.status(404).send({
      error:
        'É necessário informar o parâmetro "period", cujo valor deve estar no formato yyyy-mm',
    });
  }

  try {
    const query = { yearMonth: period };
    const transctions = await TransactionModel.find(query);

    res.status(200).send({ length: transctions.length, transctions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  const {
    description,
    value,
    category,
    year,
    month,
    day,
    yearMonth,
    yearMonthDay,
    type,
  } = req.body;
  const newTransaction = new TransactionModel({
    description,
    value,
    category,
    year,
    month,
    day,
    yearMonth,
    yearMonthDay,
    type,
  });
  try {
    const transction = await newTransaction.save(newTransaction);
    res.status(201).json(transction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  const _id = req.query._id;

  if (!_id) {
    return res.status(400).send({
      error: 'É necessário informar o parâmetro "id"',
    });
  }

  const updateData = req.body;
  if (Object.entries(updateData).length === 0) {
    return res.status(400).json({
      message: 'Dados para atualização vazio',
    });
  }

  try {
    const query = { _id };
    await TransactionModel.updateOne(query, updateData);

    res.status(200).json({ message: 'Dados atualizados!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  const _id = req.query._id;

  if (!_id) {
    return res.status(400).send({
      error: 'É necessário informar o parâmetro "id"',
    });
  }

  try {
    await TransactionModel.deleteOne({ _id });

    res.status(200).json({ message: 'Dados deletado!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPeriodTransactions, create, update, remove };
