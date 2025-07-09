import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { usersService } from '../users.service';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

describe('usersService', () => {
  test('getDoctors returns doctors list', async () => {
    mock.onGet('/users/doctors').reply(200, { doctors: [{ id: '1', name: 'John', email: 'j@e.com', specialty: 'Cardio' }], count: 1 });
    const result = await usersService.getDoctors();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('John');
  });

  test('getDoctor returns doctor details', async () => {
    mock.onGet('/users/doctors/1').reply(200, { id: '1', name: 'John', email: 'j@e.com', specialty: 'Cardio' });
    const doctor = await usersService.getDoctor('1');
    expect(doctor.id).toBe('1');
  });
});
