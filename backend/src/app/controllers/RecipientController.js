import * as Yup from 'yup';
import Recipient from '../models/Recipient';
import User from '../models/User';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.number()
        .integer()
        .required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    
    const userIsAdmin = await User.findOne({
      where: {
        id: req.userId,
        admin: true
      }
    })

    if (!userIsAdmin) {
      return res.status(401).json({ error: 'Only admins can create Recipients'});
    }

    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists' });
    }
    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string(),
      number: Yup.number().integer(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      cep: Yup.number().integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userIsAdmin = await User.findOne({
      where: {
        id: req.userId,
        admin: true
      }
    })

    if (!userIsAdmin) {
      return res.status(401).json({ error: 'Only admins can edit Recipients'});
    }

    const recipient = await Recipient.findByPk(req.params.id);

    await recipient.update(req.body);

    return res.json({ recipient });
  }
}

export default new RecipientController();
