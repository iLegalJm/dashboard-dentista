import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Dialog,
    DialogHeader,
    DialogBody,
    Input,
    DialogFooter,
    Button,
    Chip,
    IconButton,
} from "@material-tailwind/react";
import useFetch from "@/hooks/useFetch";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import usePost from "@/hooks/usePost";
import Swal from "sweetalert2";

export function Especialidad() {
    // ESTADO DE REFRESCO DE LA TABLA DE ESPECIALIDADES
    const [refresh, setRefresh] = useState(false);
    // DATOS DE LA TABLA ESPECIALIDADES
    const { data: especialidades, loading, error } = useFetch(`http://localhost:8080/especialidad/v1/api?refresh=${refresh}`);
    const { postData, loading: postLoading, error: postError } = usePost('http://localhost:8080/especialidad/v1/api');

    // 
    const { postData: putData, loading: putLoading, error: putError } = usePost('http://localhost:8080/especialidad/v1/api', 'PUT');

    // ESTADO DEL FORMULARIO DE CREACION DE ESPECIALIDAD
    const [open, setOpen] = useState(false);
    const [newEspecialidad, setNewEspecialidad] = useState({ nombre: '', descripcion: '' });

    // ESTADO DE EDICION DE ESPECIALIDAD
    const [isEditing, setIsEditing] = useState(false);
    const [currentEspecialidad, setCurrentEspecialidad] = useState(null);

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // FORMULARIO DE CREACION DE ESPECIALIDAD
    const handleOpen = () => setOpen(!open);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEspecialidad({ ...newEspecialidad, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await postData(newEspecialidad);
            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Especialidad agregada exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
                handleOpen();
                setNewEspecialidad({ nombre: '', descripcion: '' });
                setRefresh(!refresh); // Refresca la tabla de especialidades
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al agregar la especialidad',
                    text: response.data.message || 'Algo salió mal',
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

    const handleEdit = (especialidad) => {
        setIsEditing(true);
        setCurrentEspecialidad(especialidad);
        setNewEspecialidad({ nombre: especialidad.nombre, descripcion: especialidad.descripcion });
        setOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await putData(newEspecialidad, `http://localhost:8080/especialidad/v1/api/${currentEspecialidad.id}`);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Especialidad actualizada exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
                handleOpen();
                setNewEspecialidad({ nombre: '', descripcion: '' });
                setIsEditing(false);
                setCurrentEspecialidad(null);
                setRefresh(!refresh); // Refresca la tabla de especialidades
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar la especialidad',
                    text: response.data.message || 'Algo salió mal',
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
                    const response = await fetch(`http://localhost:8080/especialidad/v1/api/${id}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        Swal.fire(
                            'Eliminado!',
                            'La especialidad ha sido eliminada.',
                            'success',
                            '1500'
                        );
                        setRefresh(!refresh);
                    } else {
                        Swal.fire(
                            'Error!',
                            'Hubo un problema al eliminar la especialidad.',
                            'error'
                        );
                    }
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'Hubo un problema al eliminar la especialidad.',
                        'error'
                    );
                    console.error('Error deleting data:', error);
                }
            }
        });
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Lógica para la paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = especialidades.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(especialidades.length / itemsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };


    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        Lista de especialidades
                    </Typography>
                    <Button color="green" onClick={handleOpen}>
                        <PlusIcon className="h-6 w-6" />
                    </Button>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["id", "Nombre", "Descripcion", "Estado", "", ""].map((el) => (
                                    <th key={el} className="py-3 px-5 text-left">
                                        <Typography variant="small" color="blue-gray" className="font-bold uppercase">
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(({ id, nombre, descripcion, flag_estado }, key) => {
                                const className = `py-3 px-5 ${key === especialidades.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                                return (
                                    <tr key={id} className="hover:bg-gray-50">
                                        <td className={`${className} text-blue-gray-700 font-medium`}>{id}</td>
                                        <td className={`${className} text-blue-gray-700 font-medium`}>{nombre}</td>
                                        <td className={`${className} text-blue-gray-700 font-medium`}>{descripcion}</td>
                                        <td className={`${className} text-blue-gray-700 font-medium`}>
                                            <Chip
                                                variant="gradient"
                                                color={flag_estado == 1 ? "green" : "blue-gray"}
                                                value={flag_estado == 1 ? "Activo" : "Inactivo"}
                                                className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                            />
                                        </td>
                                        <td className={`${className} text-blue-gray-700 font-medium`}>
                                            <IconButton onClick={() => handleEdit({ id, nombre, descripcion, flag_estado })}>
                                                <PencilIcon className="h-5 w-5" />
                                            </IconButton>
                                        </td>
                                        <td className={`${className} text-blue-gray-700 font-medium`}>
                                            <IconButton className="bg-red-400" onClick={() => handleDelete(id)}>
                                                <TrashIcon className="h-5 w-5" />
                                            </IconButton>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="flex justify-center items-center mt-4">
                        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                        <Typography variant="small" color="blue-gray" className="font-bold mx-2">
                            Página {currentPage} de {totalPages}
                        </Typography>
                        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            <ArrowRightIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </CardBody>
            </Card>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>{isEditing ? 'Editar Especialidad' : 'Agregar Nueva Especialidad'}</DialogHeader>
                <DialogBody>
                    <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
                        <div className="mb-4">
                            <Input
                                label="Nombre"
                                name="nombre"
                                value={newEspecialidad.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                label="Descripción"
                                name="descripcion"
                                value={newEspecialidad.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="text" color="red" onClick={handleOpen}>
                                Cancelar
                            </Button>
                            <Button type="submit" color="green" disabled={postLoading}>
                                {postLoading ? (isEditing ? 'Actualizando...' : 'Agregando...') : (isEditing ? 'Actualizar' : 'Agregar')}
                            </Button>
                        </DialogFooter>
                    </form>
                    {postError && <p className="text-red-500">{postError}</p>}
                </DialogBody>
            </Dialog>
        </div>
    );
}

export default Especialidad;
