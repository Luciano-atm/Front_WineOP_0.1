import pandas as pd
import re
from itertools import product
#Lectura de archivo y lectura de llegadas. 
df=pd.read_excel("pln_v1.xls")
dic=pd.read_excel("dicc.xls")
dic.drop(columns=['D'],inplace=True)
aux1=dic[dic['t']<=96]
df.dropna(inplace=True)
df.drop(columns=['ESTADO COSECHA'], inplace=True)
df.drop(columns=['PRODUCTOR'], inplace=True)
w1=df.loc[df['SEMANA'] ==6, ['D','BLOQUE','kg','h']]
w1.reset_index(inplace=True)
w1['t']=w1['D']*96
w1.drop(columns=['index'], inplace=True)
w2=pd.merge(w1,aux1, on='h', how='left')
w2['t']=w2['t_x']+w2['t_y']
w2.drop(columns=['t_y'], inplace=True)
w2.drop(columns=['t_x'], inplace=True)
w2.reset_index(inplace=True)
w2.D=w2.D.replace({0:'Lunes',1:'Martes',2:'Miercoles', 
                   3:'Jueves', 4:'Viernes', 5:'Sabado'})
w2.drop(columns=['index'], inplace=True)
w2.kg = w2.kg/1000
time=[]
for i in range(60):
    time.append(i)
tasks=['Despalillado','Prensado','Preflotacion','Flotacion']

material=['uva','uvad','jugo','pref','jugof','raquis','orujo']
Rstp={(s,t):0 for s in material for t in time}
LA1=[]
for i in w2['kg']:
    LA1.append(i)
rst={(s,t):0
    for t1 in w2['t'] 
    for t in time if t1==t
    for s in material if s=='uva'
    }
rst=dict(zip(rst.keys(),LA1))
Rst = {key : rst.get(key, val)  for key, val in Rstp.items()}
Rstl=[]
auxuv=[]
auxuvad=[]
auxjugo=[]
auxpref=[]
auxf=[]
auxor=[]
auxra=[]

for i,val in Rst.items():
    if i[0]== 'uva':
        auxuv.append(val)
    if i[0]=='uvad':
        auxuvad.append(val)
    if i[0]=='jugo':
        auxjugo.append(val)
    if i[0]=='pref':
        auxpref.append(val)
    if i[0]=='jugof':
        auxf.append(val)
    if i[0]=='raquis':
        auxor.append(val)
    if i[0]=='orujo':
        auxra.append(val)
Rstl.append(auxuv)
Rstl.append(auxuvad)
Rstl.append(auxjugo)
Rstl.append(auxpref)
Rstl.append(auxf)
Rstl.append(auxor)
Rstl.append(auxra)
Rstl[0][3] = 100
df=pd.read_excel("settings.xls")
machines=[]
Vmax=[]
Ij=[]
L3=[]
L4=[]
P=[]
for j in df.Maquinas:
    for n in range(len(df.Cantidad)):
        if j==df.Maquinas[n]:
                L3.append(j)
                L4.append(df.Cantidad[n])
for i in range(len(L4)):
    for j in range(L4[i]):
        machines.append(f"{L3[i]}{j+1}")
        Vmax.append(df.Capacidad[i])
        Ij.append(df.Tarea[i])
        P.append(df.Procesamiento[i])
        #print(f"{L3[i]}{j+1}")
Pi=[]
auxde=[]
auxpr=[]
auxcpf=[]
auxflt=[]
for i in range(len(L4)):
    for j in range(L4[i]):    
        if L3[i].startswith('Pozo'):
                auxde.append(df.Procesamiento[i])
        elif L3[i].startswith('Pren'):
                auxpr.append(df.Procesamiento[i])
        elif L3[i].startswith('CPF'):
                auxcpf.append(df.Procesamiento[i])
        else:
                auxflt.append(df.Procesamiento[i])
Pi.append(auxde)
Pi.append(auxpr)
Pi.append(auxcpf)
Pi.append(auxflt)
M = sum(Pi[i][j] for i in range(len(Pi)) for j in range(len(Pi[i]))) 
Ki=[] 
auxde=[]
auxpr=[]
auxcpf=[]
auxflt=[]
for i in range(len(machines)):
    if machines[i].startswith('Poz'):
        auxde.append(i)
    elif machines[i].startswith('Pren'):
        auxpr.append(i)
    elif machines[i].startswith('CPF'):
        auxcpf.append(i)
    else:
        auxflt.append(i)
