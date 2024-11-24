import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    Input,
    Select,
    DialogFooter,
    Option,
} from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import usePost from "@/hooks/usePost";
import Swal from "sweetalert2";
import useSecurePost from "@/hooks/useSecurePost";

export function Usuario() {
    const [refresh, setRefresh] = useState(false);
    const { data: usuarios, loading, error } = useFetch(`http://localhost:8080/usuario/v1/api/listar?refresh=${refresh}`);
    const { data: doctores, loading: doctoresLoading, error: doctoresError } = useFetch('http://localhost:8080/doctor/v1/api');


    const { postData: putData, loading: putLoading, error: putError } = usePost('http://localhost:8080/doctor/v1/api', 'PUT');


    const [open, setOpen] = useState(false);
    const [newUsuario, setNewUsuario] = useState({ username: "", password: "", role: "", persona: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(null);

    const handleOpen = () => setOpen(!open);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUsuario({ ...newUsuario, [name]: value });
    };

    const handleSelectChange = (e) => {
        console.log(e);

        setNewUsuario({ ...newUsuario, persona: e });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        console.log(token);

        try {
            const response = await fetch('http://localhost:8080/usuario/v1/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Incluye el token en los encabezados
                },
                body: JSON.stringify(newUsuario)
            });

            try {
                if (response.status === 201) {
                    Swal.fire({
                        title: 'Usuario creado',
                        text: 'Usuario creado correctamente',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                    handleOpen();
                    setRefresh(!refresh);
                    setNewUsuario({ usernme: "", password: "" });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al crear el usuario',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                });
                console.error('Error creating user:', error);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
            console.error('Error creating user:', error);
        }
    };

    const handleEdit = (doctor) => {
        setIsEditing(true);
        setCurrentUsuario(doctor);
        setNewUsuario({
            nombre: doctor.persona.nombre,
            apellidos: doctor.persona.apellidos,
            dni: doctor.persona.dni,
            direccion: doctor.persona.direccion,
            telefono: doctor.persona.telefono,
            email: doctor.persona.email,
            especialidad: doctor.especialidad.id
        });
        setOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await putData(newUsuario, `http://localhost:8080/doctor/v1/api/${currentUsuario.id}`);
            if (response.status === 200) {
                Swal.fire({
                    title: 'Doctor actualizado',
                    text: 'Doctor actualizado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                handleOpen();
                setRefresh(!refresh);
                setNewUsuario({ usernme: "", password: "" });
                setIsEditing(false);
                setCurrentUsuario(null);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al actualizar el doctor',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
            console.error('Error updating data:', error);
        }
    };
    const handleDelete = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8080/doctor/v1/api/${id}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        Swal.fire(
                            'Eliminado!',
                            'El doctor ha sido eliminado.',
                            'success',
                            '1500'
                        );
                        setRefresh(!refresh);
                    } else {
                        Swal.fire(
                            'Error!',
                            'Hubo un problema al eliminar el doctor.',
                            'error'
                        );
                    }
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'Hubo un problema al eliminar el doctor.',
                        'error'
                    );
                    console.error('Error deleting data:', error);
                }
            }
        });
    };

    if (loading || loading) return <p>Loading...</p>;
    if (error || error) return <p>Error...</p>;
    if (doctoresLoading || doctoresError) return <p>Loading...</p>;

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        Lista de Usuarios
                    </Typography>
                    <Button onClick={handleOpen} className="bg-green-500">
                        Agregar
                    </Button>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Usuario", "Rol", "", ""].map((el, index) => (
                                    <th key={index} className="py-3 px-5 text-left bg-gray-100">
                                        <Typography variant="small" color="blue-gray" className="font-bold uppercase">
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(({ id, username, role }) => {
                                const className = `py-3 px-5 ${id === usuarios.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                                    }`;

                                return (
                                    <tr key={id}>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {username}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {role}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                as="a"
                                                href="#"
                                                className="text-xs font-semibold text-blue-gray-600"
                                            >
                                                <IconButton className="bg-red-400" onClick={() => handleDelete(id)}>
                                                    <TrashIcon className="h-5 w-5" />
                                                </IconButton>
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            }
                            )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>{isEditing ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</DialogHeader>
                <DialogBody>
                    <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
                        <div className="mb-4">
                            <Input
                                label="Usuario"
                                name="username"
                                value={newUsuario.usuario}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                label="Contraseña"
                                name="password"
                                value={newUsuario.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                label="Rol"
                                name="role"
                                value={newUsuario.role}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Select
                                label="Doctor"
                                name="persona"
                                value={newUsuario.persona}
                                onChange={handleSelectChange}
                                required
                            >
                                {doctores.map((doctor) => (
                                    <Option key={doctor.id} value={doctor.persona.id}>
                                        {doctor.persona.nombre} {doctor.persona.apellidos}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="text" color="red" onClick={handleOpen}>
                                Cancelar
                            </Button>
                            <Button type="submit" color="green">
                                Agregar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogBody>
            </Dialog>
        </div>
    );
}

export default Usuario;
