import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./showTask.css";
import { Link } from "react-router-dom";

const ShowTask = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const respuesta = await fetch("http://localhost:5224/api/Tarea/Lista");
      const datosJson = await respuesta.json();
      setDatos(datosJson);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleEliminar = async (idTarea) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const respuesta = await fetch(
          `http://localhost:5224/api/Tarea/Eliminar/${idTarea}`,
          {
            method: "DELETE",
          }
        );

        if (respuesta.ok) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Tarea eliminada",
            showConfirmButton: false,
            timer: 1500,
          });
          obtenerDatos();
        } else {
          console.error("Error al eliminar la tarea:", respuesta.statusText);
        }
      } catch (error) {
        console.error("Error en la solicitud DELETE:", error);
      }
    }
  };

  const handleRealizarTarea = async (idTarea, taskComplete) => {
    // Texto específico basado en el estado de la tarea
    const confirmText = taskComplete === 1
      ? `¿Marcar la tarea  como incompleta?`
      : `¿Marcar la tarea  como completa?`;
  
    const confirmacion = await Swal.fire({
      text: confirmText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    });
  
    if (confirmacion.isConfirmed) {
      try {
        const nuevaTaskComplete = taskComplete === 1 ? 0 : 1;
  
        const respuesta = await fetch(
          `http://localhost:5224/api/Tarea/Realizar/${idTarea}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              taskComplete: nuevaTaskComplete,
            }),
          }
        );
  
        if (respuesta.ok) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Estado de tarea actualizado con éxito",
            showConfirmButton: false,
            timer: 1500,
          });
          obtenerDatos();
        } else {
          console.error(
            "Error al actualizar el estado de la tarea:",
            respuesta.statusText
          );
        }
      } catch (error) {
        console.error("Error en la solicitud PUT:", error);
      }
    }
  };
  
  

  return (
    <div>
      <h1>Lista de Tareas</h1>
      <div className="butonAddContainer">
        <Link className="addButon" to="/agregar">Agregar Tarea</Link>
      </div>
        <div className="taskTableContainer">
        <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Prioridad</th>
            <th>Completa</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((tarea) => (
            <tr key={tarea.idTarea}>
              <td>{tarea.nombre}</td>
              <td>{tarea.descripcion}</td>
              <td>{tarea.prioridad}</td>
              <td>{tarea.taskComplete === 1 ? "Sí" : "No"}</td>
              <td>
                <button
                  className={`btn ${
                    tarea.taskComplete === 1 ? "btn-danger" : "btn-success"
                  } me-3`}
                  onClick={() =>
                    handleRealizarTarea(tarea.idTarea, tarea.taskComplete)
                  }
                >
                  {tarea.taskComplete === 1 ? (
                    <i className="fa-solid fa-times"></i>
                  ) : (
                    <i className="fa-solid fa-check"></i>
                  )}
                </button>
              </td>

              <td>
                <Link key={tarea.idTarea} to={`/editar/${tarea.idTarea}`}>
                  <button className="btn btn-info me-3">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                </Link>

                <button
                  className="btn btn-danger"
                  onClick={() => handleEliminar(tarea.idTarea)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>

    </div>
  );
};

export default ShowTask;
