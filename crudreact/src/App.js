import { useState, useEffect } from 'react';
import './App.css';
import Axios from "axios";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const noti = withReactContent(Swal)

function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState();
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState();
  const [id, setId] = useState();

  const [editar, setEditar] = useState(false);
  const [empleadosList, setEmpleados] = useState([]);

  const add = () => {
    Axios.post('http://localhost:3001/create',{
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    }).then(() => {
      getEmpleados();
      cancel();
      noti.fire({
        title: <strong>Empleado registrado con éxito!</strong>,
        html: <i>El empleado {nombre} fue registrado correctamente</i>,
        icon: 'success',
        timer: 3000
      })
    });
  }

  const update = () => {
    Axios.put('http://localhost:3001/update',{
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    }).then(() => {
      getEmpleados();
      cancel();
      noti.fire({
        title: <strong>Empleado editado con éxito!</strong>,
        html: <i>El empleado {nombre} fue editado correctamente</i>,
        icon: 'success',
        timer: 3000
      })
    }).catch(function (error) {
      noti.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salio mal al actualizar!",
        footer: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente más tarde":JSON.parse(JSON.stringify(error)).message
      });
    });
  }
 
  const deleteEmpleados = (val) => {
    noti.fire({
      title: "¿Confirma eliminado del empleado?",
      html: <i>De verdad quiere eliminar al empleado {nombre}</i>,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, quiero eliminarlo"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`).then(() => {
          getEmpleados();
          cancel();
        });
        Swal.fire({
          title: "Eliminado",
          text: val.nombre + ' ha sido eliminado',
          icon: "success",
          timer: 3000
        });
      }
    }).catch(function (error) {
      noti.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salio mal al eliminar!",
        footer: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente más tarde":JSON.parse(JSON.stringify(error)).message
      });
    });
  }

  const cancel = () => {
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setAnios("");
    setId();

    setEditar(false);
  }

  const getEmpleados = () => {
    Axios.get('http://localhost:3001/empleados').then((response) => {
      setEmpleados(response.data);
    });
  }

  useEffect(getEmpleados);

  const editarEmpleados = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAnios(val.anios);
    setId(val.id);
  }


  return (
    <div className="container">
      <div className="datos">
        <div className="card text-center mt-5">
          <div className="card-header">
            GESTIÓN DE EMPLEADOS
          </div>
          <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre: </span>
            <input type="text"
            onChange={(event) => {
              setNombre(event.target.value);
            }}
            className="form-control" value={nombre} placeholder="Ingrese un nombre" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Edad: </span>
            <input type="number"
            onChange={(event) => {
              setEdad(event.target.value);
            }}
            className="form-control" value={edad} placeholder="Ingrese una edad" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">País: </span>
            <input type="text"
            onChange={(event) => {
              setPais(event.target.value);
            }}
            className="form-control" value={pais} placeholder="Ingrese un país" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Cargo: </span>
            <input type="text"
            onChange={(event) => {
              setCargo(event.target.value);
            }}
            className="form-control" value={cargo} placeholder="Ingrese un cargo" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Años: </span>
            <input type="number"
            onChange={(event) => {
              setAnios(event.target.value);
            }}
            className="form-control" value={anios} placeholder="Ingrese los años" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>
          </div>
          <div className="card-header">
            {
              editar?
              <div>
                <button className='btn btn-warning ml-2' onClick={update}>Actualizar</button>
                <button className='btn btn-info' onClick={cancel}>Cancelar</button>
              </div>
              :
              <button className='btn btn-success' onClick={add}>Registrar</button>
            }
          </div>
        </div>
      </div>      
      <table className="table table-striped mt-5">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">País</th>
            <th scope="col">Cargo</th>
            <th scope="col">Experiencia</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
        {
                    empleadosList.map((val, key)=> {
                      return <tr key={val.id}>
                      <th scope="row">{val.id}</th>
                      <td>{val.nombre}</td>
                      <td>{val.edad}</td>
                      <td>{val.pais}</td>
                      <td>{val.cargo}</td>
                      <td>{val.anios}</td>
                      <td>
                        <div className='btn-group' role='group' aria-label='Basic Example'>
                          <button type='button' className='btn btn-success' 
                          onClick={() => {
                            editarEmpleados(val);
                          }}
                          >Editar</button>
                          <button type='button' className='btn btn-danger' 
                          onClick={() => {
                            deleteEmpleados(val);
                          }}
                          >Eliminar</button>
                        </div>
                      </td>
                    </tr>
                    })
              }
        </tbody>
      </table>
    </div> 
  );

}



export default App;
