import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { appointmentsService } from '../appointments.service';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

describe('appointmentsService', () => {
  test('createAppointment posts data', async () => {
    const appointment = { id: '1', doctorId: 'd1', patientId: 'p1', date: '2024-01-01', status: 'SCHEDULED' };
    mock.onPost('/appointments').reply(200, appointment);
    const result = await appointmentsService.createAppointment({ doctorId: 'd1', date: '2024-01-01', time: '10:00' });
    expect(result.id).toBe('1');
  });
});
