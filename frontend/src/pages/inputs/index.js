import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { Maintenance } from '../../components/maintenance';
import './style.css'
import 'bootstrap/dist/css/bootstrap.css'
import swal from 'sweetalert';
import FileDownload from "js-file-download";



export const Inputs = () => {
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [semana, setSemana] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [archivo_pdf, setArchivoPfd]= useState(null);
  const [semanas, setSemanas] = useState([]);
  const navigate = useNavigate();
  const [mostrarPDF, setMostrarPDF] = useState(false);
  const [pdfURL, setPdfURL] = useState(null); // Debes establecer pdfURL a la URL correcta del PDF

  const handleAdd = () => {
    setShowMaintenance(true); // Muestra el componente cuando se presiona el botón
  };
  const handleClose = () => {
    setShowMaintenance(false); // Oculta la tabla de ingreso y reactiva el botón
  };



  const subirArchivo = e => {
    setArchivo(e);
  }

  const subirArchivoPdf = e => {
    setArchivoPfd (e);
  }

  const insertarArchivos = async () => {
    const f = new FormData();

    for (let index = 0; index < archivo.length; index++) {
      f.append("myfile", archivo[index]);
    }

    for (let index = 0; index < archivo_pdf.length; index++) {
      f.append("mypdf", archivo_pdf[index]);
    }

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/postFile`, f)
    .then(response => {
    swal({
      title: "Archivo subido correctamente",
      icon: "success",
      button: "Aceptar"
    });
    setSemanas(response.data.semanas);
  })
  .catch(error => {
    console.log(error);
    swal({
      title: "Error al subir el archivo",
      text: "Ha ocurrido un error al subir el archivo.",
      icon: "error",
      button: "Aceptar"
    });
  });
    
    
  }


  const download = async (url, filename) => {
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'blob',
      });
      console.log(response);
      FileDownload(response.data, filename);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  };

  const downloadInputFile = async () => {
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/getFileInput`,
        method: 'GET',
        responseType: 'blob',
      });
      console.log(response);
      FileDownload(response.data, 'Info de día.xlsx');
    } catch (error) {
      console.error('Error al descargar el archivo de entrada:', error);
    }
  };


  const iniciarPlanificacion = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/iniciarPlanificacion`);
      console.log('Respuesta del backend:', response.data);
  
      // Llama a download para getFileOutputModelo después de una respuesta exitosa
      await download(`${process.env.REACT_APP_BACKEND_URL}/getFileOutputModelo`, 'Planificación del día.pdf');
      console.log('Descarga de getFileOutputModelo realizada con éxito');
  
      // Llama a download para getFileOutputResumen después de getFileOutputModelo
      await download(`${process.env.REACT_APP_BACKEND_URL}/getFileOutputResumen`, 'Resumen.xlsx');
      console.log('Descarga de getFileOutputResumen realizada con éxito');
  
    } catch (error) {
      console.error('Error al llamar al backend:', error);
    }
  };

  const visualizarPDF = () => {
    const urlPdf = `${process.env.REACT_APP_BACKEND_URL}/getUrlPlanificacion`;
    setPdfURL(urlPdf);
    //setMostrarPDF(true); // Establecer mostrarPDF a true para mostrar el PDF
    window.open(pdfURL, '_blank'); // Establecer mostrarPDF a true para mostrar el PDF
  };





  const handleSemana = async (e) => {
    e.preventDefault();
    if (semana) {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/obtenerSemana`, {
        semana: semana
      }).catch((error) => {
        if (error.response.status === 400) console.log(error.response.status);
      })
    }

  }
  const handleSubmit = async (data) => {
    navigate('/outputs/' + semana)
  }

  function imprimirMensaje() {
    console.log("Este es un mensaje en la consola.");
  }


  return (
    <div className='background-input'>
      <div className='box-container-input'>
        <div className='box-top-input'>
          <h1 className='top-text-input'>Bienvenido WineOptimize</h1>
        </div>
        {/*<form className='form-group' autoComplete='off' onSubmit={handleSubmit}>*/}
          <div className='box-down-input'>
            <div className='main-container'>
              <div className='form'>
                <label className='text-input-excel'><h1>Ingresar programa vendimia </h1></label>
                <input type='file' className='form-control' onChange={(e) => subirArchivo(e.target.files)} required></input>
              </div>
              <div className='form'>
                <label className='text-input-excel'><h1>Ingresar plan Lontué</h1></label>
                <input type='file' className='form-control' onChange={(e) => subirArchivoPdf(e.target.files)} required></input>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className='btn-in'>
                    <button className='button-succ' onClick={() => insertarArchivos()}>
                      Subir
                    </button>
                  </div>
                </div>   
                <div className="col-6">    
                  <div className='btn-out'>
                    <button className='button-succ' onClick={(e) =>downloadInputFile(e)}>
                      Descargar
                    </button>
                  </div> 
                </div> 
              </div>
            </div>
             {/*<div className='semana'>
              <h1 className='semana-h1'>Seleccione la semana en la que requiere hacer la optimización:</h1>
              <select name='semana-select' onChange={(event) => setSemana(event.target.value)} onClick={handleSemana} required>
                <option value="">No definido</option>
                {semanas.map(elemento => (
                  <option value={elemento} key={elemento}>{elemento}</option>
                ))}
              </select>
                </div> */}
              <div className='maintenance'>
                <button
                  className='button-maquina'
                  type='button'
                  onClick={handleAdd}
                  disabled={showMaintenance}
                >
                  Añadir Máquina/Cambiar estado
                </button>
                {showMaintenance && <Maintenance onClose={handleClose} />}
              </div>
              
              
            <div className='next'>
              <button className='button-iniciar' onClick={(e) =>iniciarPlanificacion(e)}>
                Realizar Planificación
              </button>
            </div>
            <div>
            <button className='button-succ' onClick={visualizarPDF}>
              {mostrarPDF ? 'Ocultar PDF' : 'Visualizar PDF'}
            </button>
            {pdfURL && mostrarPDF && (
              <div className='pdf-viewer'>
                <embed src={pdfURL} type='application/pdf' width='100%' height='600px' />
              </div>
            )}
            </div>

          </div>
        {/*</form>*/}
      </div>
    </div>
  )
}
