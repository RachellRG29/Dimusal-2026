/**
 * ubicacion-sv.js
 * DIMUSAL — Lógica de selects encadenados: Departamento → Distrito → Municipio
 * Uso: incluir antes del cierre de </body> en registro.html
 */

const MUNICIPIOS_SV = {
  Ahuachapán: {
    Norte: ["Atiquizaya", "El Refugio", "San Lorenzo", "Turín"],
    Centro: ["Ahuachapán", "Apaneca", "Concepción de Ataco", "Tacuba"],
    Sur: ["Guaymango", "Jujutla", "San Francisco Menéndez", "San Pedro Puxtla"],
  },
  "San Salvador": {
    Norte: ["Aguilares", "El Paisnal", "Guazapa"],
    Oeste: ["Apopa", "Nejapa"],
    Este: ["Ilopango", "San Martín", "Soyapango", "Tonacatepeque"],
    Centro: [
      "Ayutuxtepeque",
      "Mejicanos",
      "San Salvador",
      "Cuscatancingo",
      "Ciudad Delgado",
    ],
    Sur: [
      "Panchimalco",
      "Rosario de Mora",
      "San Marcos",
      "San Tomás",
      "Santiago Texacuangos",
    ],
  },
  "La Libertad": {
    Norte: ["Quezaltepeque", "San Matías", "San Pablo Tacachico"],
    Centro: ["San Juan Opico", "Ciudad Arce"],
    Oeste: ["Colón", "Jayaque", "Sacacoyo", "Tepecoyo", "Talnique"],
    Este: [
      "Antiguo Cuscatlán",
      "Huizúcar",
      "Nuevo Cuscatlán",
      "San José Villanueva",
      "Zaragoza",
    ],
    Costa: ["Chiltiupán", "Jicalapa", "La Libertad", "Tamanique", "Teotepeque"],
    Sur: ["Comasagua", "Santa Tecla"],
  },
  Chalatenango: {
    Norte: ["La Palma", "Citalá", "San Ignacio"],
    Centro: [
      "Nueva Concepción",
      "Tejutla",
      "La Reina",
      "Agua Caliente",
      "Dulce Nombre de María",
      "El Paraíso",
      "San Francisco Morazán",
      "San Rafael",
      "Santa Rita",
      "San Fernando",
    ],
    Sur: [
      "Chalatenango",
      "Arcatao",
      "Azacualpa",
      "Comalapa",
      "Concepción Quezaltepeque",
      "El Carrizal",
      "La Laguna",
      "Las Vueltas",
      "Nombre de Jesús",
      "Nueva Trinidad",
      "Ojos de Agua",
      "Potonico",
      "San Antonio de La Cruz",
      "San Antonio Los Ranchos",
      "San Francisco Lempa",
      "San Isidro Labrador",
      "San José Cancasque",
      "San Miguel de Mercedes",
      "San José Las Flores",
      "San Luis del Carmen",
    ],
  },
  Cuscatlán: {
    Norte: [
      "Suchitoto",
      "San José Guayabal",
      "Oratorio de Concepción",
      "San Bartolomé Perulapán",
      "San Pedro Perulapán",
    ],
    Sur: [
      "Cojutepeque",
      "San Rafael Cedros",
      "Candelaria",
      "Monte San Juan",
      "El Carmen",
      "San Cristóbal",
      "Santa Cruz Michapa",
      "San Ramón",
      "El Rosario",
      "Santa Cruz Analquito",
      "Tenancingo",
    ],
  },
  Cabañas: {
    Este: ["Sensuntepeque", "Victoria", "Dolores", "Guacotecti", "San Isidro"],
    Oeste: ["Ilobasco", "Tejutepeque", "Jutiapa", "Cinquera"],
  },
  "La Paz": {
    Oeste: [
      "Cuyultitán",
      "Olocuilta",
      "San Juan Talpa",
      "San Luis Talpa",
      "San Pedro Masahuat",
      "Tahuahualhuaca",
      "San Francisco Chinameca",
    ],
    Centro: [
      "El Rosario",
      "Jerusalén",
      "Mercedes La Ceiba",
      "Paraíso de Osorio",
      "San Antonio Masahuat",
      "San Emigdio",
      "San Juan Tepezontes",
      "San Luis La Herradura",
      "San Miguel Tepezontes",
      "San Pedro Nonualco",
      "Santa María Ostuma",
      "Santiago Nonualco",
    ],
    Este: ["San Juan Nonualco", "San Rafael Obrajuelo", "Zacatecoluca"],
  },
  "La Unión": {
    Norte: [
      "Anamorós",
      "Bolívar",
      "Concepción de Oriente",
      "El Sauce",
      "Lislique",
      "Nueva Esparta",
      "Pasaquina",
      "Polorós",
      "San José La Fuente",
      "Santa Rosa de Lima",
    ],
    Sur: [
      "Conchagua",
      "El Carmen",
      "Intipucá",
      "La Unión",
      "Meanguera del Golfo",
      "San Alejo",
      "Yayantique",
      "Yucuaiquín",
    ],
  },
  Usulután: {
    Norte: [
      "Santiago de María",
      "Alegría",
      "Berlín",
      "Mercedes Umaña",
      "Jucuapa",
      "El Triunfo",
      "Estanzuelas",
      "San Buenaventura",
      "Nueva Granada",
    ],
    Este: [
      "Usulután",
      "Jucuarán",
      "San Dionisio",
      "Concepción Batres",
      "Santa María",
      "Ozatlán",
      "Tecapán",
      "Santa Elena",
      "California",
      "Ereguayquín",
    ],
    Oeste: [
      "Jiquilisco",
      "Puerto El Triunfo",
      "San Agustín",
      "San Francisco Javier",
    ],
  },
  Sonsonate: {
    Norte: ["Juayúa", "Nahuizalco", "Salcoatitán", "Santa Catarina Masahuat"],
    Centro: [
      "Sonsonate",
      "Sonzacate",
      "Nahulingo",
      "San Antonio del Monte",
      "Santo Domingo de Guzmán",
    ],
    Este: [
      "Izalco",
      "Armenia",
      "Caluco",
      "San Julián",
      "Cuisnahuat",
      "Santa Isabel Ishuatán",
    ],
    Oeste: ["Acajutla"],
  },
  "Santa Ana": {
    Norte: ["Masahuat", "Metapán", "Santa Rosa Guachipilín", "Texistepeque"],
    Centro: ["Santa Ana"],
    Este: ["Coatepeque", "El Congo"],
    Oeste: [
      "Candelaria de la Frontera",
      "Chalchuapa",
      "El Porvenir",
      "San Antonio Pajonal",
      "San Sebastián Salitrillo",
      "Santiago de la Frontera",
    ],
  },
  "San Vicente": {
    Norte: [
      "Apastepeque",
      "Santa Clara",
      "San Ildefonso",
      "San Esteban Catarina",
      "San Lorenzo",
      "Santo Domingo",
    ],
    Sur: [
      "San Vicente",
      "Guadalupe",
      "Verapaz",
      "Tepetitán",
      "Tecoluca",
      "San Cayetano Istepeque",
    ],
  },
  "San Miguel": {
    Norte: [
      "Ciudad Barrios",
      "Sesori",
      "Nuevo Edén de San Juan",
      "San Gerardo",
      "San Luis de la Reina",
      "Carolina",
      "San Antonio del Mosco",
      "Chapeltique",
    ],
    Centro: [
      "San Miguel",
      "Comacarán",
      "Uluazapa",
      "Moncagua",
      "Quelepa",
      "Chirilagua",
    ],
    Oeste: [
      "Chinameca",
      "Nueva Guadalupe",
      "Lolotique",
      "San Jorge",
      "San Rafael Oriente",
      "El Tránsito",
    ],
  },
  Morazán: {
    Norte: [
      "Arambala",
      "Cacaopera",
      "Corinto",
      "El Rosario",
      "Joateca",
      "Jocoatique",
      "Meanguera",
      "Perquín",
      "San Fernando",
      "San Isidro",
      "Torola",
    ],
    Sur: [
      "Chilanga",
      "Delicias de Concepción",
      "El Divisadero",
      "Gualococti",
      "Guatajiagua",
      "Jocoro",
      "Lolotiquillo",
      "Osicala",
      "San Carlos",
      "San Francisco Gotera",
      "San Simón",
      "Sensembra",
      "Sociedad",
      "Yamabal",
      "Yoloaiquín",
    ],
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Limpia un <select> y agrega una opción placeholder deshabilitada.
 * @param {HTMLSelectElement} sel
 * @param {string} placeholder
 */
function resetSelect(sel, placeholder) {
  sel.innerHTML = "";
  const opt = document.createElement("option");
  opt.value = "";
  opt.disabled = true;
  opt.selected = true;
  opt.textContent = placeholder;
  sel.appendChild(opt);
  sel.disabled = true;
}

/**
 * Puebla un <select> con un array de strings.
 * @param {HTMLSelectElement} sel
 * @param {string[]} items
 */
function populateSelect(sel, items) {
  items.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    sel.appendChild(opt);
  });
  sel.disabled = false;
}

