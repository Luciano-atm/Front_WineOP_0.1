import React from "react";
import './pdf.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from "react";

import { Viewer, Worker} from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/renderer/core/lib/style/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

function Pdfview(){

    const [pdfFile, setPdfFile]= useState(null)
    const [viewPdf, setViewPdf]= useState(null)

    const fileType= ['application/pdf']

    const handleChange = (e) => {
        let selectedFile = e.target.file[0]
        if(selectedFile){
            if(selectedFile && fileType.includes(selectedFile.type)){
                let reader = new FileReader()
                reader.readAsDataURL(selectedFile)
                reader.onload = (e) => {
                    setPdfFile(e.target.result)
                }
            }
            else {
                setPdfFile(null)
            }
        }
        else{
            console.log("please selsect")
        }

        const handleSubmit = (e) => {
            e.preventDEfault()
            if(pdfFile !== null){
                setViewPdf(pdfFile)
            }
            else{
                setViewPdf(null)
            }
        }
    }
    const newplugin = defaultLayoutPlugin()
    return(
        <div className='container'>
            <form onChange={handleSubmit}>
                <input type="file" className='from-control' onChange={handleChange}></input>
                <button type='submit' className='btn btn-success' >View PDF</button>
            </form>

            <h2>View PDF</h2>
            <dib className='pdf-container'>
                <Worker WorkerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
                    {viewPdf && <>
                    <Viewer fileUrl={viewPdf} plugins={[newplugin]}/>
                    </>}
                    {!viewPdf && <>No PDF</>}
                </Worker>
            </dib>

        </div>
    )
}
