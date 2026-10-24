import { api } from './api'
import type {
    ActualizarPaciente,
    CrearPaciente,
    Paciente,
} from '../types/paciente'

export async function obtenerMiPerfil(): Promise<Paciente> {
    const respuesta = await api.get<Paciente>('/pacientes/me')

    return respuesta.data
}

export async function modificarMiPerfil(
    datos: ActualizarPaciente,
): Promise<Paciente> {
    const respuesta = await api.put<Paciente>('/pacientes/me', datos)

    return respuesta.data
}

export async function registrarPaciente(
    datos: CrearPaciente,
): Promise<Paciente> {
    const respuesta = await api.post<Paciente>('/pacientes', datos)

    return respuesta.data
}

export async function listarPacientes(): Promise<Paciente[]> {
    const respuesta = await api.get<Paciente[]>('/pacientes')
    return respuesta.data
}

export async function obtenerPacientePorId(id: number): Promise<Paciente> {
    const respuesta = await api.get<Paciente>(`/pacientes/${id}`)
    return respuesta.data
}

export async function modificarPaciente(
    id: number,
    datos: ActualizarPaciente,
): Promise<Paciente> {
    const respuesta = await api.put<Paciente>(`/pacientes/${id}`, datos)
    return respuesta.data
}

export async function eliminarPaciente(id: number): Promise<void> {
    await api.delete(`/pacientes/${id}`)
}
