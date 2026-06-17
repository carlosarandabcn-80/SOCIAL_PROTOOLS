const socialResources = {
  Madrid: [
    {
      id: "mad-ss-primary",
      name: "Centros de Servicios Sociales municipales",
      category: "emergencia social",
      type: "administracion publica",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "contextoFamiliar", "redSocial"],
      description:
        "Puerta de entrada para informacion, valoracion, diagnostico social, prestaciones, acompanamiento y derivacion comunitaria.",
      url: "https://www.madrid.es/portales/munimadrid/es/Inicio/Servicios-sociales-y-salud/Servicios-sociales/Centros-de-Servicios-Sociales-Municipales/?vgnextchannel=70e4c8eb248fe410VgnVCM1000000b205a0aRCRD&vgnextoid=51886e0cfb6da010VgnVCM100000d90ca8c0RCRD"
    },
    {
      id: "mad-samur-social",
      name: "SAMUR Social",
      category: "emergencia social",
      type: "administracion publica",
      appliesTo: ["vulnerabilidad", "redSocial", "situacionEconomica"],
      description:
        "Atencion a urgencias sociales, sinhogarismo, perdida brusca de alojamiento y desproteccion severa.",
      url: "https://www.madrid.es/portales/munimadrid/es/Inicio/Servicios-sociales-y-salud/Servicios-sociales/SAMUR-Social-Emergencia-Social/?vgnextchannel=70e4c8eb248fe410VgnVCM1000000b205a0aRCRD&vgnextfmt=default&vgnextoid=1adba93209ee2810VgnVCM1000001d4a900aRCRD"
    },
    {
      id: "mad-salud",
      name: "Madrid Salud",
      category: "salud",
      type: "administracion publica",
      appliesTo: ["salud", "vulnerabilidad"],
      description:
        "Promocion de salud, prevencion, salud comunitaria y apoyo municipal en adicciones desde coordinacion socioeducativa.",
      url: "https://madridsalud.es/"
    },
    {
      id: "mad-dependencia",
      name: "Comunidad de Madrid - Dependencia",
      category: "dependencia",
      type: "administracion publica",
      appliesTo: ["dependencia", "salud"],
      description:
        "Informacion y acceso a reconocimiento de dependencia, prestaciones, servicios y apoyos para autonomia personal.",
      url: "https://www.comunidad.madrid/servicios/asuntos-sociales/dependencia"
    },
    {
      id: "mad-empleo",
      name: "Agencia para el Empleo de Madrid",
      category: "insercion",
      type: "administracion publica",
      appliesTo: ["situacionEconomica", "vulnerabilidad"],
      description:
        "Orientacion, formacion, intermediacion laboral e itinerarios de mejora de empleabilidad.",
      url: "https://saltaempleo.madrid.es/"
    },
    {
      id: "mad-cruz-roja",
      name: "Cruz Roja Comunidad de Madrid",
      category: "tercer sector",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description:
        "Apoyo social, inclusion, empleo, emergencia, personas mayores, infancia y acompañamiento comunitario.",
      url: "https://www2.cruzroja.es/"
    },
    {
      id: "mad-caritas",
      name: "Caritas Madrid",
      category: "emergencia social",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial", "contextoFamiliar"],
      description:
        "Acogida, acompanamiento social, empleo, vivienda, familia, mayores y cobertura de necesidades basicas.",
      url: "https://www.caritasmadrid.org/"
    },
    {
      id: "mad-secretariado-gitano",
      name: "Fundacion Secretariado Gitano",
      category: "insercion",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description:
        "Programas de empleo, educacion, vivienda, salud e igualdad de trato para poblacion gitana y personas vulnerables.",
      url: "https://www.gitanos.org/"
    },
    {
      id: "mad-tomillo",
      name: "Fundacion Tomillo",
      category: "infancia y juventud",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description:
        "Formacion, acompanamiento al empleo, prevencion del abandono escolar y desarrollo personal de jovenes en vulnerabilidad.",
      url: "https://tomillo.org/"
    },
    {
      id: "mad-hogar-si",
      name: "HOGAR SI",
      category: "emergencia social",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "redSocial", "situacionEconomica"],
      description:
        "Intervencion frente al sinhogarismo, acceso a vivienda, acompanamiento social y enfoque de derechos.",
      url: "https://hogarsi.org/"
    },
    {
      id: "mad-manantial",
      name: "Fundacion Manantial",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "dependencia", "vulnerabilidad", "redSocial"],
      description:
        "Apoyos comunitarios, empleo, vivienda y recuperacion para personas con problemas de salud mental.",
      url: "https://www.fundacionmanantial.org/"
    },
    {
      id: "mad-plena-inclusion",
      name: "Plena Inclusion Madrid",
      category: "dependencia",
      type: "tercer sector",
      appliesTo: ["dependencia", "salud", "vulnerabilidad", "contextoFamiliar"],
      description:
        "Apoyos a personas con discapacidad intelectual o del desarrollo y sus familias desde un enfoque comunitario.",
      url: "https://plenainclusionmadrid.org/"
    }
  ],
  Barcelona: [
    {
      id: "bcn-ss-primary",
      name: "Centres de Serveis Socials",
      category: "emergencia social",
      type: "administracion publica",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "contextoFamiliar", "redSocial"],
      description:
        "Atencion social primaria para diagnostico social, prestaciones, acompanamiento y derivacion especializada.",
      url: "https://ajuntament.barcelona.cat/serveissocials/"
    },
    {
      id: "bcn-activa",
      name: "Barcelona Activa",
      category: "insercion",
      type: "administracion publica",
      appliesTo: ["situacionEconomica", "vulnerabilidad"],
      description:
        "Orientacion laboral, formacion, emprendimiento e itinerarios de insercion sociolaboral.",
      url: "https://www.barcelonactiva.cat/"
    },
    {
      id: "bcn-sjd",
      name: "Sant Joan de Deu Serveis Socials Barcelona",
      category: "emergencia social",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "redSocial", "situacionEconomica"],
      description:
        "Atencion social e inclusion residencial para personas en situacion de sinhogarismo o exclusion severa.",
      url: "https://www.sjdserveissocials-bcn.org/es"
    },
    {
      id: "bcn-pere-claver",
      name: "Pere Claver Grup",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "dependencia", "vulnerabilidad"],
      description:
        "Servicios sociales, salud mental, apoyos comunitarios, derechos y acompanamiento a personas vulnerables.",
      url: "https://www.pereclaver.org/"
    },
    {
      id: "bcn-dependencia",
      name: "Generalitat de Catalunya - Servicios sociales y dependencia",
      category: "dependencia",
      type: "administracion publica",
      appliesTo: ["dependencia", "salud"],
      description:
        "Informacion sobre servicios sociales, dependencia, discapacidad, cuidados y prestaciones.",
      url: "https://web.gencat.cat/es/ciutadania/serveis/serveis-socials/"
    },
    {
      id: "bcn-fsyc",
      name: "Fundacion Salud y Comunidad",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "vulnerabilidad", "situacionEconomica"],
      description:
        "Intervencion en adicciones, salud, inclusion social, empleo, mayores y violencia machista.",
      url: "https://www.fsyc.org/"
    },
    {
      id: "bcn-creu-roja",
      name: "Creu Roja Catalunya",
      category: "tercer sector",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial", "salud"],
      description:
        "Intervencion social, empleo, salud, mayores, infancia, emergencia y acompanamiento comunitario.",
      url: "https://www2.cruzroja.es/web/creu-roja-catalunya"
    },
    {
      id: "bcn-caritas",
      name: "Caritas Diocesana de Barcelona",
      category: "emergencia social",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "contextoFamiliar", "redSocial"],
      description:
        "Acogida, familia e infancia, migraciones, empleo, vivienda, mayores y cobertura de necesidades basicas.",
      url: "https://caritas.barcelona/es/"
    },
    {
      id: "bcn-arrels",
      name: "Arrels Fundacio",
      category: "emergencia social",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "redSocial", "situacionEconomica"],
      description:
        "Atencion a personas sin hogar, centro abierto, equipos de calle, orientacion y sensibilizacion comunitaria.",
      url: "https://www.arrelsfundacio.org/es/personas-sin-hogar/"
    },
    {
      id: "bcn-adsis",
      name: "Fundacion Adsis Barcelona",
      category: "infancia y juventud",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description:
        "Apoyo educativo, formacion, empleo y acompanamiento a adolescentes y jovenes en riesgo de exclusion.",
      url: "https://www.fundacionadsis.org/es/barcelona"
    },
    {
      id: "bcn-ocupacio-inclusiva",
      name: "Barcelona Activa - Ocupacion inclusiva",
      category: "insercion",
      type: "administracion publica",
      appliesTo: ["situacionEconomica", "vulnerabilidad", "salud"],
      description:
        "Itinerarios individualizados y asesoramiento ocupacional adaptado a personas con especiales dificultades de insercion.",
      url: "https://treball.barcelonactiva.cat/es/empleabilidad-inclusiva"
    },
    {
      id: "bcn-fundacio-joia",
      name: "A prop Jove - Barcelona Activa / Fundacio Joia",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "situacionEconomica", "redSocial", "vulnerabilidad"],
      description:
        "Insercion sociolaboral para jovenes con malestar psicologico desde una mirada social, sanitaria y comunitaria.",
      url: "https://treball.barcelonactiva.cat/es/a-prop-jove"
    }
  ],
  Sevilla: [
    {
      id: "sev-ss-primary",
      name: "Servicios Sociales del Ayuntamiento de Sevilla",
      category: "emergencia social",
      type: "administracion publica",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "contextoFamiliar", "redSocial"],
      description:
        "Red municipal de atencion social primaria, informacion, valoracion, prestaciones e intervencion comunitaria.",
      url: "https://www.sevilla.org/servicios/servicios-sociales"
    },
    {
      id: "sev-junta-social",
      name: "Sistema Publico de Servicios Sociales de Andalucia",
      category: "emergencia social",
      type: "administracion publica",
      appliesTo: ["vulnerabilidad", "dependencia", "contextoFamiliar"],
      description:
        "Marco publico andaluz para proteccion social, promocion, prevencion, servicios comunitarios y prestaciones.",
      url: "https://www.juntadeandalucia.es/organismos/inclusionsocialjuventudfamiliaseigualdad/areas/inclusion/servicios-comunitarios.html"
    },
    {
      id: "sev-emergencia",
      name: "Diputacion de Sevilla - Emergencias Sociales",
      category: "emergencia social",
      type: "administracion publica",
      appliesTo: ["vulnerabilidad", "situacionEconomica"],
      description:
        "Prestaciones y programas de emergencia social para situaciones de necesidad economica o social urgente.",
      url: "https://www.dipusevilla.es/temas/asuntos-sociales-e-igualdad/emergencias-sociales/"
    },
    {
      id: "sev-andalucia-orienta",
      name: "Andalucia Orienta",
      category: "insercion",
      type: "administracion publica",
      appliesTo: ["situacionEconomica", "vulnerabilidad"],
      description:
        "Orientacion profesional y acompanamiento a la insercion laboral en Andalucia.",
      url: "https://www.juntadeandalucia.es/organismos/empleoempresaytrabajoautonomo.html"
    },
    {
      id: "sev-cruz-roja",
      name: "Cruz Roja Sevilla",
      category: "tercer sector",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "redSocial", "situacionEconomica", "salud"],
      description:
        "Programas de inclusion social, empleo, salud, personas mayores, infancia y emergencias.",
      url: "https://www2.cruzroja.es/"
    },
    {
      id: "sev-caritas",
      name: "Caritas Diocesana de Sevilla",
      category: "tercer sector",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description:
        "Acogida, acompanamiento, inclusion, apoyo a familias, vivienda, empleo y cobertura de necesidades basicas.",
      url: "https://www.archisevilla.org/caritas/"
    },
    {
      id: "sev-don-bosco",
      name: "Fundacion Don Bosco Sevilla",
      category: "infancia y juventud",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description:
        "Pisos de autonomia, acompanamiento, formacion e insercion laboral para jovenes en vulnerabilidad o exclusion social.",
      url: "https://fundaciondonbosco.es/fundacion-don-bosco-sevilla/"
    },
    {
      id: "sev-proyecto-hombre",
      name: "Proyecto Hombre Sevilla",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "vulnerabilidad", "contextoFamiliar", "redSocial"],
      description:
        "Atencion integral, rehabilitacion, prevencion y acompanamiento familiar ante adicciones con y sin sustancias.",
      url: "https://proyectohombresevilla.com/"
    },
    {
      id: "sev-dependencia-assda",
      name: "Agencia de Servicios Sociales y Dependencia de Andalucia",
      category: "dependencia",
      type: "administracion publica",
      appliesTo: ["dependencia", "salud", "vulnerabilidad"],
      description:
        "Informacion y gestion relacionada con dependencia, servicios sociales especializados y apoyos a la autonomia.",
      url: "https://www.juntadeandalucia.es/agenciadeserviciossocialesydependencia/"
    },
    {
      id: "sev-sae-orienta",
      name: "SAE - Programa Andalucia Orienta",
      category: "insercion",
      type: "administracion publica",
      appliesTo: ["situacionEconomica", "vulnerabilidad"],
      description:
        "Orientacion laboral, itinerarios personalizados, tecnicas de busqueda de empleo y acompanamiento a la insercion.",
      url: "https://www.juntadeandalucia.es/organismos/sae/areas/mejora-empleabilidad/andalucia-orienta.html"
    },
    {
      id: "sev-cocemfe",
      name: "COCEMFE Sevilla - Orientacion profesional",
      category: "dependencia",
      type: "tercer sector",
      appliesTo: ["dependencia", "salud", "situacionEconomica", "vulnerabilidad"],
      description:
        "Itinerarios personalizados de insercion, orientacion laboral y acompanamiento para personas con discapacidad.",
      url: "https://cocemfesevilla.es/que-hacemos/empleo/orientacion-profesional"
    },
    {
      id: "sev-centros-sinhogar",
      name: "Ayuntamiento de Sevilla - Centros para personas sin hogar",
      category: "emergencia social",
      type: "administracion publica",
      appliesTo: ["vulnerabilidad", "redSocial", "situacionEconomica"],
      description:
        "Acceso municipal a centros y recursos de atencion a personas sin hogar o en exclusion residencial.",
      url: "https://www.sevilla.org/servicios/servicios-sociales/centros"
    }
  ]
};

