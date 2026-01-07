// =========================================================================
// DATOS DE EJEMPLO - ATLETA DE FÚTBOL
// Estos datos se cargan cuando se hace clic en "Cargar Ejemplo"
// =========================================================================

const exampleData = {
    // DATOS GENERALES
    nombre: "Carlos Eduardo",
    apellido: "Rodríguez Pérez",
    edad: 24,
    peso: 73.5,
    talla: 178.2,
    sexo: "Masculino",
    cc: "1053782946",
    dominancia: "Derecha",
    celular: "3154287639",

    // ANAMNESIS Y ANTECEDENTES CLÍNICOS
    antecMedicos: "Hipertensión arterial controlada con medicación. Antecedente familiar de diabetes tipo 2.",
    antecQuirurgicos: "Artroscopia de rodilla derecha hace 3 años por lesión de menisco medial.",
    antecLesiones: "Esguince de tobillo izquierdo grado II (2022). Contractura muscular en isquiotibiales recurrente.",
    antecTrauma: "Fractura de clavícula izquierda a los 16 años por caída en bicicleta. Recuperación completa.",
    antecMetabolico: "Ninguno conocido hasta la fecha.",
    hospitalizaciones: "Hospitalización por apendicectomía en 2019. Sin complicaciones.",
    alergias: "Alérgico a la penicilina y mariscos.",

    // ACTIVIDAD FÍSICA Y ENTRENAMIENTO
    deporte: "Fútbol profesional",
    tiempoDeporte: "8 años",
    rol: "Mediocampista ofensivo",
    club: "Club Deportivo Los Andes",
    entrenador: "Miguel Ángel Torres",
    diasEntrenamiento: "5 días",
    diasGimnasio: "3 días",
    diasDescanso: "1 día",

    // MOTIVO DE CONSULTA
    motivoConsulta: "Dolor recurrente en zona plantar del pie derecho durante y después de los entrenamientos. Sensación de rigidez matutina que mejora con el calentamiento pero regresa al finalizar la actividad física.",
    notasAdicionales: "El atleta refiere que el dolor comenzó hace aproximadamente 2 meses, coincidiendo con el aumento de la intensidad de los entrenamientos. No hay antecedente de trauma directo.",

    // VALORACIÓN FISIOTERAPIA DEPORTIVA
    postura: "Postura erguida, ligera anteversión pélvica. Hombros nivelados, sin asimetrías significativas en miembros inferiores.",
    marcha: "Patrón de marcha normal, fase de apoyo simétrica. Leve supinación en pie derecho durante la fase de impulso.",
    hods: "2",
    lunge: "+",
    observaciones: "Arco plantar normal, sin signos de pie plano. Ligera rigidez en articulación subastragalina derecha. Tensión aumentada en fascia plantar.",

    // TESTS DE SALTO
    saltos: {
        cmj: {
            peso: "73.5",
            altura: "42.3",
            velocidad: "2.89",
            tiempoVuelo: "0.295",
            q: "0.85",
            caida: "38.1",
            n: "2.1",
            rfd: "3245"
        },
        sj: {
            peso: "73.5",
            altura: "38.9",
            velocidad: "2.76",
            tiempoVuelo: "0.282",
            q: "0.82",
            caida: "36.2",
            n: "2.0",
            rfd: "2987"
        },
        dj: {
            peso: "73.5",
            altura: "44.1",
            velocidad: "2.94",
            tiempoVuelo: "0.301",
            q: "0.88",
            caida: "39.8",
            n: "2.2",
            rfd: "3456"
        },
        abralakov: {
            peso: "73.5",
            altura: "46.7",
            velocidad: "3.03",
            tiempoVuelo: "0.309",
            q: "0.91",
            caida: "42.1",
            n: "2.3",
            rfd: "3678"
        },
        "cmj1-1": {
            peso: "73.5",
            altura: "41.8",
            velocidad: "2.86",
            tiempoVuelo: "0.292",
            q: "0.84",
            caida: "37.9",
            n: "2.1",
            rfd: "3189"
        }
    },

    // DINAMOMETRÍA
    dinamometria: "Fuerza de prensión manual: Derecha 52 kg, Izquierda 50 kg. Fuerza isométrica de flexores plantares: Derecha 85 kg, Izquierda 82 kg. Dorsiflexores: Derecha 32 kg, Izquierda 30 kg.",

    // VELOCIDAD Y GONIOMETRÍA
    velocidad: "Velocidad máxima lineal: 32.5 km/h. Rango de movimiento tobillo derecho: Dorsiflexión 18°, Flexión plantar 52°, Inversión 38°, Eversión 16°. Tobillo izquierdo: Dorsiflexión 20°, Flexión plantar 54°, Inversión 40°, Eversión 18°."
};
