import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const EditTaskForm = () => {
  const [tarea, setTarea] = useState({
    idTarea: '',
    nombre: '',
    descripcion: '',
    prioridad: '',
    taskComplete: 0,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const obtenerTarea = async () => {
      try {
        const respuesta = await fetch(`http://localhost:5224/api/Tarea/ObtenerPorId/${id}`);
        const tareaJson = await respuesta.json();
        setTarea(tareaJson);
      } catch (error) {
        console.error('Error al obtener la tarea:', error);
      }
    };

    obtenerTarea();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTarea((prevTarea) => ({
      ...prevTarea,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validar que los campos no estén vacíos
    if (!tarea.nombre || !tarea.descripcion || !tarea.prioridad) {
        Swal.fire({
            icon: "error",
            text: "Por favor, completa todos los campos.",
          });
      return;
    }
  
    try {
      const respuesta = await fetch(`http://localhost:5224/api/Tarea/Actualizar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarea),
      });
  
      if (respuesta.ok) {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Tarea actualizada con éxito",
            showConfirmButton: false,
            timer: 1500
          });
        navigate('/');
      } else {
        console.error('Error al actualizar la tarea:', respuesta.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
    }
  };
  

  return (
    <div className="container mt-4">
      <div className="card mx-auto" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h2 className="card-title">Editar Tarea</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre:
              </label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                value={tarea.nombre}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción:
              </label>
              <textarea
                className="form-control"
                id="descripcion"
                name="descripcion"
                value={tarea.descripcion}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="prioridad" className="form-label">
                Prioridad:
              </label>
              <select
                className="form-select"
                id="prioridad"
                name="prioridad"
                value={tarea.prioridad}
                onChange={handleInputChange}
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Actualizar Tarea
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskForm;
