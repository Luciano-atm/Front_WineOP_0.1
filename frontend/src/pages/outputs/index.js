import React, {useState, useEffect, useMemo} from 'react'
import axios from 'axios';
import './style.css'
import vct from '../../images/vct.png'
import Skeleton from 'react-loading-skeleton';
import {Link} from 'react-router-dom';
import FileDownload from "js-file-download";
import { useParams } from 'react-router-dom';

export const Outputs = () => {
    const {semana}= useParams();
    const [scheduler,setScheduler] = useState([]);
    const [loading, setLoading] = useState(true);
    

    const loader = () =>{
        return(
            <div className='background-output'>
            <div className='box-container'>
                <div className='box-top'>
                <h1 className='top-text'>La planificación para la semana {semana} es la siguiente:</h1>
                <div className='table-out'>
                    <table>
                        <thead>
                        <tr>
                            <th>Tarea</th>
                            <th>Grupo</th>
                            <th>Maquina</th>
                            <th>Dia</th>
                            <th>Horario</th>
                            <th>Carga [ton]</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Cargando...</td>
                                <td>Cargando...</td>
                                <td>Cargando...</td>
                                <td>Cargando...</td>
                                <td>Cargando...</td>
                                <td>Cargando...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='container-restart'>
                        <button className='button-link' onClick={handleReinicio}>
                            <Link to='/' className='button-restart'>
                                REINICIAR OPTIMIZACIÓN
                            </Link>
                        </button>
                        <button className='button-link' onClick={(e) =>download(e)}>
                            DESCARGAR PDF
                        </button>
                    </div> 
            </div>

            </div>
            <div className='logo'>
                <img src={vct} className='vct-logo-out'/>
            </div>
            
            
            
        </div>
    )
    }

    useEffect(() => {
        const semana_parsed=parseInt(semana)
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/optimizar`,{params:{semana:semana_parsed}}).then((response) => {
            if(response.status === 200){
                setScheduler(response.data);
                setLoading(false);
            }
        }).catch(() => setScheduler([]))
        
        
    }, [])

    // useEffect(() => {
    //     axios.get(`${process.env.REACT_APP_BACKEND_URL}/getSemana`).then((response) => {
    //         if(response.status === 200) setSemana(response.data);
    //     }).catch(() => setScheduler(0))
        
        
    // }, [])

    const download = async (e)=>{
        e.preventDefault();
        axios({
          url:`${process.env.REACT_APP_BACKEND_URL}/getFile`,
          method:'GET',
          responseType:'blob',
        }).then((res) =>{
          console.log(res);
          FileDownload(res.data,'planificacion_semana_'+semana+".pdf")
        })
    }

    const handleReinicio = async (e) =>{
        e.preventDefault();
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/reinciarSimulacion`).catch((error) =>{
            if(error.response.status === 400) console.log(error.response.status);
        })
    }

    const horario = useMemo(() => {
        return scheduler.map((hora,i) => {
            return(
                <tr className='tabla-horario' key={i}>
                    <td>{hora.tarea}</td>
                    <td>{hora.grupo}</td>
                    <td>{hora.maquina}</td>
                    <td>{hora.dia}</td>
                    <td>{hora.horario}</td>
                    <td>{hora.carga}</td>
                </tr>
            )
        })
    },[scheduler])

    if(loading){
        return(
            loader()
        )
    }
    else{

        return (
            <div className='background-output'>
                <div className='box-container'>
                    <div className='box-top'>
                        <h1 className='top-text'>La planificación para la semana {semana} es la siguiente:</h1>
                        <div className='table-out'>
                            <table>
                                <thead>
                                <tr>
                                    <th>Tarea</th>
                                    <th>Grupo</th>
                                    <th>Maquina</th>
                                    <th>Dia</th>
                                    <th>Horario</th>
                                    <th>Carga [ton]</th>
                                </tr>
                                </thead>
                                <tbody>{horario}</tbody>
                            </table>
                        </div>
                        <div className='container-restart'>
                            <button className='button-link' onClick={handleReinicio}>
                                <Link to='/' className='button-restart'>
                                    REINICIAR OPTIMIZACIÓN
                                </Link>
                            </button>
                            <button className='button-link2' onClick={(e) =>download(e)}>
                                DESCARGAR PDF
                            </button>
                        </div>
                        </div>

                </div>
                <div className='logo'>
                    <img src={vct} className='vct-logo-out'/>
                </div>
                
                
            </div>
        )
    }
}
