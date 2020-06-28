import { getCustomRepository } from 'typeorm';
import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}
/**
 * [X] Recebimento de informações
 * [X] Tratativa de erros/exceções
 * [X] Acesso ao repositório
 */

class CreateAppointmentService {
  public async execute({ provider, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);

    const findAppoiontmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppoiontmentInSameDate) {
      throw Error('This appointment is already booked.');
    }

    const appointment = appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
