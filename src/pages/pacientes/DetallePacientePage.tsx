import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    eliminarPaciente,
    modificarPaciente,
    obtenerPacientePorId,
} from '../../services/pacienteService'
import type { Paciente } from '../../types/paciente'
import { obtenerMensajeError } from '../../utils/errores'

export function DetallePacientePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const pacienteId = Number(id)

    const [paciente, setPaciente] = useState<Paciente | null>(null)
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [eliminando, setEliminando] = useState(false)

    useEffect(() => {
        async function cargarPaciente() {
            try {
                const datos = await obtenerPacientePorId(pacienteId)
                setPaciente(datos)
            } catch (error) {
                setError(
                    obtenerMensajeError(
                        error,
                        'No se pudo cargar el paciente.',
                    ),
                )
            } finally {
                setCargando(false)
            }
        }

        cargarPaciente()
    }, [pacienteId])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!paciente) return

        setError('')
        setMensaje('')
        setGuardando(true)

        try {
            const actualizado = await modificarPaciente(paciente.id, {
                nombre: paciente.nombre,
                apellido: paciente.apellido,
                dni: paciente.dni,
                telefono: paciente.telefono,
                fechaNacimiento: paciente.fechaNacimiento,
                direccion: paciente.direccion,
            })

            setPaciente(actualizado)
            setMensaje('Paciente actualizado correctamente.')
        } catch (error) {
            setError(
                obtenerMensajeError(
                    error,
                    'No se pudo actualizar el paciente.',
                ),
            )
        } finally {
            setGuardando(false)
        }
    }

    async function handleEliminar() {
        if (!paciente) return

        const confirmado = window.confirm(
            '¿Seguro que querés eliminar este paciente? Esta acción no se puede deshacer.',
        )

        if (!confirmado) return

        setError('')
        setMensaje('')
        setEliminando(true)

        try {
            await eliminarPaciente(paciente.id)
            navigate('/pacientes')
        } catch (error) {
            setError(
                obtenerMensajeError(error, 'No se pudo eliminar el paciente.'),
            )
        } finally {
            setEliminando(false)
        }
    }

    if (cargando) {
        return <p>Cargando paciente...</p>
    }

    if (!paciente) {
        return (
            <main>
                <p className="mensaje-error">{error}</p>
                <p>
                    <Link to="/pacientes">Volver a pacientes</Link>
                </p>
            </main>
        )
    }

    return (
        <main>
            <h1>Paciente {paciente.id}</h1>

            <p>Email: {paciente.usuario?.email ?? '-'}</p>

            <form onSubmit={handleSubmit}>
                <label>
                    Nombre
                    <input
                        value={paciente.nombre}
                        onChange={(event) =>
                            setPaciente({
                                ...paciente,
                                nombre: event.target.value,
                            })
                        }
                        required
                        minLength={2}
                        maxLength={100}
                    />
                </label>

                <label>
                    Apellido
                    <input
                        value={paciente.apellido}
                        onChange={(event) =>
                            setPaciente({
                                ...paciente,
                                apellido: event.target.value,
                            })
                        }
                        required
                        minLength={2}
                        maxLength={100}
                    />
                </label>

                <label>
                    DNI
                    <input
                        value={paciente.dni}
                        onChange={(event) =>
                            setPaciente({
                                ...paciente,
                                dni: event.target.value,
                            })
                        }
                        inputMode="numeric"
                        pattern="[0-9]{7,8}"
                        maxLength={8}
                        required
                    />
                </label>

                <label>
                    Teléfono
                    <input
                        type="tel"
                        value={paciente.telefono}
                        onChange={(event) =>
                            setPaciente({
                                ...paciente,
                                telefono: event.target.value,
                            })
                        }
                        pattern="[+]?[0-9]{6,25}"
                        maxLength={26}
                        required
                    />
                </label>

                <label>
                    Fecha de nacimiento
                    <input
                        type="date"
                        value={paciente.fechaNacimiento}
                        onChange={(event) =>
                            setPaciente({
                                ...paciente,
                                fechaNacimiento: event.target.value,
                            })
                        }
                        max={new Date().toISOString().slice(0, 10)}
                        required
                    />
                </label>

                <label>
                    Dirección
                    <input
                        value={paciente.direccion}
                        onChange={(event) =>
                            setPaciente({
                                ...paciente,
                                direccion: event.target.value,
                            })
                        }
                        required
                        minLength={3}
                        maxLength={150}
                    />
                </label>

                {error && (
                    <p role="alert" className="mensaje-error">
                        {error}
                    </p>
                )}

                {mensaje && <p className="mensaje-exito">{mensaje}</p>}

                <button type="submit" disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </form>

            <div className="acciones">
                <button
                    type="button"
                    onClick={handleEliminar}
                    disabled={eliminando}
                >
                    {eliminando ? 'Eliminando...' : 'Eliminar paciente'}
                </button>
            </div>

            <p>
                <Link to="/pacientes">Volver a pacientes</Link>
            </p>
        </main>
    )
}
