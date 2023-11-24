import React, {useState, useEffect} from 'react'
import './style.css'
import axios from 'axios';
import { TimePicker } from '@material-ui/pickers';
import swal from 'sweetalert';
/*import Swal from 'sweetalert2';*/


export const Maintenance = ({ onClose }) => {
    const [machines,setMachines] = useState([]);
    const [tipo, setTipo] = useState("");
    const [idMachine, setIdMachine] = useState(0);
    const [diaSemana, setDiaSemana] = useState(0);
    const [semana, setSemana] = useState(0)
    const [horaInicio, setHoraInicio] = useState(new Date());
    const [horaFin, setHoraFin] = useState(new Date());


    const [mostrarFormulario, setMostrarFormulario] = useState(true);
    const [capacidadMinima, setCapacidadMinima]= useState();
    const [velocidadProcesado, setVelocidadProcesado]= useState();
    const [tipoMaquina, setTipoMaquina]= useState();
    const [cantidad, setCantidad]= useState();
    const [capacidadMaxima, setCapacidadMaxima]= useState();

    {/*useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/maquinas`).then((response) => {
            if(response.status === 200) setMachines(response.data);
        }).catch(() => setMachines([]))
        
    }, []) */}

    const handlerCargarId = function(e){
        const opcion = e.target.value;
        setIdMachine(machines[opcion].id_maquina);
        setTipo(machines[opcion].tipo)
    }

    const handleMantencion = async () => {
        // Validación de valores
        if (capacidadMinima === 0 || velocidadProcesado === 0 || cantidad === 0 || capacidadMaxima === 0 || tipoMaquina === 0 || tipoMaquina === 'Seleccione una opción') {
            swal({
                icon: 'error',
                title: 'Error',
                text: 'Existen valores que no han sido especificados. Por favor, ingrese valores válidos.'
            });
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/setAgregarMaquina`, {
                tipoMaquina: tipoMaquina,
                capacidadMaxima: capacidadMaxima,
                capacidadMinima: capacidadMinima,
                cantidad: cantidad,
                velocidadProcesado: velocidadProcesado
            });
    
            if (response.status === 200) {
                // Mostrar la respuesta del servidor
                console.log(response.data);
                
                swal({
                    title: "Máquina agregada correctamente",
                    icon: "success",
                    button: "Aceptar"
                }).then(() => {
                    setCapacidadMinima('');
                    setVelocidadProcesado('');
                    setTipoMaquina('Seleccione una opción');
                    setCantidad('');
                    setCapacidadMaxima('');
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                swal({
                    title: "No se pudo crear la mantención",
                    icon: "error",
                    button: "Aceptar"
                });
            }
        }
    };
    

    const handleEliminarFormulario = () => {
        // Oculta el formulario
        setMostrarFormulario(false);
    };

    const opcionesVelocidad = {
        'Despalillado': ['1 hrs', '2 hrs', '3 hrs', '4 hrs', '5 hrs','6 hrs','7 hrs','8 hrs','9 hrs','10 hrs'],
        'Prensado': ['1 hrs', '2 hrs', '3 hrs', '4 hrs', '5 hrs','6 hrs','7 hrs','8 hrs','9 hrs','10 hrs'],
        'Pre-flotación': ['1 hrs', '2 hrs', '3 hrs', '4 hrs', '5 hrs','6 hrs','7 hrs','8 hrs','9 hrs','10 hrs'],
        'Flotación': ['1 hrs', '2 hrs', '3 hrs', '4 hrs', '5 hrs','6 hrs','7 hrs','8 hrs','9 hrs','10 hrs'],
        'Fermentación': ['10 días','11 días', '12 días', '13 días', '14 días', '15 días','16 días','17 días','18 días','19 días','20 días']
    };
    const obtenerDigito = (opcion) => {
        return opcion.split(' ')[0]; // Obtiene la parte numérica antes del espacio
    };
    
    const handleClose = () => {
        onClose(); // Llama a la función onClose para cerrar la tabla de ingreso
    };

    


    return (
        <div>
            {mostrarFormulario && (
                <div className='main-container'>
                
                    <div className="container px-4 text-center">
                
                        <div className="row">
                            <div className="col-6">
                                <div className='contenedor'>
                                    <label htmlFor="Tipomaquina">  Tarea:</label>
                                    <select name='Tipomaquina' onChange={(event) => setTipoMaquina(event.target.value)} value={tipoMaquina}>
                                        <option value={'Seleccione una opción'}>Seleccione una opción</option>
                                        <option value={'Despalillado'}>Despalillado</option>
                                        <option value={'Prensado'}>Prensado</option>
                                        <option value={'Pre-flotación'}>Pre-flotación</option>
                                        <option value={'Flotación'}>Flotación</option>
                                        <option value={'Fermentación'}>Fermentación</option>
                                    </select>
                                </div>
        
                                <div className='contenedor'>
                                    <label htmlFor="Capmax">  Capacidad Mínima:</label>
                                    <input type='number' id='Capmax' min="1" max="100" onChange={(event) => setCapacidadMinima(event.target.value)} value={capacidadMinima}/>
                                </div>

                                <div className='contenedor'>
                                    <label htmlFor="Cantidad">  Cantidad:</label>
                                    <input type='number' id='Cantidad' min="1" max="100" onChange={(event) => setCantidad(event.target.value)} value={cantidad} />
                                </div>
                                
                            </div>
        
                            <div className="col-6">
                                <div className='contenedor'>
                                    <label htmlFor="Velocidad">  Demora promedio:</label>
                                    <select
                                        id='Velocidad'
                                        onChange={(event) => {
                                          const velocidad = obtenerDigito(event.target.value);
                                          setVelocidadProcesado(velocidad);
                                        }}
                                        value={velocidadProcesado}
                                        disabled={tipoMaquina === 'Seleccione una opción' || !opcionesVelocidad[tipoMaquina]}
                                      >
                                        <option value=''>Seleccione una velocidad</option>
                                        {tipoMaquina !== 'Seleccione una opción' && opcionesVelocidad[tipoMaquina] && (
                                          opcionesVelocidad[tipoMaquina].map((opcion, index) => (
                                            <option key={index} value={obtenerDigito(opcion)}>
                                              {opcion}
                                            </option>
                                          ))
                                        )}
                                    </select>
                                </div>
        
                                <div className='contenedor'>
                                    <label htmlFor="Capmax">  Capacidad Máxima:</label>
                                    <input type='number' id='CapacidadMaxima' min="1" max="100" onChange={(event) => setCapacidadMaxima(event.target.value)} value={capacidadMaxima}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <button className='button-maintenance' onClick={handleMantencion}>INGRESAR MAQUINA</button>
                                </div>    
                            
                                <div className="col-6">
                                    <button className='button-maintenance' onClick={handleClose}>ELIMINAR FORMULARIO</button>
                                </div>    
                            </div>
                        </div>
                    </div>
                </div>
            )} 
        </div>   
    );
    
}
