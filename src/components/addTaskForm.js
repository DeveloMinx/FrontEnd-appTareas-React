import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddTaskForm = () => {
  const [nuevaTarea, setNuevaTarea] = useState({
    nombre: "",
    descripcion: "",
    prioridad: "",
    taskComplete: 0,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaTarea((prevTarea) => ({
      ...prevTarea,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validar que los campos estén llenos
    if (!nuevaTarea.nombre || !nuevaTarea.descripcion || !nuevaTarea.prioridad) {
      Swal.fire({
        icon: "error",
        text: "Por favor, completa todos los campos.",
      });
      return;
    }
  
    try {
      const respuesta = await fetch('http://localhost:5224/api/Tarea/Agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaTarea),
      });
  
      if (respuesta.ok) {
        console.log('Tarea agregada con éxito');
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tarea agregada con éxito",
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/');
      } else {
        console.error('Error al agregar la tarea:', respuesta.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
    }
  };
  

  return (
    <div className="container mt-4">
      <div className="card mx-auto" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h2 className="card-title">Agregar Nueva Tarea</h2>
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
                value={nuevaTarea.nombre}
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
                value={nuevaTarea.descripcion}
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
                value={nuevaTarea.prioridad}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Selecciona
                </option>
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Agregar Tarea
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskForm;