// ─── Init ────────────────────────────────────────────────────────────────────

function initUbicacionSelects() {
  const selDepto = document.getElementById("departamento");
  const selDistrito = document.getElementById("distrito"); // puede no existir
  const selMunicipio = document.getElementById("municipio");

  if (!selDepto || !selMunicipio) return; // salida segura si el HTML no está listo

  // 1. Poblar departamentos
  Object.keys(MUNICIPIOS_SV)
    .sort()
    .forEach((depto) => {
      const opt = document.createElement("option");
      opt.value = depto;
      opt.textContent = depto;
      selDepto.appendChild(opt);
    });

  // 2. Si existe el select de distrito, inicializarlo deshabilitado
  if (selDistrito) {
    resetSelect(selDistrito, "Seleccione un distrito");
  }
  resetSelect(selMunicipio, "Seleccione un municipio");
  // Quitar el disabled inicial del select municipio para que podamos re-añadir opciones
  selMunicipio.disabled = true;

  // 3. Cambio de departamento → poblar distritos (o municipios directamente)
  selDepto.addEventListener("change", () => {
    const depto = selDepto.value;
    const distritos = MUNICIPIOS_SV[depto];

    if (selDistrito) {
      // Modo con 3 selects: depto → distrito → municipio
      resetSelect(selDistrito, "Seleccione un distrito");
      resetSelect(selMunicipio, "Seleccione un municipio");

      if (distritos) {
        populateSelect(selDistrito, Object.keys(distritos).sort());
      }
    } else {
      // Modo con 2 selects: depto → municipio (todos los municipios del depto)
      resetSelect(selMunicipio, "Seleccione un municipio");
      if (distritos) {
        const todos = Object.values(distritos).flat().sort();
        populateSelect(selMunicipio, todos);
      }
    }
  });

  // 4. Cambio de distrito → poblar municipios (solo si existe selDistrito)
  if (selDistrito) {
    selDistrito.addEventListener("change", () => {
      const depto = selDepto.value;
      const distrito = selDistrito.value;
      resetSelect(selMunicipio, "Seleccione un municipio");

      const municipios = MUNICIPIOS_SV[depto]?.[distrito];
      if (municipios) {
        populateSelect(selMunicipio, [...municipios].sort());
      }
    });
  }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initUbicacionSelects);
} else {
  initUbicacionSelects();
}
