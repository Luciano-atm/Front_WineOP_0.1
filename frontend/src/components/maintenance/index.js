import React, {useState, useEffect} from 'react'
import './style.css'
import axios from 'axios';
import { TimePicker } from '@material-ui/pickers';
import swal from 'sweetalert';
/*import Swal from 'sweetalert2';*/


export const Maintenance = ({ onClose }) => {

    const [mostrarFormulario, setMostrarFormulario] = useState(true);
    const [tiempoProcesado, setTiempoProcesado]= useState(1);
    const [tarea, setTarea]= useState();
    const [capacidadMaxima, setCapacidadMaxima]= useState(0);
    const [maquinasHabilitadas, setMaquinasHabilitadas] = useState([]);
    const [maquinasDeshabilitadas, setMaquinasDeshabilitadas] = useState([]);
    const [tipoTareaSeleccionado, setTipoTareaSeleccionado] = useState('');
    const [maquinaSeleccionada, setMaquinaSeleccionada] = useState('');
    const [tareasDisponibles, setTareasDisponibles] = useState([]);
    const [listaSeleccionada, setListaSeleccionada] = useState('habilitadas');

    useEffect(() => {
        carga_datos()
        }, []);


    const carga_datos = () =>{
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/getListas_habilitar`)
            .then((response) => {
                if (response.status === 200) {
                    const { habilitado, deshabilitado } = response.data;
                    setMaquinasHabilitadas(habilitado);
                    setMaquinasDeshabilitadas(deshabilitado);
                    const tareasHabilitadas = [...new Set(habilitado.map(item => item[2]))];
                    const tareasDeshabilitadas = [...new Set(deshabilitado.map(item => item[2]))];
                    const tareas = [...new Set([...tareasHabilitadas, ...tareasDeshabilitadas])];

                    setTareasDisponibles(tareas);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }
    const handleListaChange = (e) => {
        setListaSeleccionada(e.target.value);
        setTipoTareaSeleccionado('');
        setMaquinaSeleccionada('');
    };

    const handleTipoTareaChange = (e) => {
        const selectedTask = e.target.value;
        setTipoTareaSeleccionado(selectedTask);
        setMaquinaSeleccionada('');
    };

    const handleMaquinaChange = (e) => {
        const selectedMachine = e.target.value;
        setMaquinaSeleccionada(selectedMachine);
    };

    

    const cambiarEstadoMaquinaBackend = async () => {
        let estadoSeleccionado= ''
        if (textoBoton === 'Habilitar') {
            estadoSeleccionado=('Habilitado');
        } else if (textoBoton === 'Deshabilitar') {
            estadoSeleccionado=('Deshabilitado');
        }


        if (maquinaSeleccionada === '') {
            swal({
                icon: 'error',
                title: 'Error',
                text: 'Existen valores que no han sido especificados. Por favor, ingrese valores válidos.'
            });
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/cambiar_estado_maquina`, {
                maquina: maquinaSeleccionada,
                estado: estadoSeleccionado
            });
    
            if (response.status === 200) {
                // Mostrar la respuesta del servidor
                console.log(response.data);
                carga_datos()
                swal({
                    title: "Estado de máquina cambiado correctamente",
                    icon: "success",
                    button: "Aceptar"
                }).then(() => {
                    setTipoTareaSeleccionado('');
                    setMaquinaSeleccionada('');
                    setListaSeleccionada('habilitadas');
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                swal({
                    title: "No se pudo cambiar el estado de la máquina",
                    icon: "error",
                    button: "Aceptar"
                });
            }
        }
    };
    
    const maquinasMostrar = listaSeleccionada === 'habilitadas' ? maquinasHabilitadas : maquinasDeshabilitadas;

    let textoBoton = '';
    if (listaSeleccionada === 'habilitadas') {
        textoBoton = 'Deshabilitar';
    } else if (listaSeleccionada === 'deshabilitadas') {
        textoBoton = 'Habilitar';
    }

    {/*const handlerCargarId = function(e){
        const opcion = e.target.value;
        setIdMachine(machines[opcion].id_maquina);
        setTipo(machines[opcion].tipo)
    }*/}

    const handleMantencion = async () => {
        // Validación de valores
        if (tiempoProcesado === 'Seleccione una velocidad' || capacidadMaxima === 0 ||  tarea === 'Seleccione una opción') {
            swal({
                icon: 'error',
                title: 'Error',
                text: 'Existen valores que no han sido especificados. Por favor, ingrese valores válidos.'
            });
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/setAgregarMaquina`, {
                tarea: tarea,
                capacidadMaxima: capacidadMaxima,
                tiempoProcesado: tiempoProcesado
                
            });
    
            if (response.status === 200) {
                // Mostrar la respuesta del servidor
                console.log(response.data);
                
                swal({
                    title: "Máquina agregada correctamente",
                    icon: "success",
                    button: "Aceptar"
                }).then(() => {
                    setTiempoProcesado('1');
                    setTarea('Seleccione una opción');
                    setCapacidadMaxima(0);
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
        'Despalillado': ['1 hrs', '2 hrs', '3 hrs', '4 hrs', '5 hrs','6 hrs','7 hrs','8 hrs','9 hrs','10 hrs','11 hrs','12 hrs'],
        'Prensado': ['1 hrs', '2 hrs', '3 hrs', '4 hrs', '5 hrs','6 hrs','7 hrs','8 hrs','9 hrs','10 hrs','11 hrs','12 hrs'],
        'Pre-flotación': ['1 hrs', '2 hrs', '3 hrs', '4 hrs', '5 hrs','6 hrs','7 hrs','8 hrs','9 hrs','10 hrs','11 hrs','12 hrs'],
        'Flotación': ['1 hrs', '2 hrs', '3 hrs', '4 hrs', '5 hrs','6 hrs','7 hrs','8 hrs','9 hrs','10 hrs','11 hrs','12 hrs']
    };

    const opcionescapacidadMaxima = {
        'Despalillado': ['10.000 Kilos', '20.000 Kilos', '30.000 Kilos', '40.000 Kilos', '50.000 Kilos','60.000 Kilos','70.000 Kilos','80.000 Kilos','90.000 Kilos','100.000 Kilos'],
        'Prensado': ['10.000 Kilos', '20.000 Kilos', '30.000 Kilos', '40.000 Kilos', '50.000 Kilos','60.000 Kilos','70.000 Kilos','80.000 Kilos','90.000 Kilos','100.000 Kilos'],
        'Pre-flotación': ['10.000 litos', '20.000 litos', '30.000 litos', '40.000 litos', '50.000 litos','60.000 litos','70.000 litos','80.000 litos','90.000 litos','100.000 litos'],
        'Flotación': ['10.000 litos', '20.000 litos', '30.000 litos', '40.000 litos', '50.000 litos','60.000 litos','70.000 litos','80.000 litos','90.000 litos','100.000 litos'],
        'Fermantación': ['10.000 litos', '20.000 litos', '30.000 litos', '40.000 litos', '50.000 litos','60.000 litos','70.000 litos','80.000 litos','90.000 litos','100.000 litos']

    };

    const obtenerDigito = (opcion, tarea) => {
        if (tarea === 'Despalillado' || tarea === 'Prensado'){
            const numeroPunto = opcion.split(' ')[0];
            return numeroPunto.split('.')[0];
        }
        else{
            const numeroPunto = opcion.split(' ')[0];
            return numeroPunto.split('.').join('');
        }
    };
    
    

    
    const handleClose = () => {
        onClose(); // Llama a la función onClose para cerrar la tabla de ingreso
    };

    


    return (
        <div>
            {mostrarFormulario && (
                <div className='main-container'>
                
                    <div className="container px-4 text-center">
                        <div className='tittle-container'>
                            <label htmlFor="title">Agregar nueva máquina:</label>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <div className='contenedor'>
                                    <label htmlFor="Tipomaquina">  Tarea:</label>
                                    <select name='Tipomaquina' onChange={(event) => setTarea(event.target.value)} value={tarea}>
                                        <option value={'Seleccione una opción'}>Seleccione una opción</option>
                                        <option value={'Despalillado'}>Despalillado</option>
                                        <option value={'Prensado'}>Prensado</option>
                                        <option value={'Pre-flotación'}>Pre-flotación</option>
                                        <option value={'Flotación'}>Flotación</option>
                                        <option value={'Fermentación'}>Fermentación</option>
                                    </select>
                                </div>

                                {tarea !== 'Fermentación' && ( // Mostrar el segundo contenedor solo si no es "Fermentación"
                                    <div className='contenedor'>
                                    <label htmlFor="Velocidad">  Tiempo de procesado:</label>
                                    <select
                                        id='Velocidad'
                                        onChange={(event) => {
                                        const velocidad = obtenerDigito(event.target.value, tarea);
                                        setTiempoProcesado(velocidad);
                                        }}
                                        value={tiempoProcesado}
                                        disabled={tarea === 'Seleccione una opción' || !opcionesVelocidad[tarea]}
                                    >
                                        <option value=''>Seleccione tiempo de procesado</option>
                                        {tarea !== 'Seleccione una opción' && opcionesVelocidad[tarea] && (
                                        opcionesVelocidad[tarea].map((opcion, index) => (
                                            <option key={index} value={obtenerDigito(opcion,tarea)}>
                                            {opcion}
                                            </option>
                                        ))
                                        )}
                                    </select>
                                    </div>
                                )}
   
                            </div>
        
                            <div className="col-6">
                                <div className='contenedor'>
                                    <label htmlFor="Capmax">Capacidad máxima:</label>
                                    <select
                                        id='Capmax'
                                        onChange={(event) => {
                                            const capacidadMaxima = obtenerDigito(event.target.value, tarea);
                                            setCapacidadMaxima(capacidadMaxima);
                                        }}
                                        value={capacidadMaxima}
                                        disabled={tarea === 'Seleccione una opción' || !opcionescapacidadMaxima[tarea]}
                                    >
                                        <option value=''>Seleccione capacidad máxima:</option>
                                        {tarea !== 'Seleccione una opción' && opcionescapacidadMaxima[tarea] && (
                                            opcionescapacidadMaxima[tarea].map((opcion, index) => {
                                                const capacidad = obtenerDigito(opcion, tarea);
                                                return (
                                                    <option key={index} value={capacidad}>
                                                        {opcion}
                                                    </option>
                                                );
                                            })
                                        )}
                                    </select>
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

                            <div>
                                <label htmlFor="title">Habilitar/Deshabilitar:</label>
                            </div>
                            <div className='row'>
                                <div className='maintenance'>
                                    <div className='contenedor'>
                                        <label htmlFor="lista">Selecciona la lista:</label>
                                        <select id="lista" onChange={handleListaChange} value={listaSeleccionada}>
                                            <option value="habilitadas">Máquinas Habilitadas</option>
                                            <option value="deshabilitadas">Máquinas Deshabilitadas</option>
                                        </select>
                                    </div>
                                    
                                </div>
                                {listaSeleccionada && (
                                    <div className='maintenance'>
                                        <div className='contenedor'>
                                        <label htmlFor="tipoTarea">Selecciona el tipo de tarea:</label>
                                        <select id="tipoTarea" onChange={handleTipoTareaChange} value={tipoTareaSeleccionado}>
                                            <option value="">Selecciona una tarea</option>
                                            {tareasDisponibles.map((tarea, index) => (
                                                <option key={index} value={tarea}>{tarea}</option>
                                            ))}
                                        </select>
                                        </div>
                                        {tipoTareaSeleccionado && (
                                            <div className='contenedor'>
                                                <label htmlFor="maquina">Selecciona la máquina:</label>
                                                <select id="maquina" onChange={handleMaquinaChange} value={maquinaSeleccionada}>
                                                    <option value="">Selecciona una máquina</option>
                                                    {maquinasMostrar
                                                        .filter(item => item[2] === tipoTareaSeleccionado)
                                                        .map((maquina, index) => (
                                                            <option key={index} value={maquina[0]}>{maquina[0]}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        )}

                                        

                                        
                                    </div>
                                )}
                                <div>
                                    <button className='button-maintenance' onClick={cambiarEstadoMaquinaBackend}>
                                    {textoBoton} máquina
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )} 
        </div>   
    );
    
}