Ki.append(auxde)
Ki.append(auxpr)
Ki.append(auxcpf)
Ki.append(auxflt)
Si=[0,1,2,3]
So=[[1,5],[2,6],3,4]
rhoi={
    ('Despalillado','uva'):1,
    ('Despalillado','uvad'):0,
    ('Despalillado','jugo'):0,
    ('Despalillado','pref'):0,
    ('Despalillado','jugof'):0,
    ('Despalillado','raquis'):0,
    ('Despalillado','orujo'):0,
    ('Prensado','uva'):0,
    ('Prensado','uvad'):1,
    ('Prensado','jugo'):0,
    ('Prensado','pref'):0,
    ('Prensado','jugof'):0,
    ('Prensado','raquis'):0,
    ('Prensado','orujo'):0,
    ('Preflotacion','uva'):0,
    ('Preflotacion','uvad'):0,
    ('Preflotacion','jugo'):1,
    ('Preflotacion','pref'):0,
    ('Preflotacion','jugof'):0,
    ('Preflotacion','raquis'):0,
    ('Preflotacion','orujo'):0,
    ('Flotacion','uva'):0,
    ('Flotacion','uvad'):0,
    ('Flotacion','jugo'):0,
    ('Flotacion','pref'):1,
    ('Flotacion','jugof'):0,
    ('Flotacion','raquis'):0,
    ('Flotacion','orujo'):0,
}
rhoo={
    ('Despalillado','uva'):0,
    ('Despalillado','uvad'):0.96,
    ('Despalillado','jugo'):0,
    ('Despalillado','pref'):0,
    ('Despalillado','jugof'):0,
    ('Despalillado','raquis'):0.04,
    ('Despalillado','orujo'):0,
    ('Prensado','uva'):0,
    ('Prensado','uvad'):0,
    ('Prensado','jugo'):0.867,
    ('Prensado','pref'):0,
    ('Prensado','jugof'):0,
    ('Prensado','raquis'):0,
    ('Prensado','orujo'):0.133,
    ('Preflotacion','uva'):0,
    ('Preflotacion','uvad'):0,
    ('Preflotacion','jugo'):0,
    ('Preflotacion','pref'):1,
    ('Preflotacion','jugof'):0,
    ('Preflotacion','raquis'):0,
    ('Preflotacion','orujo'):0,
    ('Flotacion','uva'):0,
    ('Flotacion','uvad'):0,
    ('Flotacion','jugo'):0,
    ('Flotacion','pref'):0,
    ('Flotacion','jugof'):1,
    ('Flotacion','raquis'):0,
    ('Flotacion','orujo'):0
}


rhoil=[]
rhool=[]
auxde=[]
auxpr=[]
auxcpf=[]
auxflt=[]
for i,s in rhoi.items():
    if i[0].startswith('Desp'):
        auxde.append(s)
    elif i[0].startswith('Pren'):
        auxpr.append(s)
    elif i[0].startswith('Preflo'):
        auxcpf.append(s)
    else:
        auxflt.append(s)
rhoil.append(auxde)
rhoil.append(auxpr)
rhoil.append(auxcpf)
rhoil.append(auxflt)
auxde=[]
auxpr=[]
auxcpf=[]
auxflt=[]
for i,s in rhoo.items():
    if i[0].startswith('Desp'):
        auxde.append(s)
    elif i[0].startswith('Pren'):
        auxpr.append(s)
    elif i[0].startswith('Preflo'):
        auxcpf.append(s)
    else:
        auxflt.append(s)
rhool.append(auxde)
rhool.append(auxpr)
rhool.append(auxcpf)
rhool.append(auxflt)
Til=[[0],
     [1],
     [2],
     [3],
     [],
     [],
     []
    ]
Tol=[[],
     [0],
     [1],
     [2],
     [3],
     [0],
     [1]
    ]
Cs=[1,
     0.75,
     0.5,
     0.25,
     0.01,
     0.01,
     0.01
    ]
Vmin=[]
for i in range(len(Vmax)):
    Vmin.append(Vmax[i]*0.5)
TASKS=range(len(tasks))
MACHINES=range(len(machines))
TIME=range(len(time))
MATERIAL=range(len(material))
print(MACHINES)
from mip import *
m=Model(sense=MINIMIZE,solver_name=CBC)
W=[[[m.add_var(var_type=BINARY,name='W({},{},{})'.format(i,j,t))for t in TIME] for j in MACHINES]for i in TASKS ]
B=[[[m.add_var(var_type=CONTINUOUS,name='B({},{},{})'.format(i,j,t))for t in TIME] for j in MACHINES]for i in TASKS ]
S=[[m.add_var(var_type=CONTINUOUS, name='S({},{})'.format(s,t))for t in TIME]for s in MATERIAL]
for (I,T,J) in product(TASKS, TIME, MACHINES):
    if J in Ki[I]:
        m+=(B[I][J][T]>= Vmin[J]*W[I][J][T], (f"C1({I},{J},{T})"))
        m+=(B[I][J][T]<= Vmax[J]*W[I][J][T], (f"C2({I},{J},{T})"))
for (J, T, I) in product(MACHINES, TIME, TASKS):
    if I == Ij[J]:
        if T<= time[-1]-P[J]:
            m+=(xsum(W[i][J][t] for t in range(T,T+P[J]+1) for i in TASKS if i == Ij[J])-1<= M*(1-W[I][J][T]),(f"C3({I},{J},{T})") )
for (s,t) in product(MATERIAL,TIME):
    if t>= 1:
        m+= (S[s][t] == S[s][t-1] + Rstl[s][t] + sum(rhool[i][s]*sum(B[i][j][t-P[j]] for j in Ki[i] if t>= P[j])for i in Tol[s])-(sum(rhoil[i][s]*sum(B[i][j][t] for j in Ki[i])for i in Til[s])),(f"C4({s},{t})") )
m.optimize()
if m.num_solutions:
    print("Solution with cost {} found.".format(m.objective_value))
Wi=[]
Wr=[]
Br=[]
Si=[]
Sr=[]
for i in m.vars:
    if str(i).startswith('W'):
        if i.x ==1:
            Wi.append(i.name)
            Wr.append(i.x)
    if str(i).startswith('B'):
        if i.x !=0:
            Br.append(i.x)
    else:            
        Si.append(i.name)   
        Sr.append(i.x)
WI=[]
WJ=[]
WT=[]
fuera="W()"
for i in Wi:
    for x in range(len(fuera)):
        i= i.replace(fuera[x],"")
    for z in range(len(i.split(","))):
        if z == 0:
            WI.append(i.split(",")[z])
        if z == 1:
            WJ.append(i.split(",")[z])
        if z== 2:
            WT.append(i.split(",")[z])
for i in range(len(WI)):
    print(f" La tarea {tasks[int(WI[i])]} se realizará en la máquina: {machines[int(WJ[i])]} a las {dic.h[int(WT[i])]} con una carga de {Br[i]}")