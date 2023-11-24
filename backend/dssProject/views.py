from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from rest_framework import status
from django.core.files.storage import FileSystemStorage
import os
from pathlib import Path
from django.http import FileResponse
from django.conf import settings
import pandas as pd
import json

from test1 import *

from dssProject.models import Maquina, Mantencion, Schedule
from dssProject.serializers import MaquinaSerializers, MantencionSerializer, ScheduleSerializer

BASE_DIR = Path(__file__).resolve().parent.parent


# Create your views here.
@csrf_exempt
def maquinaApi(request,id=0):
    if request.method == 'GET':
        maquinas = Maquina.objects.all()
        maquinas_serializer = MaquinaSerializers(maquinas,many=True)
        return JsonResponse(maquinas_serializer.data,safe=False)

@csrf_exempt
def getMaquinasId(request):
    if request.method == 'GET':
        maquinas = list(Maquina.objects.values('id_maquina'))
        return JsonResponse({"ID Maquinas":maquinas})

@csrf_exempt
def getMantenciones(request):
    if request.method == 'GET':
        mantenciones = Mantencion.objects.all()
        mantenciones_serializer = MantencionSerializer(mantenciones,many=True)
        return JsonResponse(mantenciones_serializer.data,safe=False)

@csrf_exempt
def createMantencion(request):
    if request.method == 'POST':
        mantencion_data = JSONParser().parse(request)
        mantencion_serializer = MantencionSerializer(data = mantencion_data)
        if mantencion_serializer.is_valid():
            mantencion_serializer.save()
            return JsonResponse(mantencion_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(mantencion_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def uploadFile(request):
    myfile = request.FILES['myfile']
    df = pd.read_excel(myfile)
    lista = []
    for i in range(len(df)):
        if df.SEMANA[i] not in lista and df.SEMANA[i] > 0:
            lista.append(df.SEMANA[i])
    fs = FileSystemStorage()
    filename = fs.save(myfile.name, myfile)
    uploaded_file_url = fs.url(filename)
    return JsonResponse({"semanas":lista})

@csrf_exempt
def createOptimizacion(request):
    horario_count = Schedule.objects.count()
    if horario_count == 0:
        crearOptimizacion(semana)
    horario = Schedule.objects.all()
    horario_serializer = ScheduleSerializer(horario,many=True)
    return JsonResponse(horario_serializer.data,safe=False)

@csrf_exempt
def obtenerSemana(request):
    semana_data = JSONParser().parse(request)
    num = int(semana_data.get('semana'))
    global semana
    semana = num
    print(num)
    return JsonResponse(semana_data,status=status.HTTP_201_CREATED)

@csrf_exempt
def getSemana(request):
    dicc = {'semana':semana}
    return JsonResponse(semana,safe=False)

@csrf_exempt
def reiniciarSimulacion(request):
    Schedule.objects.all().delete()
    Mantencion.objects.all().delete()
    fs = FileSystemStorage()
    fs.delete("pln_v1.xls")
    fs.delete('planificacion.pdf')
    horario = Schedule.objects.all()
    horario_serializer = ScheduleSerializer(horario,many=True)
    return JsonResponse(horario_serializer.data,safe=False)

@csrf_exempt
def getFile(request):
    fs = FileSystemStorage(os.path.join(settings.MEDIA_ROOT))
    response = FileResponse(fs.open("planificacion.pdf",'rb'),content_type='application/force-download')
    response['Content-Disposition'] = 'attachment; filename="planificacion.pdf"'
    return response


