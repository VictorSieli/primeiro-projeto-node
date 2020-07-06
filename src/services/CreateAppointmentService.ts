import { getCustomRepository } from 'typeorm';
import { startOfHour } from 'date-fns';
import AppError from '../errors/appError';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date;
}
/**
 * [X] Recebimento de informações
 * [X] Tratativa de erros/exceções
 * [X] Acesso ao repositório
 */

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);

    const findAppoiontmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppoiontmentInSameDate) {
      throw new AppError('This appointment is already booked.');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
