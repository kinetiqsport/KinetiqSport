// Configuración de Supabase
// La clave se inyecta desde GitHub Secrets en supabase-secrets.js
const SUPABASE_CONFIG = {
    url: 'https://adisallqgbylyffrvhzs.supabase.co',
    anonKey: window.SUPABASE_ANON_KEY || ''
};

class SupabaseClient {
    constructor() {
        this.url = SUPABASE_CONFIG.url;
        this.apiKey = SUPABASE_CONFIG.anonKey;
        this.headers = {
            'Content-Type': 'application/json',
            'apikey': this.apiKey,
            'Authorization': `Bearer ${this.apiKey}`
        };
    }

    async saveReporte(data) {
        try {
            const response = await fetch(`${this.url}/rest/v1/reportes`, {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al guardar: ${response.statusText} - ${errorText}`);
            }

            const text = await response.text();
            return text ? JSON.parse(text) : null;
        } catch (error) {
            console.error('Error guardando reporte:', error);
            throw error;
        }
    }

    async updateReporte(cedula, data) {
        try {
            const response = await fetch(`${this.url}/rest/v1/reportes?cedula=eq.${cedula}`, {
                method: 'PATCH',
                headers: {
                    ...this.headers,
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al actualizar: ${response.statusText} - ${errorText}`);
            }

            const text = await response.text();
            return text ? JSON.parse(text) : null;
        } catch (error) {
            console.error('Error actualizando reporte:', error);
            throw error;
        }
    }

    async getReporteByCedula(cedula) {
        try {
            const response = await fetch(`${this.url}/rest/v1/reportes?cedula=eq.${cedula}`, {
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`Error al buscar: ${response.statusText}`);
            }

            const data = await response.json();
            return data.length > 0 ? data[0] : null;
        } catch (error) {
            console.error('Error buscando reporte:', error);
            throw error;
        }
    }

    async getAllReportes() {
        try {
            const response = await fetch(`${this.url}/rest/v1/reportes?select=*&order=fecha_modificacion.desc`, {
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`Error al listar: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error listando reportes:', error);
            throw error;
        }
    }
}

// Instancia global
window.supabase = new SupabaseClient();
