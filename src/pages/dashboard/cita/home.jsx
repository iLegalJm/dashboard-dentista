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

export function Cita() {
    const [refresh, setRefresh] = useState(false);
    const { data: citas, loading, error } = useFetch(`http://localhost:8080/cita/v1/api?refresh=${refresh}`);
    const { postData, loading: postLoading, error: postError } = usePost('http://localhost:8080/cita/v1/api');
    const { postData: putData, loading: putLoading, error: putError } = usePost('http://localhost:8080/cita/v1/api', 'PUT');
    const { data: especialidades, loading: especialidadesLoading, error: especialidadesError } = useFetch('http://localhost:8080/especialidad/v1/api');

    const [open, setOpen] = useState(false);
    const [newCita, setNewCita] = useState({ nombre: '', apellidos: '', dni: '', direccion: '', telefono: '', email: '', especialidad: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentCita, setCurrentCita] = useState(null);

    const handleOpen = () => setOpen(!open);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCita({ ...newCita, [name]: value });
    };

    const handleSelectChange = (e) => {
        setNewCita({ ...newCita, especialidad: e });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const response = await postData(newCita);
            if (response.status === 200) {
                Swal.fire({
                    title: 'Cita creado',
                    text: 'Cita creado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                handleOpen();
                setNewCita({ nombre: '', apellidos: '', dni: '', direccion: '', telefono: '', email: '', especialidad: '' });
                setRefresh(!refresh);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al crear el Cita',
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
            console.error('Error posting data:', error);
        }
    };

    const handleEdit = (Cita) => {
        setIsEditing(true);
        setCurrentCita(Cita);
        setNewCita({
            nombre: Cita.persona.nombre,
            apellidos: Cita.persona.apellidos,
            dni: Cita.persona.dni,
            direccion: Cita.persona.direccion,
            telefono: Cita.persona.telefono,
            email: Cita.persona.email,
            especialidad: Cita.especialidad.id
        });
        setOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await putData(newCita, `http://localhost:8080/Cita/v1/api/${currentCita.id}`);
            if (response.status === 200) {
                Swal.fire({
                    title: 'Cita actualizado',
                    text: 'Cita actualizado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                handleOpen();
                setRefresh(!refresh);
                setNewCita({ nombre: '', apellidos: '', dni: '', direccion: '', telefono: '', email: '', especialidad: '' });
                setIsEditing(false);
                setCurrentCita(null);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al actualizar el Cita',
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
                    const response = await fetch(`http://localhost:8080/cita/v1/api/${id}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        Swal.fire(
                            'Eliminado!',
                            'El Cita ha sido eliminado.',
                            'success',
                            '1500'
                        );
                        setRefresh(!refresh);
                    } else {
                        Swal.fire(
                            'Error!',
                            'Hubo un problema al eliminar el Cita.',
                            'error'
                        );
                    }
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'Hubo un problema al eliminar el Cita.',
                        'error'
                    );
                    console.error('Error deleting data:', error);
                }
            }
        });
    };

    if (loading || loading) return <p>Loading...</p>;
    if (error || error) return <p>Error...</p>;

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        Lista de Citas
                    </Typography>
                    {/* <Button onClick={handleOpen} className="bg-green-500">
                        Agregar
                    </Button> */}
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Paciente", "Doctor", "Serie", "Numero", "Fecha", "Motivo", "Estado","", ""].map((el, index) => (
                                    <th key={index} className="py-3 px-5 text-left bg-gray-100">
                                        <Typography variant="small" color="blue-gray" className="font-bold uppercase">
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {citas.map(({ id, paciente, doctor, serie, numero, motivo, fecha, flag_estado }) => {
                                const className = `py-3 px-5 ${id === citas.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                                    }`;

                                return (
                                    <tr key={id}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        {paciente.persona.nombre + " " + paciente.persona.apellidos}
                                                    </Typography>
                                                    {/* <Typography className="text-xs font-normal text-blue-gray-500">
                                                        {persona.email}
                                                    </Typography> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {doctor.persona.nombre + " " + doctor.persona.apellidos}
                                            </Typography>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {doctor.especialidad.nombre}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {serie}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {numero}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {/* formatea fecha y hora */}
                                                {new Date(fecha).toLocaleString()}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {motivo}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Chip
                                                variant="gradient"
                                                color={flag_estado == 1 ? "green" : "blue-gray"}
                                                value={flag_estado == 1 ? "Activo" : "Inactivo"}
                                                className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                            />
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                as="a"
                                                href="#"
                                                className="text-xs font-semibold text-blue-gray-600"
                                            >
                                                <IconButton onClick={() => handleEdit({ id, paciente, doctor, flag_estado })}>
                                                    <PencilIcon className="h-5 w-5" />
                                                </IconButton>
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
                <DialogHeader>{isEditing ? 'Editar Cita' : 'Agregar Nuevo Cita'}</DialogHeader>
                <DialogBody>
                    <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
                        <div className="mb-4">
                            <Input
                                label="Nombre"
                                name="nombre"
                                value={newCita.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                label="Apellidos"
                                name="apellidos"
                                value={newCita.apellidos}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                label="DNI"
                                name="dni"
                                value={newCita.dni}
                                onChange={handleChange}
                                maxLength={8}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                label="Dirección"
                                name="direccion"
                                value={newCita.direccion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                label="Teléfono"
                                name="telefono"
                                value={newCita.telefono}
                                onChange={handleChange}
                                required
                                maxLength={9}
                                minLength={9}
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                label="Email"
                                name="email"
                                value={newCita.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                        </div>
                        <DialogFooter>
                            <Button variant="text" color="red" onClick={handleOpen}>
                                Cancelar
                            </Button>
                            <Button type="submit" color="green" disabled={postLoading || putLoading}>
                                {postLoading || putLoading ? (isEditing ? 'Actualizando...' : 'Agregando...') : (isEditing ? 'Actualizar' : 'Agregar')}
                            </Button>
                        </DialogFooter>
                    </form>
                    {postError && <p className="text-red-500">{postError}</p>}
                </DialogBody>
            </Dialog>

            {/* <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Projects Table
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["companies", "members", "budget", "completion", ""].map(
                                    (el) => (
                                        <th
                                            key={el}
                                            className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                        >
                                            <Typography
                                                variant="small"
                                                className="text-[11px] font-bold uppercase text-blue-gray-400"
                                            >
                                                {el}
                                            </Typography>
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {projectsTableData.map(
                                ({ img, name, members, budget, completion }, key) => {
                                    const className = `py-3 px-5 ${key === projectsTableData.length - 1
                                        ? ""
                                        : "border-b border-blue-gray-50"
                                        }`;

                                    return (
                                        <tr key={name}>
                                            <td className={className}>
                                                <div className="flex items-center gap-4">
                                                    <Avatar src={img} alt={name} size="sm" />
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-bold"
                                                    >
                                                        {name}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={className}>
                                                {members.map(({ img, name }, key) => (
                                                    <Tooltip key={name} content={name}>
                                                        <Avatar
                                                            src={img}
                                                            alt={name}
                                                            size="xs"
                                                            variant="circular"
                                                            className={`cursor-pointer border-2 border-white ${key === 0 ? "" : "-ml-2.5"
                                                                }`}
                                                        />
                                                    </Tooltip>
                                                ))}
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    variant="small"
                                                    className="text-xs font-medium text-blue-gray-600"
                                                >
                                                    {budget}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <div className="w-10/12">
                                                    <Typography
                                                        variant="small"
                                                        className="mb-1 block text-xs font-medium text-blue-gray-600"
                                                    >
                                                        {completion}%
                                                    </Typography>
                                                    <Progress
                                                        value={completion}
                                                        variant="gradient"
                                                        color={completion === 100 ? "green" : "gray"}
                                                        className="h-1"
                                                    />
                                                </div>
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    as="a"
                                                    href="#"
                                                    className="text-xs font-semibold text-blue-gray-600"
                                                >
                                                    <EllipsisVerticalIcon
                                                        strokeWidth={2}
                                                        className="h-5 w-5 text-inherit"
                                                    />
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </CardBody>
            </Card> */}
        </div>
    );
}

export default Cita;