const supplementalResources = {
  Madrid: [
    {
      id: "mad-red-salud-mental",
      name: "Comunidad de Madrid - Red de salud mental",
      category: "salud",
      type: "administracion publica",
      appliesTo: ["salud", "vulnerabilidad", "redSocial"],
      description: "Red publica de apoyo social a personas con trastorno mental grave.",
      url: "https://www.comunidad.madrid/asuntos-sociales/red-atencion-social-personas-enfermedad-mental"
    },
    {
      id: "mad-salud-mental-sanidad",
      name: "Comunidad de Madrid - Salud mental",
      category: "salud",
      type: "administracion publica",
      appliesTo: ["salud", "vulnerabilidad"],
      description: "Informacion sanitaria y acceso a recursos de salud mental.",
      url: "https://www.comunidad.madrid/servicios/salud/salud-mental"
    },
    {
      id: "mad-federacion-salud-mental",
      name: "Federacion Salud Mental Madrid",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "redSocial", "vulnerabilidad"],
      description: "Asociaciones de apoyo a personas con problemas de salud mental y familias.",
      url: "https://saludmentalmadrid.org/"
    },
    {
      id: "mad-proyecto-hombre",
      name: "Proyecto Hombre Madrid",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "vulnerabilidad", "contextoFamiliar"],
      description: "Tratamiento, prevencion y apoyo familiar en adicciones.",
      url: "https://www.proyectohombremadrid.org/"
    },
    {
      id: "mad-fad-juventud",
      name: "FAD Juventud",
      category: "infancia y juventud",
      type: "tercer sector",
      appliesTo: ["salud", "redSocial", "vulnerabilidad"],
      description: "Prevencion, educacion y promocion de salud en jovenes.",
      url: "https://fad.es/"
    },
    {
      id: "mad-accem",
      name: "Accem Madrid",
      category: "migracion",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description: "Acogida, inclusion y apoyo a personas migrantes y refugiadas.",
      url: "https://www.accem.es/"
    },
    {
      id: "mad-cear",
      name: "CEAR Madrid",
      category: "migracion",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description: "Asilo, refugio, acompanamiento juridico-social e inclusion.",
      url: "https://www.cear.es/delegaciones/madrid/"
    },
    {
      id: "mad-provivienda",
      name: "Provivienda",
      category: "vivienda",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description: "Programas de vivienda e inclusion residencial.",
      url: "https://www.provivienda.org/"
    },
    {
      id: "mad-fundacion-raices",
      name: "Fundacion Raices",
      category: "infancia y juventud",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "contextoFamiliar", "redSocial"],
      description: "Apoyo juridico y social a infancia y juventud vulnerable.",
      url: "https://fundacionraices.org/"
    },
    {
      id: "mad-nuevo-futuro",
      name: "Nuevo Futuro",
      category: "infancia y juventud",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "contextoFamiliar"],
      description: "Proteccion, acogimiento y apoyo a infancia y jovenes.",
      url: "https://www.nuevofuturo.org/"
    },
    {
      id: "mad-apoyo-positivo",
      name: "Apoyo Positivo",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "vulnerabilidad", "redSocial"],
      description: "Salud comunitaria, VIH, diversidad y acompanamiento psicosocial.",
      url: "https://apoyopositivo.org/"
    },
    {
      id: "mad-fundacion-adsis",
      name: "Fundacion Adsis Madrid",
      category: "infancia y juventud",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description: "Formacion, empleo y apoyo socioeducativo a jovenes.",
      url: "https://www.fundacionadsis.org/es/madrid"
    },
    {
      id: "mad-grupo5",
      name: "Grupo 5",
      category: "salud",
      type: "empresa tercer sector",
      appliesTo: ["salud", "dependencia", "vulnerabilidad"],
      description: "Servicios sociales, educativos y sociosanitarios.",
      url: "https://www.grupo5.net/"
    },
    {
      id: "mad-intress",
      name: "Intress",
      category: "tercer sector",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "salud", "dependencia"],
      description: "Servicios sociales y acompanamiento a personas vulnerables.",
      url: "https://intress.org/es/"
    },
    {
      id: "mad-cocemfe",
      name: "COCEMFE Madrid",
      category: "dependencia",
      type: "tercer sector",
      appliesTo: ["dependencia", "salud", "situacionEconomica"],
      description: "Apoyo a personas con discapacidad fisica y organica.",
      url: "https://www.cocemfe.es/"
    },
    {
      id: "mad-once",
      name: "ONCE Madrid",
      category: "dependencia",
      type: "tercer sector",
      appliesTo: ["dependencia", "situacionEconomica", "redSocial"],
      description: "Apoyo a personas ciegas o con discapacidad visual.",
      url: "https://www.once.es/"
    },
    {
      id: "mad-fundacion-adecco",
      name: "Fundacion Adecco",
      category: "insercion",
      type: "tercer sector",
      appliesTo: ["situacionEconomica", "vulnerabilidad", "dependencia"],
      description: "Empleo para personas con discapacidad o riesgo de exclusion.",
      url: "https://fundacionadecco.org/"
    },
    {
      id: "mad-incorpora",
      name: "Programa Incorpora",
      category: "insercion",
      type: "tercer sector",
      appliesTo: ["situacionEconomica", "vulnerabilidad", "salud"],
      description: "Intermediacion laboral e inclusion sociolaboral.",
      url: "https://www.incorpora.org/"
    },
    {
      id: "mad-fundacion-atenenea",
      name: "Fundacion Atenea",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "vulnerabilidad", "redSocial"],
      description: "Intervencion social, salud y adicciones.",
      url: "https://fundacionatenea.org/"
    },
    {
      id: "mad-diaconia",
      name: "Diaconia Espana",
      category: "emergencia social",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description: "Inclusion, emergencia social, trata, empleo y familias.",
      url: "https://diaconia.es/"
    }
  ],
  Barcelona: [
    {
      id: "bcn-cuesb",
      name: "CUESB - Urgencias sociales Barcelona",
      category: "emergencia social",
      type: "administracion publica",
      appliesTo: ["vulnerabilidad", "redSocial", "situacionEconomica"],
      description: "Centro municipal de urgencias y emergencias sociales.",
      url: "https://ajuntament.barcelona.cat/serveissocials/"
    },
    {
      id: "bcn-salut-mental-catalunya",
      name: "Salut Mental Catalunya",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "redSocial", "vulnerabilidad"],
      description: "Federacion y apoyo comunitario en salud mental.",
      url: "https://www.salutmental.org/"
    },
    {
      id: "bcn-projecte-home",
      name: "Projecte Home Catalunya",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "vulnerabilidad", "contextoFamiliar"],
      description: "Atencion y prevencion de adicciones.",
      url: "https://www.projectehome.cat/"
    },
    {
      id: "bcn-abd",
      name: "ABD",
      category: "tercer sector",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "salud", "redSocial"],
      description: "Adicciones, inclusion, migracion, salud y dependencia.",
      url: "https://abd.ong/"
    },
    {
      id: "bcn-intress",
      name: "Intress Barcelona",
      category: "tercer sector",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "salud", "dependencia"],
      description: "Servicios sociales y acompanamiento comunitario.",
      url: "https://intress.org/es/"
    },
    {
      id: "bcn-assis",
      name: "ASSIS Centre d'Acollida",
      category: "emergencia social",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "redSocial", "situacionEconomica"],
      description: "Atencion a personas sin hogar.",
      url: "https://www.assis.cat/"
    },
    {
      id: "bcn-casal-infants",
      name: "Casal dels Infants",
      category: "infancia y juventud",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "contextoFamiliar", "redSocial"],
      description: "Accion socioeducativa con infancia, jovenes y familias.",
      url: "https://www.casaldelsinfants.org/"
    },
    {
      id: "bcn-fundacio-ires",
      name: "Fundacio IRES",
      category: "tercer sector",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "contextoFamiliar", "redSocial"],
      description: "Atencion social, familias, violencia y vulnerabilidad.",
      url: "https://www.fundacioires.org/"
    },
    {
      id: "bcn-acollida-esperanca",
      name: "Fundacio Acollida i Esperanca",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "vulnerabilidad", "redSocial"],
      description: "Acompanamiento residencial y social en VIH y exclusion.",
      url: "https://www.acollida.org/"
    },
    {
      id: "bcn-suara",
      name: "Suara Cooperativa",
      category: "dependencia",
      type: "empresa tercer sector",
      appliesTo: ["dependencia", "vulnerabilidad", "contextoFamiliar"],
      description: "Servicios de cuidados, inclusion y accion social.",
      url: "https://www.suara.coop/"
    },
    {
      id: "bcn-insercoop",
      name: "Insercoop",
      category: "insercion",
      type: "tercer sector",
      appliesTo: ["situacionEconomica", "vulnerabilidad", "redSocial"],
      description: "Orientacion, formacion e insercion laboral.",
      url: "https://www.insercoop.com/"
    },
    {
      id: "bcn-arep",
      name: "AREP",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "redSocial", "situacionEconomica"],
      description: "Rehabilitacion e inclusion de personas con salud mental.",
      url: "https://www.arep.cat/"
    },
    {
      id: "bcn-tres-turons",
      name: "Fundacio Els Tres Turons",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "redSocial", "situacionEconomica"],
      description: "Apoyo comunitario, recuperacion y empleo en salud mental.",
      url: "https://www.els3turons.org/"
    },
    {
      id: "bcn-aspasim",
      name: "Aspasim",
      category: "dependencia",
      type: "tercer sector",
      appliesTo: ["dependencia", "salud", "contextoFamiliar"],
      description: "Apoyos a personas con discapacidad intelectual grave.",
      url: "https://www.aspasim.es/"
    },
    {
      id: "bcn-dincat",
      name: "Dincat",
      category: "dependencia",
      type: "tercer sector",
      appliesTo: ["dependencia", "vulnerabilidad", "redSocial"],
      description: "Federacion de discapacidad intelectual en Catalunya.",
      url: "https://www.dincat.cat/"
    },
    {
      id: "bcn-acathi",
      name: "ACATHI",
      category: "migracion",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "redSocial", "salud"],
      description: "Apoyo a personas migrantes y refugiadas LGTBIQ+.",
      url: "https://www.acathi.org/"
    },
    {
      id: "bcn-surt",
      name: "Fundacio Surt",
      category: "mujer",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description: "Insercion, empoderamiento y atencion a mujeres.",
      url: "https://www.surt.org/"
    },
    {
      id: "bcn-prohabitatge",
      name: "Associacio ProHabitatge",
      category: "vivienda",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "situacionEconomica"],
      description: "Programas de vivienda e inclusion residencial.",
      url: "https://www.prohabitatge.org/"
    },
    {
      id: "bcn-incorpora",
      name: "Programa Incorpora Catalunya",
      category: "insercion",
      type: "tercer sector",
      appliesTo: ["situacionEconomica", "vulnerabilidad", "salud"],
      description: "Intermediacion laboral para personas vulnerables.",
      url: "https://www.incorpora.org/"
    },
    {
      id: "bcn-fundacio-privada-avis",
      name: "Amics de la Gent Gran",
      category: "dependencia",
      type: "tercer sector",
      appliesTo: ["dependencia", "redSocial", "vulnerabilidad"],
      description: "Acompanamiento a personas mayores y soledad no deseada.",
      url: "https://amicsdelagentgran.org/"
    }
  ],
  Sevilla: [
    {
      id: "sev-sevilla-acoge",
      name: "Sevilla Acoge",
      category: "migracion",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "redSocial", "situacionEconomica"],
      description: "Acogida e inclusion de personas migrantes.",
      url: "https://sevillaacoge.org/"
    },
    {
      id: "sev-andalucia-acoge",
      name: "Andalucia Acoge",
      category: "migracion",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "redSocial", "situacionEconomica"],
      description: "Red andaluza de acogida, derechos e inclusion.",
      url: "https://acoge.org/"
    },
    {
      id: "sev-accem",
      name: "Accem Andalucia",
      category: "migracion",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description: "Acogida e inclusion de personas migrantes y refugiadas.",
      url: "https://www.accem.es/"
    },
    {
      id: "sev-cear",
      name: "CEAR Andalucia",
      category: "migracion",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description: "Asilo, refugio y acompanamiento juridico-social.",
      url: "https://www.cear.es/delegaciones/andalucia/"
    },
    {
      id: "sev-fsg",
      name: "Fundacion Secretariado Gitano Andalucia",
      category: "insercion",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description: "Empleo, educacion e inclusion de poblacion gitana.",
      url: "https://www.gitanos.org/donde/andalucia/"
    },
    {
      id: "sev-asaenes",
      name: "ASAENES Salud Mental Sevilla",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "redSocial", "vulnerabilidad"],
      description: "Apoyo a personas con problemas de salud mental y familias.",
      url: "https://asaenes.org/"
    },
    {
      id: "sev-faisem",
      name: "FAISEM",
      category: "salud",
      type: "administracion publica",
      appliesTo: ["salud", "dependencia", "redSocial"],
      description: "Apoyo social a personas con trastorno mental grave.",
      url: "https://www.juntadeandalucia.es/organismos/faisem.html"
    },
    {
      id: "sev-salud-mental-junta",
      name: "Junta de Andalucia - Salud mental",
      category: "salud",
      type: "administracion publica",
      appliesTo: ["salud", "vulnerabilidad"],
      description: "Informacion y recursos sanitarios de salud mental.",
      url: "https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/el-sas/servicios-y-centros/salud-mental"
    },
    {
      id: "sev-adicciones-junta",
      name: "Junta de Andalucia - Adicciones",
      category: "salud",
      type: "administracion publica",
      appliesTo: ["salud", "vulnerabilidad", "contextoFamiliar"],
      description: "Prevencion y atencion a drogodependencias y adicciones.",
      url: "https://www.juntadeandalucia.es/temas/salud/apoyo/adicciones.html"
    },
    {
      id: "sev-autismo",
      name: "Autismo Sevilla",
      category: "dependencia",
      type: "tercer sector",
      appliesTo: ["dependencia", "salud", "contextoFamiliar"],
      description: "Apoyos especializados a personas con autismo y familias.",
      url: "https://www.autismosevilla.org/"
    },
    {
      id: "sev-down",
      name: "Down Sevilla",
      category: "dependencia",
      type: "tercer sector",
      appliesTo: ["dependencia", "salud", "redSocial"],
      description: "Apoyo a personas con sindrome de Down y familias.",
      url: "https://www.downsevilla.org/"
    },
    {
      id: "sev-hogar-si",
      name: "HOGAR SI Andalucia",
      category: "emergencia social",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "redSocial", "situacionEconomica"],
      description: "Intervencion frente al sinhogarismo.",
      url: "https://hogarsi.org/"
    },
    {
      id: "sev-fundacion-atenea",
      name: "Fundacion Atenea Andalucia",
      category: "salud",
      type: "tercer sector",
      appliesTo: ["salud", "vulnerabilidad", "redSocial"],
      description: "Intervencion social, salud y adicciones.",
      url: "https://fundacionatenea.org/"
    },
    {
      id: "sev-cepaim",
      name: "Fundacion Cepaim",
      category: "migracion",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "redSocial"],
      description: "Convivencia, inclusion, migraciones y empleo.",
      url: "https://www.cepaim.org/"
    },
    {
      id: "sev-mpdl",
      name: "Movimiento por la Paz - MPDL",
      category: "migracion",
      type: "ONG",
      appliesTo: ["vulnerabilidad", "redSocial", "situacionEconomica"],
      description: "Derechos, inclusion social, migracion y apoyo comunitario.",
      url: "https://www.mpdl.org/"
    },
    {
      id: "sev-diaconia",
      name: "Diaconia Sevilla",
      category: "emergencia social",
      type: "tercer sector",
      appliesTo: ["vulnerabilidad", "situacionEconomica", "contextoFamiliar"],
      description: "Inclusion, emergencia social, empleo y familias.",
      url: "https://diaconia.es/"
    },
    {
      id: "sev-paz-bien",
      name: "Paz y Bien",
      category: "dependencia",
      type: "tercer sector",
      appliesTo: ["dependencia", "vulnerabilidad", "redSocial"],
      description: "Apoyos a personas con discapacidad y colectivos vulnerables.",
      url: "https://www.pazbien.org/"
    },
    {
      id: "sev-instituto-mujer",
      name: "Instituto Andaluz de la Mujer",
      category: "mujer",
      type: "administracion publica",
      appliesTo: ["vulnerabilidad", "redSocial", "contextoFamiliar"],
      description: "Informacion, derechos y apoyo a mujeres.",
      url: "https://www.juntadeandalucia.es/institutodelamujer/"
    },
    {
      id: "sev-obra-social-sjd",
      name: "Obra Social San Juan de Dios Sevilla",
      category: "dependencia",
      type: "tercer sector",
      appliesTo: ["dependencia", "salud", "vulnerabilidad"],
      description: "Apoyo social, discapacidad, mayores y salud.",
      url: "https://obrasocialsevilla.sjd.es/"
    },
    {
      id: "sev-incorpora",
      name: "Programa Incorpora Andalucia",
      category: "insercion",
      type: "tercer sector",
      appliesTo: ["situacionEconomica", "vulnerabilidad", "salud"],
      description: "Intermediacion laboral e inclusion sociolaboral.",
      url: "https://www.incorpora.org/"
    }
  ]
};

Object.entries(supplementalResources).forEach(([city, resources]) => {
  socialResources[city].push(...resources);
});

function normalizeCityKey(city = "") {
  const input = String(city || "").trim();
  return Object.keys(socialResources).find((key) => key.toLocaleLowerCase("es") === input.toLocaleLowerCase("es")) || input;
}

function recommendResources(city, variables = {}) {
  const cityKey = normalizeCityKey(city);
  const resources = socialResources[cityKey] || [];
  const activeKeys = Object.entries(variables)
    .filter(([, variable]) => variable?.active)
    .map(([key]) => key);

  return resources
    .map((resource) => {
      const match = resource.appliesTo.filter((key) => activeKeys.includes(key)).length;
      const severity = resource.appliesTo.reduce((sum, key) => sum + Number(variables[key]?.severity || 0), 0);
      return { ...resource, score: match * 10 + severity };
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

module.exports = { recommendResources, socialResources, normalizeCityKey };
