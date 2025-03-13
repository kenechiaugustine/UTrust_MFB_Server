import Joi from 'joi';

export const depositFundsValidator = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    amount: Joi.number().required(),
  }),
};

export const withdrawFundsValidator = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    amount: Joi.number().required(),
  }),
};

export const verifyAccountValidator = {
  body: Joi.object().keys({
    accountNumber: Joi.number().required(),
  }),
};

export const transferFundsValidator = {
  body: Joi.object().keys({
    senderId: Joi.string().required(),
    receiverAccountNumber: Joi.number().required(),
    amount: Joi.number().required(),
  }),
};
