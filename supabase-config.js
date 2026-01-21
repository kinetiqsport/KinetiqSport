// Importar librería oficial de Supabase
let createClient = null;

// Configuración de Supabase
const SUPABASE_CONFIG = {
    url: 'https://adisallqgbylyffrvhzs.supabase.co',
    anonKey: window.SUPABASE_ANON_KEY || ''
};

// La librería se carga desde el CDN, se debe esperar a que esté lista
// El CDN carga a window.supabase.createClient

class SupabaseClient {
    constructor() {
        try {
            // La librería del CDN expone createClient en window.supabase
            if (!window.supabase || !window.supabase.createClient) {
                throw new Error('Supabase.createClient no disponible en window.supabase');
            }
            
            this.supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('✓ Supabase conectado correctamente');
        } catch (error) {
            console.error('Error inicializando Supabase:', error);
            this.supabase = null;
        }
    }

    async saveReporte(data) {
        try {
            const { data: result, error } = await this.supabase
                .from('reportes')
                .insert([data])
                .select();
            
            if (error) throw error;
            return result?.[0] || null;
        } catch (error) {
            console.error('Error guardando reporte:', error);
            throw error;
        }
    }

    async updateReporte(cedula, data) {
        try {
            const { data: result, error } = await this.supabase
                .from('reportes')
                .update(data)
                .eq('cedula', cedula)
                .select();
            
            if (error) throw error;
            return result?.[0] || null;
        } catch (error) {
            console.error('Error actualizando reporte:', error);
            throw error;
        }
    }

    async getReporteByCedula(cedula) {
        try {
            const { data, error } = await this.supabase
                .from('reportes')
                .select('*')
                .eq('cedula', cedula)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;
            return data || null;
        } catch (error) {
            console.error('Error buscando reporte:', error);
            throw error;
        }
    }

    async getAllReportes() {
        try {
            const { data, error } = await this.supabase
                .from('reportes')
                .select('*')
                .order('fecha_modificacion', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error listando reportes:', error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            if (error || !user) {
                console.warn('No hay usuario autenticado:', error);
                return null;
            }
            return user;
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
            return null;
        }
    }
}

// Instancia global con delay para asegurar carga de librería
function initSupabaseClient() {
    try {
        // Verificar que createClient esté disponible en window.supabase
        if (!window.supabase?.createClient) {
            console.log('⏳ Esperando que Supabase cargue...');
            setTimeout(initSupabaseClient, 300);
            return;
        }
        
        if (window.supabaseClient) {
            return; // Ya está inicializado
        }
        
        window.supabaseClient = new SupabaseClient();
    } catch (error) {
        console.error('❌ Error inicializando SupabaseClient:', error);
        setTimeout(initSupabaseClient, 500);
    }
}

// Esperar a que el DOM esté listo Y que la librería esté cargada
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initSupabaseClient, 100);
    });
} else {
    setTimeout(initSupabaseClient, 100);
}
