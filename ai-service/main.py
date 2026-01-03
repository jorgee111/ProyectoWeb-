import pandas as pd
import numpy as np
import joblib
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI()

# Configuración de CORS para que el frontend pueda hablar con esto
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. CARGA DEL MODELO ---
try:
    modelo = joblib.load("best_gradient_boosting_model.pkl")
    print("✅ Modelo cargado correctamente.")
    
    if hasattr(modelo, "feature_names_in_"):
        print("📋 El modelo espera estas columnas (se ordenarán automáticamente):")
        print(modelo.feature_names_in_)
except Exception as e:
    print(f"❌ Error crítico cargando el modelo: {e}")
    modelo = None

# --- 2. CLASE DE ENTRADA CON VALIDACIÓN ---
class DatosEntrada(BaseModel):
    # Field asegura que los datos tengan sentido antes de procesar nada
    hora: int = Field(..., ge=0, le=23, description="Hora del día (0-23)")
    dia_semana: int = Field(..., ge=0, le=6, description="0=Lunes, 6=Domingo")
    humedad: float
    velocidad_viento: float
    precipitacion: float

# --- 3. PREPARACIÓN DE DATOS ---
def preparar_dataframe(d: DatosEntrada):
    # Calcular variables derivadas
    es_finde = 1 if d.dia_semana >= 5 else 0
    
    # Lógica de hora punta (ajustada a tu notebook)
    es_hora_punta = 1 if (7 <= d.hora <= 9) or (17 <= d.hora <= 19) else 0

    # Transformaciones trigonométricas
    hora_sin = np.sin(2 * np.pi * d.hora / 24.0)
    hora_cos = np.cos(2 * np.pi * d.hora / 24.0)
    dia_sin = np.sin(2 * np.pi * d.dia_semana / 7.0)
    dia_cos = np.cos(2 * np.pi * d.dia_semana / 7.0)

    # Construir diccionario con TODAS las posibles variables
    # (No te preocupes si sobran, el código de abajo las filtra)
    data = {
        'hora_del_dia': [d.hora],
        'dia_semana': [d.dia_semana],
        'es_fin_de_semana': [es_finde],
        'es_hora_punta': [es_hora_punta],
        'humedad_porcentaje': [d.humedad],
        'velocidad_viento_ms': [d.velocidad_viento],
        'precipitacion_mm_h': [d.precipitacion],
        'hora_sin': [hora_sin],
        'hora_cos': [hora_cos],
        'dia_sin': [dia_sin],
        'dia_cos': [dia_cos],
        'es_finde': [es_finde] # Posible duplicado, se gestiona abajo
    }
    
    df = pd.DataFrame(data)

    # --- MAGIA: REORDENAMIENTO AUTOMÁTICO ---
    # Esto evita el error "Feature names mismatch"
    if modelo is not None and hasattr(modelo, "feature_names_in_"):
        cols_modelo = modelo.feature_names_in_
        try:
            # Selecciona solo las columnas que el modelo quiere y en su orden
            df = df[cols_modelo]
        except KeyError as e:
            # Si falta alguna columna vital, avisamos
            print(f"⚠️ Error: Tu diccionario data no tiene todas las columnas que pide el modelo.")
            print(f"Falta: {e}")
            raise e
            
    return df

# --- 4. ENDPOINT DE PREDICCIÓN ---
@app.post("/predict")
def predecir_trafico(datos: DatosEntrada):
    if modelo is None:
        return {"error": "El modelo no está cargado. Revisa el archivo .pkl"}

    print("\n--- NUEVA PETICIÓN ---")
    print(f"📡 Datos recibidos: {datos}")
    
    try:
        df = preparar_dataframe(datos)
        
        print("📊 DataFrame final enviado al modelo:")
        print(df.to_string(index=False))
        
        # Predecir
        prediccion = modelo.predict(df)[0]
        probs = modelo.predict_proba(df)[0]
        
        print(f"🎲 Resultado: {prediccion} | Probabilidades: {probs}")
        
        # Mapeo de resultados
        niveles = {0: "Tráfico Fluido", 1: "Tráfico Moderado", 2: "Tráfico Denso", 3: "Muy Denso"}
        resultado_texto = niveles.get(int(prediccion), "Desconocido")
        
        return {
            "resultado": resultado_texto, 
            "clase": int(prediccion), 
            "confianza": float(max(probs)) # Devuelve la probabilidad más alta
        }
        
    except Exception as e:
        print(f"💥 Error procesando la petición: {e}")
        return {"error": str(e)}

# --- 5. ARRANQUE DEL SERVIDOR ---
if __name__ == "__main__":
    # Esto permite ejecutar el script directamente con "python nombre_archivo.py"
    print("🚀 Iniciando servidor en http://localhost:8000 ...")
    uvicorn.run(app, host="0.0.0.0", port=8000)