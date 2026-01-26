// =========================================================================
// REPORTE MÉDICO - SCRIPT PRINCIPAL
// =========================================================================

class ReporteMedico {
    constructor() {
        try {
            console.log('Script cargado, inicializando ReporteMedico...');
            
            this.form = document.getElementById('reportForm');
            this.pesoInput = document.getElementById('peso');
            this.tallaInput = document.getElementById('talla');
            this.imcInput = document.getElementById('imc');
            this.reportDateElement = document.getElementById('reportDate');
            
            // Almacenar archivos adjuntos
            this.adjuntos = [];
            this.adjuntosEliminadosFlag = false; // Bandera para eliminar adjuntos de DB al guardar
            
            if (!this.form || !this.pesoInput || !this.tallaInput || !this.imcInput) {
                console.error('Elementos del formulario no encontrados');
                return;
            }
            
            this.init();
        } catch (error) {
            console.error('Error en constructor:', error);
        }
    }

    init() {
        this.setupEventListeners();
        this.setReportDate();
        this.calculateIMC();
        this.checkImportedDataFromStorage();
        console.log('ReporteMedico inicializado');
    }

    checkImportedDataFromStorage() {
        const reportToLoad = sessionStorage.getItem('reportToLoad');
        if (reportToLoad) {
            try {
                const data = JSON.parse(reportToLoad);
                this.loadDataFromObject(data);
                
                // Cargar adjuntos si existen
                const adjuntosToLoad = sessionStorage.getItem('adjuntosToLoad');
                console.log('adjuntosToLoad desde sessionStorage:', adjuntosToLoad);
                if (adjuntosToLoad) {
                    this.adjuntos = JSON.parse(adjuntosToLoad);
                    console.log('Adjuntos parseados:', this.adjuntos);
                    this.mostrarAdjuntosCargados();
                    sessionStorage.removeItem('adjuntosToLoad');
                } else {
                    console.log('No hay adjuntosToLoad en sessionStorage');
                }
                
                this.showAlert('✓ Reporte cargado correctamente', 'success');
                sessionStorage.removeItem('reportToLoad');
                return;
            } catch (error) {
                console.error('Error en checkImportedDataFromStorage:', error);
                this.showAlert('Error al cargar el reporte: ' + error.message, 'error');
            }
        }
    }

