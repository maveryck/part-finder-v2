import '../style.css'; // Esta línea ahora apunta correctamente al style.css en la raíz

// --- Configuración de Supabase ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// --- Referencia al contenedor ---
const serverListContainer = document.querySelector('#server-list');
const mainTitle = document.querySelector('h1');

// --- Función principal ---
async function cargarYMostrarServidores() {
  if (!serverListContainer || !mainTitle) {
    console.error("Error: Elementos HTML principales no encontrados.");
    return;
  }
  
  if (!supabaseUrl || !supabaseKey) {
    mainTitle.textContent = 'Error de Configuración';
    serverListContainer.innerHTML = '<p style="color: red;">Las claves de la API de Supabase no están configuradas.</p>';
    return;
  }

  const apiUrl = `${supabaseUrl}/rest/v1/servidores?select=*`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error de red: ${response.statusText}`);
    }
    
    const servidores = await response.json();

    if (servidores.length > 0) {
      mainTitle.textContent = 'Lista de Servidores';
      const listaHtml = servidores.map(servidor => `
        <div class="servidor-item">
          <h2>${servidor.marca} ${servidor.nombre_modelo}</h2>
          <p>ID: ${servidor.id}</p>
        </div>
      `).join('');
      serverListContainer.innerHTML = listaHtml;
    } else {
      mainTitle.textContent = 'Base de Datos Vacía';
      serverListContainer.innerHTML = '<p>No se encontraron servidores.</p>';
    }

  } catch (error) {
    mainTitle.textContent = 'Error de Conexión';
    serverListContainer.innerHTML = `<p style="color: red;">${error}</p>`;
    console.error("Falló la obtención de servidores:", error);
  }
}

// --- Ejecutar la función ---
cargarYMostrarServidores();