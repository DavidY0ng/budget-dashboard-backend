import express from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const allexpenseInput = await prisma.expenseInput.findMany();
  res.json(allexpenseInput);
});

router.post('/', async (req, res) => {
  const data = req.body;
  const dateString = data.date
  data.date= new Date(dateString);

  // const validationErrors = validateUser(data);

  // if (Object.keys(validationErrors).length !== 0)
  //   return res.status(400).send({
  //     error: validationErrors,
  //   });

    try {
      const expenseInput = await prisma.expenseInput.create({
        data,
      });
  
      return res.json(expenseInput);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        const formattedError = {};
        formattedError[`${err.meta.target[0]}`] = 'already taken';
  
        return res.status(500).send({
          error: formattedError,
        });
      }
      throw err;
    }
  });

router.delete('/', async (req, res) => {
  const allexpenseInput = await prisma.expenseInput.deleteMany();
  res.json(allexpenseInput);
});

router.patch('/:id', async (req, res) => {
  const id = req.body.id;
  const data = req.body;

  try {
    const expenseInput = await prisma.expenseInput.update({
      where: { id: parseInt(id) },
      data,
    });

    return res.json(expenseInput);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return res.status(404).send({
        error: 'Expense input not found',
      });
    }
    throw err;
  }
});


export default router;
