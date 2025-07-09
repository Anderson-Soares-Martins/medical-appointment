import { formatAppointmentStatus, formatUserRole, getStatusColor } from '../format';

describe('format utilities', () => {
  test('formatAppointmentStatus returns label', () => {
    expect(formatAppointmentStatus('SCHEDULED')).toBe('Agendada');
  });

  test('formatUserRole returns label', () => {
    expect(formatUserRole('DOCTOR')).toBe('Médico');
  });

  test('getStatusColor returns default for unknown status', () => {
    expect(getStatusColor('UNKNOWN' as any)).toBe('bg-gray-100 text-gray-800');
  });
});