    loadDataFromObject(data) {
        console.log('loadDataFromObject() llamado con data:', data);
        Object.keys(data).forEach(key => {
            if (key === 'saltos' || key === 'unipodal') return;
            
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = data[key];
                } else {
                    element.value = data[key];
                }
                console.log(`Campo ${key} cargado con valor:`, data[key]);
            }
        });

        if (data.saltos) {
            Object.keys(data.saltos).forEach(saltoType => {
                const saltoData = data.saltos[saltoType];
                const inputs = document.querySelectorAll(`input[data-salto="${saltoType}"]`);
                inputs.forEach(input => {
                    const col = input.getAttribute('data-col');
                    if (saltoData[col] !== undefined && saltoData[col] !== null) {
                        input.value = saltoData[col];
                    }
                });
            });
        }

        if (data.unipodal) {
            Object.keys(data.unipodal).forEach(unipodalType => {
                const unipodalData = data.unipodal[unipodalType];
                const inputs = document.querySelectorAll(`input[data-unipodal="${unipodalType}"]`);
                inputs.forEach(input => {
                    const col = input.getAttribute('data-col');
                    if (unipodalData[col] !== undefined && unipodalData[col] !== null) {
                        input.value = unipodalData[col];
                    }
                });
            });
        }

        this.calculateIMC();
    }

    setupEventListeners() {
        try {
            // Validaciones para Datos Generales
            const nombreInput = document.getElementById('nombre');
            const apellidoInput = document.getElementById('apellido');
            const edadInput = document.getElementById('edad');
            const ccInput = document.getElementById('cc');
            const celularInput = document.getElementById('celular');

            if (nombreInput) nombreInput.addEventListener('input', () => this.validateNombre());
            if (apellidoInput) apellidoInput.addEventListener('input', () => this.validateApellido());
            if (edadInput) {
                edadInput.addEventListener('input', () => {
                    this.restrictToNumbers(edadInput);
                    this.validateEdad();
                });
            }
            if (ccInput) {
                ccInput.addEventListener('input', () => {
                    this.restrictToNumbers(ccInput);
                    this.validateCC();
                });
            }
            if (celularInput) {
                celularInput.addEventListener('input', () => {
                    this.restrictToNumbers(celularInput);
                    this.validateCelular();
                });
            }
            
            // Agregar restricción numérica a peso y talla
            this.pesoInput.addEventListener('input', () => {
                this.restrictToNumbers(this.pesoInput, true);
                this.calculateIMC();
                this.validatePeso();
            });
            this.tallaInput.addEventListener('input', () => {
                this.restrictToNumbers(this.tallaInput, true);
                this.calculateIMC();
                this.validateTalla();
            });

            // Validaciones para campos de días en Actividad Física
            const diasEntrenamientoInput = document.getElementById('diasEntrenamiento');
            const diasGimnasioInput = document.getElementById('diasGimnasio');
            const diasDescansoInput = document.getElementById('diasDescanso');

            if (diasEntrenamientoInput) {
                diasEntrenamientoInput.addEventListener('input', () => {
                    this.restrictToNumbers(diasEntrenamientoInput);
                    this.validateDias(diasEntrenamientoInput);
                });
            }
            if (diasGimnasioInput) {
                diasGimnasioInput.addEventListener('input', () => {
                    this.restrictToNumbers(diasGimnasioInput);
                    this.validateDias(diasGimnasioInput);
                });
            }
            if (diasDescansoInput) {
                diasDescansoInput.addEventListener('input', () => {
                    this.restrictToNumbers(diasDescansoInput);
                    this.validateDias(diasDescansoInput);
                });
            }

            // Validaciones para campos de Análisis Biomecánico (Ojos Abiertos)
            const bioFieldsOA = [
                'areaElipseIzq', 'areaElipseDer', 'areaElipseAsim',
                'desvIntIzq', 'desvIntDer', 'desvIntAsim',
                'bipodLateralIzq', 'bipodLateralDer', 'bipodLateralAsim',
                'distPesoTalonIzq', 'distPesoTalonDer', 'distPesoDedosIzq', 'distPesoDedosDer',
                'asimAmpTalonDedosIzq', 'asimAmpTalonDedosDer'
            ];

            bioFieldsOA.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (input) {
                    input.addEventListener('input', () => {
                        this.restrictToNumbers(input, true);
                    });
                }
            });

            // Validaciones para campos de Análisis Biomecánico (Ojos Cerrados)
            const bioFieldsCC = [
                'areaElipseIzqCC', 'areaElipseDerCC', 'areaElipseAsimCC',
                'desvIntIzqCC', 'desvIntDerCC', 'desvIntAsimCC',
                'bipodLateralIzqCC', 'bipodLateralDerCC', 'bipodLateralAsimCC',
                'distPesoTalonIzqCC', 'distPesoTalonDerCC', 'distPesoDedosIzqCC', 'distPesoDedosDerCC',
                'asimAmpTalonDedosIzqCC', 'asimAmpTalonDedosDerCC'
            ];

            bioFieldsCC.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (input) {
                    input.addEventListener('input', () => {
                        this.restrictToNumbers(input, true);
                    });
                }
            });

            // Validaciones para Distribución de Peso Unipodal
            const unipodalInputs = document.querySelectorAll('.unipodal-input');
            unipodalInputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.restrictToNumbers(input, true);
                });
            });

            // Validaciones para Sentadilla
            const sentadillaFields = [
                'sentNumSentadillas', 'sentDistPesoIzq', 'sentDistPesoDer',
                'sentFuerzaIzqKg', 'sentFuerzaDerKg', 'sentAsimPorcentaje'
            ];
            sentadillaFields.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (input) {
                    const allowDecimals = fieldId !== 'sentNumSentadillas';
                    input.addEventListener('input', () => {
                        this.restrictToNumbers(input, allowDecimals);
                    });
                }
            });

            // Validaciones para Flexiones
            const flexionesFields = [
                'flexNumReps', 'flexDistPesoIzq', 'flexDistPesoDer',
                'flexFuerzaIzqKg', 'flexFuerzaDerKg', 'flexAsimPorcentaje'
            ];
            flexionesFields.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (input) {
                    const allowDecimals = fieldId !== 'flexNumReps';
                    input.addEventListener('input', () => {
                        this.restrictToNumbers(input, allowDecimals);
                    });
                }
            });

            // Validaciones para Tests de Salto
            const saltoInputs = document.querySelectorAll('.salto-input');
            saltoInputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.restrictToNumbers(input, true);
                });
            });

            // Buscar o crear input file
            let fileInput = document.getElementById('fileInput');
            if (!fileInput) {
                fileInput = document.createElement('input');
                fileInput.id = 'fileInput';
                fileInput.type = 'file';
                fileInput.accept = '.json';
                fileInput.style.display = 'none';
                document.body.appendChild(fileInput);
                console.log('Input file creado');
            } else {
                console.log('fileInput ya existe, agregando listener');
            }
            
            // Agregar listener (o reemplazarlo)
            fileInput.addEventListener('change', (event) => {
                console.log('Evento change disparado en fileInput');
                console.log('Archivos seleccionados:', event.target.files);
                this.handleFileSelect(event);
            });
            console.log('Listener change agregado a fileInput');

            // Solo agregar listeners a botones que existen
            const loadFileBtn = document.getElementById('loadFileBtn');
            if (loadFileBtn) {
                loadFileBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Botón Cargar clickeado');
                    this.loadFile();
                });
                console.log('Botón Cargar vinculado');
            }

            // Listener para archivo adjunto (PDF/Imagen)
            const pdfImagenInput = document.getElementById('pdfImagenInput');
            if (pdfImagenInput) {
                pdfImagenInput.addEventListener('change', (e) => {
                    this.handlePdfImagenSelect(e);
                });
                console.log('Input PDF/Imagen vinculado');
            }

            const saveBtn = document.getElementById('saveBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.saveReportToDB();
                });
                console.log('Botón Guardar vinculado');
            }

            const printBtn = document.getElementById('printBtn');
            if (printBtn) {
                printBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.printReport();
                });
                console.log('Botón Descargar PDF vinculado');
            }

            // Agregar listener para botón Limpiar en sidebar flotante
            const cleanBtns = document.querySelectorAll('.floating-sidebar button[type="reset"]');
            cleanBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Limpiar el formulario
                    if (this.form) {
                        this.form.reset();
                    }
                    // Limpiar archivos adjuntos
                    this.adjuntos = [];
                    const pdfImagenInput = document.getElementById('pdfImagenInput');
                    if (pdfImagenInput) {
                        pdfImagenInput.value = '';
                    }
                    const adjuntoInfo = document.getElementById('adjuntoInfo');
                    if (adjuntoInfo) {
                        adjuntoInfo.style.display = 'none';
                    }
                    // Recalcular IMC en caso de que se haya completado
                    this.setReportDate();
                    this.showAlert('✓ Formulario limpiado correctamente', 'success');
                    console.log('Formulario limpiado');
                });
            });
            console.log('Botón Limpiar en sidebar vinculado');
        } catch (error) {
            console.error('Error en setupEventListeners:', error);
        }
    }

    calculateIMC() {
        const peso = parseFloat(this.pesoInput.value) || 0;
        const talla = parseFloat(this.tallaInput.value) || 0;

        if (peso > 0 && talla > 0) {
            const talla_m = talla / 100;
            const imc = peso / (talla_m * talla_m);
            this.imcInput.value = imc.toFixed(1);
        } else {
            this.imcInput.value = '';
        }
    }

    // ==================== VALIDACIONES ====================
    
    restrictToNumbers(input, allowDecimals = false) {
        let value = input.value;
        
        if (allowDecimals) {
            // Permitir números y un solo punto decimal
            value = value.replace(/[^\d.]/g, '');
            // Asegurar solo un punto decimal
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
        } else {
            // Solo números enteros
            value = value.replace(/\D/g, '');
        }
        
        input.value = value;
    }
    
    showFieldError(input, message) {
        // Remover error previo si existe
        this.clearFieldError(input);
        
        // Agregar clase de error al input
        input.classList.add('input-error');
        
        // Crear mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.id = `error-${input.id}`;
        
        // Insertar después del input
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }

    clearFieldError(input) {
        input.classList.remove('input-error');
        const errorMsg = document.getElementById(`error-${input.id}`);
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    validateNombre() {
        const input = document.getElementById('nombre');
        const value = input.value.trim();
        
        // Permitir solo letras, espacios, tildes y ñ
        const regex = /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]*$/;
        
        if (value && !regex.test(value)) {
            this.showFieldError(input, 'Solo se permiten letras');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }

    validateApellido() {
        const input = document.getElementById('apellido');
        const value = input.value.trim();
        
        const regex = /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]*$/;
        
        if (value && !regex.test(value)) {
            this.showFieldError(input, 'Solo se permiten letras');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }

    validateEdad() {
        const input = document.getElementById('edad');
        const value = parseFloat(input.value);
        
        if (input.value && (isNaN(value) || value < 0 || value > 120)) {
            this.showFieldError(input, 'Edad debe estar entre 0 y 120 años');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }

    validatePeso() {
        const value = parseFloat(this.pesoInput.value);
        
        if (this.pesoInput.value && (isNaN(value) || value <= 0 || value > 300)) {
            this.showFieldError(this.pesoInput, 'Peso debe estar entre 0 y 300 kg');
            return false;
        }
        
        this.clearFieldError(this.pesoInput);
        return true;
    }

    validateTalla() {
        const value = parseFloat(this.tallaInput.value);
        
        if (this.tallaInput.value && (isNaN(value) || value <= 0 || value > 250)) {
            this.showFieldError(this.tallaInput, 'Talla debe estar entre 0 y 250 cm');
            return false;
        }
        
        this.clearFieldError(this.tallaInput);
        return true;
    }

    validateCC() {
        const input = document.getElementById('cc');
        const value = input.value.trim();
        
        // Solo números y entre 6 y 12 dígitos
        const regex = /^\d*$/;
        
        if (value && !regex.test(value)) {
            this.showFieldError(input, 'Solo se permiten números');
            return false;
        }
        
        if (value && (value.length < 6 || value.length > 12)) {
            this.showFieldError(input, 'CC debe tener entre 6 y 12 dígitos');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }

    validateCelular() {
        const input = document.getElementById('celular');
        const value = input.value.trim();
        
        // Solo números y entre 7 y 15 dígitos (formato internacional)
        const regex = /^\d*$/;
        
        if (value && !regex.test(value)) {
            this.showFieldError(input, 'Solo se permiten números');
            return false;
        }
        
        if (value && (value.length < 7 || value.length > 15)) {
            this.showFieldError(input, 'Celular debe tener entre 7 y 15 dígitos');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }

    validateDias(input) {
        const value = parseInt(input.value);
        
        if (input.value && (isNaN(value) || value < 0 || value > 7)) {
            this.showFieldError(input, 'Los días deben estar entre 0 y 7');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }

    setReportDate() {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = today.toLocaleDateString('es-ES', options);
        this.reportDateElement.textContent = dateStr;
    }

    loadFile() {
        console.log('loadFile() llamado');
        const fileInput = document.getElementById('fileInput');
        console.log('fileInput encontrado:', fileInput);
        console.log('fileInput en DOM:', document.body.contains(fileInput));
        
        if (fileInput) {
            console.log('Disparando click en fileInput...');
            fileInput.value = ''; // Limpiar valor anterior
            fileInput.click();
            console.log('Click disparado');
        } else {
            console.error('fileInput no encontrado en el DOM');
        }
    }

    handleFileSelect(event) {
        console.log('handleFileSelect() llamado');
        const file = event.target.files[0];
        if (!file) {
            console.log('No file selected');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                console.log('Leyendo archivo...');
                const data = JSON.parse(e.target.result);
                this.loadDataFromObject(data);
                this.showAlert('✓ Archivo cargado correctamente', 'success');
            } catch (error) {
                console.error('Error al leer archivo:', error);
                this.showAlert('Error al leer el archivo: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    mostrarAdjuntosCargados() {
        console.log('mostrarAdjuntosCargados() llamado, adjuntos:', this.adjuntos);
        if (this.adjuntos && this.adjuntos.length > 0) {
            const nombres = this.adjuntos.map(r => r.nombre).join(', ');
            document.getElementById('adjuntoNombre').textContent = nombres;
            document.getElementById('adjuntoInfo').style.display = 'block';
            console.log('Adjuntos mostrados en UI:', nombres);
        } else {
            console.log('No hay adjuntos para mostrar');
        }
    }

    borrarAdjuntos() {
        this.adjuntos = [];
        this.adjuntosEliminadosFlag = true; // Marcar que se deben eliminar de la DB
        document.getElementById('adjuntoInfo').style.display = 'none';
        document.getElementById('adjuntoNombre').textContent = '';
        const input = document.getElementById('pdfImagenInput');
        if (input) {
            input.value = '';
        }
        this.showAlert('✓ Archivos adjuntos eliminados (se quitarán al guardar)', 'success');
    }

    handlePdfImagenSelect(event) {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) {
            // Limpiar si se deselecciona
            this.adjuntos = [];
            document.getElementById('adjuntoInfo').style.display = 'none';
            return;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        const tiposValidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];

        const lecturas = files.map(file => new Promise((resolve, reject) => {
            if (file.size > maxSize) {
                reject(new Error(`El archivo ${file.name} supera 10MB`));
                return;
            }
            if (!tiposValidos.includes(file.type)) {
                reject(new Error(`Tipo no permitido en ${file.name}`));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                resolve({
                    nombre: file.name,
                    tipo: file.type,
                    data: e.target.result // Base64
                });
            };
            reader.onerror = () => reject(new Error(`No se pudo leer ${file.name}`));
            reader.readAsDataURL(file);
        }));

        Promise.all(lecturas)
            .then(resultados => {
                this.adjuntos = resultados;
                this.adjuntosEliminadosFlag = false; // Reset flag al cargar nuevos archivos

                // Mostrar info de los archivos
                const nombres = resultados.map(r => r.nombre).join(', ');
                document.getElementById('adjuntoNombre').textContent = nombres;
                document.getElementById('adjuntoInfo').style.display = 'block';

                this.showAlert(`✓ ${resultados.length} archivo(s) cargado(s) correctamente`, 'success');
                console.log('Archivos adjuntos guardados:', resultados.map(r => ({ nombre: r.nombre, tipo: r.tipo, tamaño: r.data.length })));
            })
            .catch(error => {
                console.error('Error al procesar archivos:', error);
                this.showAlert('Error al procesar adjuntos: ' + error.message, 'error');
                event.target.value = '';
                this.adjuntos = [];
                document.getElementById('adjuntoInfo').style.display = 'none';
            });
    }

    async saveReportToDB() {
        console.log('saveReportToDB() llamado');
        
        const nombrePaciente = document.getElementById('nombre')?.value.trim();
        const cedula = document.getElementById('cc')?.value.trim();

        if (!nombrePaciente) {
            this.showAlert('Por favor, ingresa un nombre', 'error');
            return;
        }

        if (!cedula) {
            this.showAlert('Por favor, ingresa la cédula', 'error');
            return;
        }

        // Mostrar modal de confirmación para guardar
        this.showSaveConfirmModal();
    }

    showSaveConfirmModal() {
        const modal = document.getElementById('confirmModal');
        const modalContent = modal.querySelector('.modal-content');
        
        // Cambiar contenido del modal para guardar
        const modalIcon = modal.querySelector('.modal-icon');
        const modalTitle = modal.querySelector('.modal-title');
        const modalMessage = modal.querySelector('.modal-message');
        
        modalIcon.textContent = '💾';
        modalTitle.textContent = '¿Guardar Reporte?';
        modalMessage.textContent = 'Se guardarán los datos del paciente en la base de datos de forma segura.';
        
        modal.classList.add('active');
        
        // Remover listeners previos
        const modalCancel = modal.querySelector('#modalCancel');
        const modalConfirm = modal.querySelector('#modalConfirm');
        
        const newModalCancel = modalCancel.cloneNode(true);
        const newModalConfirm = modalConfirm.cloneNode(true);
        modalCancel.parentNode.replaceChild(newModalCancel, modalCancel);
        modalConfirm.parentNode.replaceChild(newModalConfirm, modalConfirm);
        
        // Cancelar
        newModalCancel.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        // Confirmar guardado
        newModalConfirm.addEventListener('click', async () => {
            // Deshabilitar botones
            newModalConfirm.disabled = true;
            newModalCancel.disabled = true;
            
            // Mostrar loading
            document.querySelector('.modal-loading').classList.add('active');
            document.querySelector('.modal-buttons').style.display = 'none';
            
            await this.executeSaveReport();
        });
    }

    async executeSaveReport() {
        try {
            // Guardar en base de datos
            await this.guardarEnDB();
            
            // Cerrar modal
            document.getElementById('confirmModal').classList.remove('active');
            
            // Mostrar mensaje de éxito
            this.showAlert('✓ Reporte guardado correctamente', 'success');
        } catch (error) {
            console.error('Error en executeSaveReport:', error);
            
            // Cerrar modal
            document.getElementById('confirmModal').classList.remove('active');
            
            this.showAlert('Error al guardar: ' + error.message, 'error');
        }
    }

    saveReportAsJSON() {
        console.log('saveReportAsJSON() llamado');
        const nombrePaciente = document.getElementById('nombre').value.trim();
        const apellidoPaciente = document.getElementById('apellido').value.trim();

        if (!nombrePaciente) {
            this.showAlert('Por favor, ingresa un nombre', 'error');
            return;
        }

        try {
            const reportData = this.collectFormData();
            const dataStr = JSON.stringify(reportData, null, 2);
            const filename = `Reporte_${nombrePaciente}_${apellidoPaciente}_${new Date().getTime()}.json`;

            const blob = new Blob([dataStr], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showAlert('✓ Reporte guardado como JSON', 'success');
        } catch (error) {
            console.error('Error en saveReportAsJSON:', error);
            this.showAlert('Error al guardar: ' + error.message, 'error');
        }
    }

    collectFormData() {
        const formData = {};

        document.querySelectorAll('input, select, textarea').forEach(element => {
            if (element.id && element.id !== 'fileInput') {
                if (element.type === 'checkbox') {
                    formData[element.id] = element.checked;
                } else {
                    formData[element.id] = element.value;
                }
            }
        });

        const saltosData = {};
        ['cmj', 'sj', 'dj', 'abralakov', 'cmj1-1'].forEach(type => {
            const cols = ['peso', 'altura', 'velocidad', 'tVuelo', 'q', 'caida', 'n', 'rfd'];
            const typeData = {};
            cols.forEach(col => {
                const input = document.querySelector(`input[data-salto="${type}"][data-col="${col}"]`);
                if (input) typeData[col] = input.value;
            });
            saltosData[type] = typeData;
        });
        formData.saltos = saltosData;

        const unipodalData = {};
        ['talon', 'punta'].forEach(type => {
            const cols = ['izq', 'der', 'asim'];
            const typeData = {};
            cols.forEach(col => {
                const input = document.querySelector(`input[data-unipodal="${type}"][data-col="${col}"]`);
                if (input) typeData[col] = input.value;
            });
            unipodalData[type] = typeData;
        });
        formData.unipodal = unipodalData;

        return formData;
    }

    tieneDatosSaltos() {
        const inputs = document.querySelectorAll('.salto-input');
        return Array.from(inputs).some(input => (input.value || '').trim() !== '');
    }

    async guardarEnDB() {
        try {
            // Verificar que Supabase esté configurado
            if (!window.supabaseClient) {
                console.warn('Supabase no configurado, saltando guardado en DB');
                return;
            }

            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido')?.value.trim() || '';
            const cedula = document.getElementById('cc').value.trim();

            if (!cedula) {
                console.warn('No hay cédula, no se puede guardar en DB');
                return;
            }

            // Obtener todos los datos del formulario
            const reporteData = this.collectFormData();

            // Obtener el usuario autenticado
            const currentUser = await window.supabaseClient.getCurrentUser();
            const userId = currentUser?.id;

            if (!userId) {
                console.warn('No hay usuario autenticado, no se puede guardar user_id');
            }

            // Preparar datos para Supabase
            const dataToSave = {
                cedula: cedula,
                nombre: nombre,
                apellido: apellido,
                user_id: userId || null,
                reporte_json: reporteData,
                fecha_modificacion: new Date().toISOString()
            };

            // Agregar archivos adjuntos si existen
            if (this.adjuntos && this.adjuntos.length > 0) {
                dataToSave.archivo_adjunto = JSON.stringify(this.adjuntos);
                dataToSave.tipo_archivo_adjunto = this.adjuntos.length > 1 ? 'multiple' : this.adjuntos[0].tipo;
                console.log('Archivos adjuntos incluidos en datos a guardar');
                this.adjuntosEliminadosFlag = false; // Reset flag
            } else if (this.adjuntosEliminadosFlag) {
                // Si se marcó para eliminar adjuntos, poner null explícitamente
                dataToSave.archivo_adjunto = null;
                dataToSave.tipo_archivo_adjunto = null;
                console.log('Adjuntos marcados para eliminar de DB');
                this.adjuntosEliminadosFlag = false; // Reset flag
            }

            // Verificar si ya existe un reporte con esta cédula
            const existente = await window.supabaseClient.getReporteByCedula(cedula);

            if (existente) {
                // Actualizar reporte existente
                await window.supabaseClient.updateReporte(cedula, dataToSave);
                console.log('Reporte actualizado en DB');
            } else {
                // Crear nuevo reporte
                dataToSave.fecha_creacion = new Date().toISOString();
                await window.supabaseClient.saveReporte(dataToSave);
                console.log('Reporte guardado en DB');
            }

        } catch (error) {
            console.error('Error guardando en DB:', error);
            // No mostramos error al usuario, solo log
        }
    }

    async printReport() {
        console.log('printReport() llamado');
        
        if (!document.getElementById('nombre')?.value.trim()) {
            this.showAlert('Por favor, ingrese al menos un nombre', 'error');
            return;
        }

        // Mostrar modal de confirmación moderno
        this.showConfirmModal();
    }

    showConfirmModal() {
        const modal = document.getElementById('confirmModal');
        const modalCancel = document.getElementById('modalCancel');
        const modalConfirm = document.getElementById('modalConfirm');
        
        modal.classList.add('active');
        
        // Remover listeners previos
        const newModalCancel = modalCancel.cloneNode(true);
        const newModalConfirm = modalConfirm.cloneNode(true);
        modalCancel.parentNode.replaceChild(newModalCancel, modalCancel);
        modalConfirm.parentNode.replaceChild(newModalConfirm, modalConfirm);
        
        // Cancelar
        newModalCancel.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        // Confirmar
        newModalConfirm.addEventListener('click', async () => {
            // Deshabilitar botones
            newModalConfirm.disabled = true;
            newModalCancel.disabled = true;
            
            // Mostrar loading
            document.querySelector('.modal-loading').classList.add('active');
            document.querySelector('.modal-buttons').style.display = 'none';
            
            await this.generateAndSavePDF();
        });
    }

    async generateAndSavePDF() {
        const nombrePaciente = document.getElementById('nombre').value.trim();
        const apellidoPaciente = document.getElementById('apellido')?.value.trim() || '';
        const filename = `Reporte_${nombrePaciente}_${apellidoPaciente}_${new Date().getTime()}.pdf`;

        try {
            if (!window.jspdf) {
                throw new Error('jsPDF no está cargado');
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            
            const primaryColor = [15, 76, 129];
            const accentColor = [0, 184, 212];
            const textDark = [33, 33, 33];
            const bgLight = [245, 248, 250];
            const borderColor = [224, 228, 232];
            
            let yPos = 15;

            // ==================== HEADER ====================
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, 210, 55, 'F');
            
            doc.setFillColor(...accentColor);
            doc.rect(0, 52, 210, 3, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('KINETIQ ', 15, 28);
            
            const kinetiqWidth = doc.getTextWidth('KINETIQ ');
            doc.setTextColor(...accentColor);
            doc.text('SPORTS', 15 + kinetiqWidth, 28);
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(200, 200, 200);
            doc.text('Análisis de Pisada y Presiones Plantares', 15, 38);

            yPos = 60;
            doc.setTextColor(...textDark);

            // ==================== PÁGINA 1: DATOS GENERALES ====================
            this.addSectionHeader(doc, 'DATOS GENERALES', yPos, primaryColor, accentColor);
            yPos += 9;

            doc.autoTable({
                startY: yPos,
                body: [
                    ['Nombre:', document.getElementById('nombre')?.value || '-', 'Apellido:', document.getElementById('apellido')?.value || '-'],
                    ['Edad:', (document.getElementById('edad')?.value || '-') + ' años', 'Sexo:', document.getElementById('sexo')?.value || '-'],
                    ['CC:', document.getElementById('cc')?.value || '-', 'Celular:', document.getElementById('celular')?.value || '-'],
                    ['Peso:', (document.getElementById('peso')?.value || '-') + ' Kg', 'Talla:', (document.getElementById('talla')?.value || '-') + ' cm'],
                    ['IMC:', document.getElementById('imc')?.value || '-', 'Dominancia:', document.getElementById('dominancia')?.value || '-']
                ],
                theme: 'plain',
                styles: { fontSize: 9, cellPadding: 3, textColor: textDark, lineColor: borderColor, lineWidth: 0.2 },
                columnStyles: {
                    0: { fontStyle: 'bold', textColor: primaryColor, cellWidth: 30, fillColor: bgLight },
                    1: { cellWidth: 50, fillColor: [255, 255, 255] },
                    2: { fontStyle: 'bold', textColor: primaryColor, cellWidth: 30, fillColor: bgLight },
                    3: { cellWidth: 50, fillColor: [255, 255, 255] }
                }
            });

            yPos = doc.lastAutoTable.finalY + 10;

            // ANAMNESIS Y ANTECEDENTES CLÍNICOS
            this.addSectionHeader(doc, 'ANAMNESIS Y ANTECEDENTES CLÍNICOS', yPos, primaryColor, accentColor);
            yPos += 9;

            doc.autoTable({
                startY: yPos,
                body: [
                    ['Antecedentes médicos:', document.getElementById('antecMedicos')?.value || '-'],
                    ['Antecedentes quirúrgicos:', document.getElementById('antecQuirurgicos')?.value || '-'],
                    ['Antecedentes de lesiones:', document.getElementById('antecLesiones')?.value || '-'],
                    ['Antecedentes traumáticos:', document.getElementById('antecTrauma')?.value || '-'],
                    ['Antecedentes metabólicos:', document.getElementById('antecMetabolico')?.value || '-'],
                    ['Hospitalizaciones:', document.getElementById('hospitalizaciones')?.value || '-'],
                    ['Alergias:', document.getElementById('alergias')?.value || '-']
                ],
                theme: 'plain',
                styles: { fontSize: 8, cellPadding: 2.5, textColor: textDark, lineColor: borderColor, lineWidth: 0.2 },
                columnStyles: {
                    0: { fontStyle: 'bold', textColor: primaryColor, cellWidth: 60, fillColor: bgLight },
                    1: { cellWidth: 130, fillColor: [255, 255, 255] }
                }
            });

            // ==================== PÁGINA 2: ACTIVIDAD FÍSICA ====================
            doc.addPage();
            yPos = 20;

            this.addSectionHeader(doc, 'ACTIVIDAD FÍSICA Y ENTRENAMIENTO', yPos, primaryColor, accentColor);
            yPos += 9;

            doc.autoTable({
                startY: yPos,
                body: [
                    ['Deporte:', document.getElementById('deporte')?.value || '-', 'Tiempo practicando:', document.getElementById('tiempoDeporte')?.value || '-'],
                    ['Rol/Posición:', document.getElementById('rol')?.value || '-', 'Club:', document.getElementById('club')?.value || '-'],
                    ['Entrenador:', document.getElementById('entrenador')?.value || '-', 'Días entrenamiento:', (document.getElementById('diasEntrenamiento')?.value || '-') + (document.getElementById('diasEntrenamiento')?.value ? ' días' : '')],
                    ['Días gimnasio:', (document.getElementById('diasGimnasio')?.value || '-') + (document.getElementById('diasGimnasio')?.value ? ' días' : ''), 'Días descanso:', (document.getElementById('diasDescanso')?.value || '-') + (document.getElementById('diasDescanso')?.value ? ' días' : '')],
                    ['Tenis que usa:', document.getElementById('tenis')?.value || '-', 'Carrera/Competencia:', document.getElementById('competencia')?.value || '-']
                ],
                theme: 'plain',
                styles: { fontSize: 9, cellPadding: 3.5, textColor: textDark, lineColor: borderColor, lineWidth: 0.2 },
                columnStyles: {
                    0: { fontStyle: 'bold', textColor: primaryColor, cellWidth: 55, fillColor: bgLight },
                    1: { cellWidth: 45, fillColor: [255, 255, 255] },
                    2: { fontStyle: 'bold', textColor: primaryColor, cellWidth: 55, fillColor: bgLight },
                    3: { cellWidth: 35, fillColor: [255, 255, 255] }
                }
            });

            yPos = doc.lastAutoTable.finalY + 8;

            // MOTIVO DE CONSULTA
            this.addSectionHeader(doc, 'MOTIVO DE CONSULTA', yPos, primaryColor, accentColor);
            yPos += 9;

            doc.autoTable({
                startY: yPos,
                body: [
                    [document.getElementById('motivoConsulta')?.value || 'Sin especificar']
                ],
                theme: 'plain',
                styles: { fontSize: 8.5, cellPadding: 3, textColor: textDark, lineColor: borderColor, lineWidth: 0.2, valign: 'top', halign: 'left' },
                columnStyles: {
                    0: { cellWidth: 190, fillColor: [255, 255, 255] }
                },
                margin: { top: 0, right: 15, bottom: 0, left: 15 }
            });

            yPos = doc.lastAutoTable.finalY + 8;

            // NOTAS ADICIONALES
            if (yPos > 240) {
                doc.addPage();
                yPos = 20;
            }

            this.addSectionHeader(doc, 'NOTAS ADICIONALES', yPos, primaryColor, accentColor);
            yPos += 9;

            doc.autoTable({
                startY: yPos,
                body: [
                    [document.getElementById('notasAdicionales')?.value || 'Sin observaciones adicionales']
                ],
                theme: 'plain',
                styles: { fontSize: 8.5, cellPadding: 3, textColor: textDark, lineColor: borderColor, lineWidth: 0.2, valign: 'top', halign: 'left' },
                columnStyles: {
                    0: { cellWidth: 190, fillColor: [255, 255, 255] }
                },
                margin: { top: 0, right: 15, bottom: 0, left: 15 }
            });

            yPos = doc.lastAutoTable.finalY + 8;

            // VALORACIÓN FISIOTERAPIA DEPORTIVA
            this.addSectionHeader(doc, 'VALORACIÓN FISIOTERAPIA DEPORTIVA', yPos, primaryColor, accentColor);
            yPos += 9;

            doc.autoTable({
                startY: yPos,
                body: [
                    ['Postura:', document.getElementById('postura')?.value || '-'],
                    ['Marcha:', document.getElementById('marcha')?.value || '-'],
                    ['HODS:', document.getElementById('hods')?.value || '-'],
                    ['Lunge Test:', document.getElementById('lunge')?.value || '-'],
                    ['Observaciones:', document.getElementById('observaciones')?.value || '-']
                ],
                theme: 'plain',
                styles: { fontSize: 8.5, cellPadding: 3, textColor: textDark, lineColor: borderColor, lineWidth: 0.2 },
                columnStyles: {
                    0: { fontStyle: 'bold', textColor: primaryColor, cellWidth: 45, fillColor: bgLight },
                    1: { cellWidth: 145, fillColor: [255, 255, 255] }
                }
            });

            // ==================== PÁGINA 3: TESTS DE SALTO ====================
            if (this.tieneDatosSaltos()) {
                doc.addPage();
                yPos = 20;

                this.addSectionHeader(doc, 'TESTS DE SALTO', yPos, primaryColor, accentColor);
                yPos += 9;

                const saltosTypes = ['cmj', 'sj', 'dj', 'abralakov', 'cmj1-1'];
                const saltosNames = ['CMJ', 'SJ', 'DJ', 'Abralakov', 'CMJ 1-1'];
                const saltosBody = [];

                saltosTypes.forEach((type, index) => {
                    const row = [saltosNames[index]];
                    ['peso', 'altura', 'velocidad', 'tVuelo', 'q', 'caida', 'n', 'rfd'].forEach(col => {
                        const input = document.querySelector(`input[data-salto="${type}"][data-col="${col}"]`);
                        row.push(input?.value || '-');
                    });
                    saltosBody.push(row);
                });

                doc.autoTable({
                    startY: yPos,
                    head: [['Test', 'Peso', 'Altura', 'Vel.', 'T.Vuelo', 'Q', 'Caída', 'N', 'RFD']],
                    body: saltosBody,
                    theme: 'striped',
                    styles: { fontSize: 8.5, cellPadding: 3, textColor: textDark, halign: 'center' },
                    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold', halign: 'center' },
                    columnStyles: {
                        0: { fontStyle: 'bold', cellWidth: 30 },
                        1: { halign: 'center', cellWidth: 22 },
                        2: { halign: 'center', cellWidth: 22 },
                        3: { halign: 'center', cellWidth: 20 },
                        4: { halign: 'center', cellWidth: 22 },
                        5: { halign: 'center', cellWidth: 18 },
                        6: { halign: 'center', cellWidth: 20 },
                        7: { halign: 'center', cellWidth: 18 },
                        8: { halign: 'center', cellWidth: 18 }
                    },
                    margin: { right: 15 }
                });

                yPos = doc.lastAutoTable.finalY + 10;
            }

            // FOOTER EN TODAS LAS PÁGINAS
            const pageCount = doc.getNumberOfPages();
            doc.setFontSize(7);
            doc.setTextColor(150, 160, 170);
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.text(`Página ${i} de ${pageCount}`, 195, 285, { align: 'right' });
                doc.text('KINETIQ SPORTS - Reporte Médico', 15, 285);
            }

            // Agregar imágenes adjuntas como nuevas páginas
            if (this.adjuntos && this.adjuntos.length > 0) {
                const imagenes = this.adjuntos.filter(a => a.tipo.startsWith('image/'));
                for (const imagen of imagenes) {
                    await this.agregarArchivoAlPDF(doc, imagen);
                }
            }

            // Exportar a bytes
            let pdfBytes = doc.output('arraybuffer');

            // Mergear PDFs adjuntos con pdf-lib
            if (this.adjuntos && this.adjuntos.some(a => a.tipo === 'application/pdf')) {
                if (!window.PDFLib) {
                    throw new Error('PDF-LIB no está cargado');
                }

                const { PDFDocument } = window.PDFLib;
                const mainDoc = await PDFDocument.load(pdfBytes);

                const pdfAdjuntos = this.adjuntos.filter(a => a.tipo === 'application/pdf');
                for (const adj of pdfAdjuntos) {
                    const base64Data = adj.data.split(',')[1];
                    const attachmentBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
                    const attachDoc = await PDFDocument.load(attachmentBytes);
                    const pages = await mainDoc.copyPages(attachDoc, attachDoc.getPageIndices());
                    pages.forEach(p => mainDoc.addPage(p));
                }

                pdfBytes = await mainDoc.save();
            }

            // Descargar el PDF resultante
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // Guardar en base de datos
            await this.guardarEnDB();
            
            // Cerrar modal
            document.getElementById('confirmModal').classList.remove('active');
            
            // Mostrar mensaje de éxito
            this.showAlert('✓ PDF descargado y datos guardados correctamente', 'success');
            
            // Redirigir a la página de bienvenida después de 2 segundos
            setTimeout(() => {
                window.location.href = 'bienvenida.html';
            }, 2000);

        } catch (error) {
            console.error('Error en generateAndSavePDF:', error);
            
            // Cerrar modal
            document.getElementById('confirmModal').classList.remove('active');
            
            this.showAlert('Error al generar PDF: ' + error.message, 'error');
        }
    }

    addSectionHeader(doc, title, yPos, primaryColor, accentColor) {
        // Ancho total para cubrir todo el ancho útil del documento
        doc.setFillColor(245, 248, 250);
        doc.rect(10, yPos, 194, 8, 'F');
        
        doc.setFillColor(...accentColor);
        doc.rect(10, yPos, 3, 8, 'F');
        
        doc.setFontSize(10);
        doc.setTextColor(...primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 15, yPos + 5.5);
    }

    async agregarArchivoAlPDF(doc, adjunto) {
        try {
            if (!adjunto?.tipo || !adjunto.tipo.startsWith('image/')) {
                // Solo manejamos imágenes aquí; PDFs se mergean con pdf-lib en otro paso
                return;
            }

            doc.addPage();
            
            const primaryColor = [15, 76, 129];
            const accentColor = [0, 184, 212];
            
            let yPos = 15;
            
            // Header
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, 210, 35, 'F');
            
            doc.setFillColor(...accentColor);
            doc.rect(0, 32, 210, 3, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('ANEXO ADJUNTO', 15, 20);
            
            yPos = 45;
            
            // Agregar la imagen
            const img = new Image();
            img.src = adjunto.data;

            await new Promise((resolve) => {
                img.onload = () => {
                    const maxWidth = 180; // mm
                    const maxHeight = 200; // mm
                    let { width, height } = img;

                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }

                    const xPos = (210 - width) / 2;
                    doc.addImage(adjunto.data, adjunto.tipo.split('/')[1].toUpperCase(), xPos, yPos, width, height);
                    resolve();
                };
            });
        } catch (error) {
            console.error('Error al agregar archivo adjunto:', error);
        }
    }

    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        document.body.insertBefore(alertDiv, document.body.firstChild);

        setTimeout(() => {
            alertDiv.style.opacity = '0';
            alertDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }

    // =========================================================================
    // SISTEMA DE MÚLTIPLES VALORACIONES
    // =========================================================================
    initMultipleValoraciones() {
        this.fuerzaComparativaList = [];
        this.rangoActivoList = [];

        // Botón Agregar Fuerza Comparativa
        const addFuerzaBtn = document.getElementById('addFuerzaBtn');
        if (addFuerzaBtn) {
            addFuerzaBtn.addEventListener('click', () => this.agregarFuerzaComparativa());
        }

        // Botón Agregar Rango Activo
        const addRAMBtn = document.getElementById('addRAMBtn');
        if (addRAMBtn) {
            addRAMBtn.addEventListener('click', () => this.agregarRangoActivo());
        }

        // Validación de solo números para inputs de fuerza
        const fuerzaInputs = [
            'fuerzaMaxIzq', 'fuerzaMaxDer', 'fuerzaMaxAsim',
            'rfdIzq', 'rfdDer', 'rfdAsim',
            'fatigaIzq', 'fatigaDer', 'fatigaAsim'
        ];
        fuerzaInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    this.restrictToNumbers(input, true);
                });
            }
        });

        // Validación de solo números para inputs de rango activo
        const ramInputs = ['anguloMaxIzq', 'anguloMaxDer', 'velocidadRADIzq', 'velocidadRADDer'];
        ramInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    this.restrictToNumbers(input, true);
                });
            }
        });

        // Validación para pasivo también
        const pasivoInputs = ['anguloPasivoIzq', 'anguloPasivoDer'];
        pasivoInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    this.restrictToNumbers(input, true);
                });
            }
        });
    }

    agregarFuerzaComparativa() {
        const musculo = document.getElementById('musculoFuerza').value.trim();
        const fuerzaMaxIzq = document.getElementById('fuerzaMaxIzq').value;
        const fuerzaMaxDer = document.getElementById('fuerzaMaxDer').value;
        const fuerzaMaxAsim = document.getElementById('fuerzaMaxAsim').value;
        const rfdIzq = document.getElementById('rfdIzq').value;
        const rfdDer = document.getElementById('rfdDer').value;
        const rfdAsim = document.getElementById('rfdAsim').value;
        const fatigaIzq = document.getElementById('fatigaIzq').value;
        const fatigaDer = document.getElementById('fatigaDer').value;
        const fatigaAsim = document.getElementById('fatigaAsim').value;

        if (!musculo) {
            this.showAlert('⚠️ Ingresa el nombre del músculo', 'warning');
            return;
        }

        const valoracion = {
            musculo,
            fuerzaMax: { izq: fuerzaMaxIzq, der: fuerzaMaxDer, asim: fuerzaMaxAsim },
            rfd: { izq: rfdIzq, der: rfdDer, asim: rfdAsim },
            fatiga: { izq: fatigaIzq, der: fatigaDer, asim: fatigaAsim }
        };

        this.fuerzaComparativaList.push(valoracion);
        this.renderFuerzaList();
        this.limpiarCamposFuerza();
        this.showAlert('✓ Valoración de fuerza agregada', 'success');

        // Guardar en hidden input
        document.getElementById('fuerzaComparativaData').value = JSON.stringify(this.fuerzaComparativaList);
    }

    agregarRangoActivo() {
        const articulacion = document.getElementById('articulacionRAM').value.trim();
        const anguloMaxIzq = document.getElementById('anguloMaxIzq').value;
        const anguloMaxDer = document.getElementById('anguloMaxDer').value;
        const velocidadRADIzq = document.getElementById('velocidadRADIzq').value;
        const velocidadRADDer = document.getElementById('velocidadRADDer').value;
        const anguloPasivoIzq = document.getElementById('anguloPasivoIzq').value;
        const anguloPasivoDer = document.getElementById('anguloPasivoDer').value;

        if (!articulacion) {
            this.showAlert('⚠️ Ingresa el nombre de la articulación', 'warning');
            return;
        }

        const valoracion = {
            articulacion,
            anguloMax: { izq: anguloMaxIzq, der: anguloMaxDer },
            velocidadRAD: { izq: velocidadRADIzq, der: velocidadRADDer },
            anguloPasivo: { izq: anguloPasivoIzq, der: anguloPasivoDer }
        };

        this.rangoActivoList.push(valoracion);
        this.renderRAMList();
        this.limpiarCamposRAM();
        this.showAlert('✓ Valoración de movimiento agregada', 'success');

        // Guardar en hidden input
        document.getElementById('rangoActivoData').value = JSON.stringify(this.rangoActivoList);
    }

    renderFuerzaList() {
        const listContainer = document.getElementById('fuerzaList');
        if (!listContainer) return;

        if (this.fuerzaComparativaList.length === 0) {
            listContainer.innerHTML = '';
            return;
        }

        let html = '<div style="margin-top: 20px;"><h3 style="color: #003A5D; font-size: 16px; margin-bottom: 10px;">Valoraciones Agregadas:</h3>';
        
        this.fuerzaComparativaList.forEach((val, index) => {
            html += `
                <div style="background: #f7fbfd; border-left: 4px solid #00C8D4; padding: 15px; margin-bottom: 10px; border-radius: 6px; position: relative;">
                    <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 5px;">
                        <button type="button" onclick="reporte.editarFuerza(${index})" 
                            style="background: #3498db; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; font-size: 12px;">
                            ✏️ Editar
                        </button>
                        <button type="button" onclick="reporte.eliminarFuerza(${index})" 
                            style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; font-size: 12px;">
                            🗑️ Eliminar
                        </button>
                    </div>
                    <p style="font-weight: 600; color: #003A5D; margin-bottom: 8px;">Músculo: ${val.musculo}</p>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 13px;">
                        <div><strong>Fuerza Max:</strong> I:${val.fuerzaMax.izq || '-'} D:${val.fuerzaMax.der || '-'} A:${val.fuerzaMax.asim || '-'}%</div>
                        <div><strong>RFD:</strong> I:${val.rfd.izq || '-'} D:${val.rfd.der || '-'} A:${val.rfd.asim || '-'}%</div>
                        <div><strong>Fatiga:</strong> I:${val.fatiga.izq || '-'} D:${val.fatiga.der || '-'} A:${val.fatiga.asim || '-'}%</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        listContainer.innerHTML = html;
    }

    renderRAMList() {
        const listContainer = document.getElementById('ramList');
        if (!listContainer) return;

        if (this.rangoActivoList.length === 0) {
            listContainer.innerHTML = '';
            return;
        }

        let html = '<div style="margin-top: 20px;"><h3 style="color: #003A5D; font-size: 16px; margin-bottom: 10px;">Valoraciones Agregadas:</h3>';
        
        this.rangoActivoList.forEach((val, index) => {
            html += `
                <div style="background: #f7fbfd; border-left: 4px solid #00C8D4; padding: 15px; margin-bottom: 10px; border-radius: 6px; position: relative;">
                    <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 5px;">
                        <button type="button" onclick="reporte.editarRAM(${index})" 
                            style="background: #3498db; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; font-size: 12px;">
                            ✏️ Editar
                        </button>
                        <button type="button" onclick="reporte.eliminarRAM(${index})" 
                            style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; font-size: 12px;">
                            🗑️ Eliminar
                        </button>
                    </div>
                    <p style="font-weight: 600; color: #003A5D; margin-bottom: 8px;">Articulación: ${val.articulacion}</p>
                    <div style="font-size: 13px;">
                        <div style="margin-bottom: 5px;"><strong>Ángulo Activo:</strong> Izq: ${val.anguloMax.izq || '-'}° Der: ${val.anguloMax.der || '-'}°</div>
                        <div style="margin-bottom: 5px;"><strong>Velocidad RAD:</strong> Izq: ${val.velocidadRAD.izq || '-'} Der: ${val.velocidadRAD.der || '-'}</div>
                        <div style="border-top: 1px solid #00C8D4; padding-top: 5px; margin-top: 5px;"><strong>Ángulo Pasivo:</strong> Izq: ${val.anguloPasivo.izq || '-'}° Der: ${val.anguloPasivo.der || '-'}°</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        listContainer.innerHTML = html;
    }

    editarFuerza(index) {
        const val = this.fuerzaComparativaList[index];
        
        // Cargar datos en los campos
        document.getElementById('musculoFuerza').value = val.musculo;
        document.getElementById('fuerzaMaxIzq').value = val.fuerzaMax.izq;
        document.getElementById('fuerzaMaxDer').value = val.fuerzaMax.der;
        document.getElementById('fuerzaMaxAsim').value = val.fuerzaMax.asim;
        document.getElementById('rfdIzq').value = val.rfd.izq;
        document.getElementById('rfdDer').value = val.rfd.der;
        document.getElementById('rfdAsim').value = val.rfd.asim;
        document.getElementById('fatigaIzq').value = val.fatiga.izq;
        document.getElementById('fatigaDer').value = val.fatiga.der;
        document.getElementById('fatigaAsim').value = val.fatiga.asim;
        
        // Eliminar de la lista (se volverá a agregar al hacer click en Agregar)
        this.fuerzaComparativaList.splice(index, 1);
        this.renderFuerzaList();
        document.getElementById('fuerzaComparativaData').value = JSON.stringify(this.fuerzaComparativaList);
        
        // Scroll al formulario
        document.getElementById('musculoFuerza').scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.showAlert('✏️ Editando valoración - Modifica y presiona "Agregar"', 'info');
    }

    editarRAM(index) {
        const val = this.rangoActivoList[index];
        
        // Cargar datos en los campos
        document.getElementById('articulacionRAM').value = val.articulacion;
        document.getElementById('anguloMaxIzq').value = val.anguloMax.izq;
        document.getElementById('anguloMaxDer').value = val.anguloMax.der;
        document.getElementById('velocidadRADIzq').value = val.velocidadRAD.izq;
        document.getElementById('anguloPasivoIzq').value = val.anguloPasivo?.izq || '';
        document.getElementById('anguloPasivoDer').value = val.anguloPasivo?.der || '';
        document.getElementById('velocidadRADDer').value = val.velocidadRAD.der;
        
        // Eliminar de la lista (se volverá a agregar al hacer click en Agregar)
        this.rangoActivoList.splice(index, 1);
        this.renderRAMList();
        document.getElementById('rangoActivoData').value = JSON.stringify(this.rangoActivoList);
        
        // Scroll al formulario
        document.getElementById('articulacionRAM').scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.showAlert('✏️ Editando valoración - Modifica y presiona "Agregar"', 'info');
    }

    eliminarFuerza(index) {
        this.fuerzaComparativaList.splice(index, 1);
        this.renderFuerzaList();
        document.getElementById('fuerzaComparativaData').value = JSON.stringify(this.fuerzaComparativaList);
        this.showAlert('✓ Valoración eliminada', 'success');
    }

    eliminarRAM(index) {
        this.rangoActivoList.splice(index, 1);
        this.renderRAMList();
        document.getElementById('rangoActivoData').value = JSON.stringify(this.rangoActivoList);
        this.showAlert('✓ Valoración eliminada', 'success');
    }

    limpiarCamposFuerza() {
        document.getElementById('musculoFuerza').value = '';
        document.getElementById('fuerzaMaxIzq').value = '';
        document.getElementById('fuerzaMaxDer').value = '';
        document.getElementById('fuerzaMaxAsim').value = '';
        document.getElementById('rfdIzq').value = '';
        document.getElementById('rfdDer').value = '';
        document.getElementById('rfdAsim').value = '';
        document.getElementById('fatigaIzq').value = '';
        document.getElementById('fatigaDer').value = '';
        document.getElementById('fatigaAsim').value = '';
    }

    limpiarCamposRAM() {
        document.getElementById('articulacionRAM').value = '';
        document.getElementById('anguloMaxIzq').value = '';
        document.getElementById('anguloMaxDer').value = '';
        document.getElementById('anguloPasivoIzq').value = '';
        document.getElementById('anguloPasivoDer').value = '';
        document.getElementById('velocidadRADIzq').value = '';
        document.getElementById('velocidadRADDer').value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Script cargado, inicializando ReporteMedico...');
    window.reporte = new ReporteMedico();
    console.log('ReporteMedico inicializado');
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReporteMedico;
}
