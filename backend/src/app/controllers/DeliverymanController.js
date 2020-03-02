import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const { id, name, email, avatar_id } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
      avatar_id,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      avatar_id: Yup.number().positive(),
      id: Yup.number().positive(),
    });

    if (!(await schema.isValid({ ...req.body, ...req.params }))) {
      return res.status(400).json({ error: 'Data validation fails' });
    }

    let deliveryman = await Deliveryman.findByPk(req.params.id);
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman does not exists' });
    }

    await deliveryman.update(req.body);

    deliveryman = await Deliveryman.findByPk(req.params.id);

    return res.json(deliveryman);
  }

  async index(req, res) {
    const deliverymans = await Deliveryman.findAll();

    return res.json(deliverymans);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().positive(),
    });

    if (!(await schema.isValid({ ...req.params }))) {
      return res.status(400).json({ error: 'Data validation fails' });
    }

    const deliveryman = await Deliveryman.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman does not exists' });
    }
    return res.json({ ok: 'Deliveryman deleted' });
  }
}

export default new DeliverymanController();
