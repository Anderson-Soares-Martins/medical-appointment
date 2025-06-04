import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
})

async function seed() {
    try {
        // Registrar um médico
        const doctorResponse = await api.post('/auth/register', {
            email: 'doctor@example.com',
            password: 'password123',
            name: 'Dr. João Silva',
            role: 'DOCTOR',
            specialty: 'Cardiologia',
        })
        console.log('Médico criado:', doctorResponse.data)

        // Registrar um paciente
        const patientResponse = await api.post('/auth/register', {
            email: 'patient@example.com',
            password: 'password123',
            name: 'Maria Santos',
            role: 'PATIENT',
        })
        console.log('Paciente criado:', patientResponse.data)

        console.log('\nUsuários de teste criados com sucesso!')
        console.log('\nCredenciais do médico:')
        console.log('Email: doctor@example.com')
        console.log('Senha: password123')
        console.log('\nCredenciais do paciente:')
        console.log('Email: patient@example.com')
        console.log('Senha: password123')
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(
                'Erro ao criar usuários:',
                error.response?.data || error.message
            )
        } else {
            console.error('Erro ao criar usuários:', error)
        }
    }
}

seed()
