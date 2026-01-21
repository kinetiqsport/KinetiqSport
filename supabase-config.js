// Importar librería oficial de Supabase
const { createClient } = window.supabase || {};

// Configuración de Supabase
const SUPABASE_CONFIG = {
    url: 'https://adisallqgbylyffrvhzs.supabase.co',
    anonKey: window.SUPABASE_ANON_KEY || ''
};

// Cargar librería de Supabase si no está disponible
if (!window.supabase) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
        window.supabaseLoaded = true;
    };
    document.head.appendChild(script);
}

class SupabaseClient {
    constructor() {
        this.supabase = window.supabase?.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        if (!this.supabase) {
            console.error('Supabase no cargado correctamente');
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
window.supabase = new SupabaseClient();

// Reintentar si Supabase aún no está listo
setTimeout(() => {
    if (!window.supabase.supabase && window.supabase?.createClient) {
        window.supabase = new SupabaseClient();
    }
}, 1000);
