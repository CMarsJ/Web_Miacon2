"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Layers,
  Cpu,
  Radio,
  GitBranch,
  Plug,
  Download,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Key,
  ShieldCheck,
  Terminal,
  Wrench,
  Sparkles,
  Info,
  CheckSquare,
  Square,
  AlertCircle
} from "lucide-react";

interface SoftwareTool {
  id: string;
  name: string;
  version: string;
  category: string;
  icon: any;
  shortDesc: string;
  badge: string;
  badgeType: "license" | "free" | "cloud" | "advanced";
  requirements: string[];
  steps: {
    title: string;
    description: string;
    code?: string;
  }[];
  primaryAction: {
    label: string;
    url: string;
    isExternal: boolean;
  };
  docUrl?: string;
}

const TOOLS_DATA: SoftwareTool[] = [
  {
    id: "matlab",
    name: "MATLAB",
    version: "R2024b / R2023b",
    category: "Cálculo Numérico & Modelado",
    icon: Calculator,
    shortDesc: "Entorno estándar en ingeniería para análisis matemático, matrices y validación de funciones de transferencia.",
    badge: "Requiere Licencia Institucional",
    badgeType: "license",
    requirements: [
      "Windows 10/11 (64-bit)",
      "8 GB RAM mínimo (16 GB recomendado)",
      "30 GB de espacio libre en disco SSD",
      "Cuenta de correo institucional UIS"
    ],
    steps: [
      {
        title: "Paso 1: Acceso al Portal UIS",
        description: "Ingresa al portal de software institucional UIS o directamente a MathWorks utilizando tu correo institucional (@uis.edu.co o @correo.uis.edu.co)."
      },
      {
        title: "Paso 2: Descargar el MATLAB Installer",
        description: "Accede a mathworks.com/downloads e inicia sesión. Descarga el instalador online oficial para Windows."
      },
      {
        title: "Paso 3: Selección de Toolboxes Clave",
        description: "Durante el asistente de instalación, asegúrate de marcar los siguientes paquetes esenciales: Control System Toolbox, Signal Processing Toolbox, Optimization Toolbox y Simulink."
      },
      {
        title: "Paso 4: Activación y Verificación",
        description: "Inicia sesión en la aplicación instalada con tus credenciales UIS. En la consola ejecuta `ver` para comprobar los toolboxes instalados.",
        code: "ver % Muestra la versión y toolboxes instalados en tu equipo"
      }
    ],
    primaryAction: {
      label: "Descargar en MathWorks",
      url: "https://www.mathworks.com/downloads",
      isExternal: true
    },
    docUrl: "https://la.mathworks.com/help/matlab/"
  },
  {
    id: "simulink",
    name: "Simulink",
    version: "Integrado en MATLAB",
    category: "Simulación de Sistemas Dinámicos",
    icon: Layers,
    shortDesc: "Plataforma gráfica de diagramas de bloques para simulación multidominio y diseño basado en modelos para sistemas de control.",
    badge: "Incluido con MATLAB",
    badgeType: "license",
    requirements: [
      "Instalación base de MATLAB activa",
      "Control System Toolbox habilitado",
      "Tarjeta gráfica compatible con OpenGL"
    ],
    steps: [
      {
        title: "Paso 1: Verificar Instalación",
        description: "Si instalaste MATLAB siguiendo el asistente, Simulink ya estará disponible. Puedes abrirlo desde la pestaña 'Home' de MATLAB o desde la línea de comandos.",
        code: "simulink % Abre la biblioteca de bloques de Simulink"
      },
      {
        title: "Paso 2: Instalar Paquetes de Soporte de Hardware",
        description: "Ve a Add-Ons > Get Hardware Support Packages e instala 'MATLAB Support Package for Arduino Hardware' si deseas prototipar en tiempo real."
      },
      {
        title: "Paso 3: Probar Modelo de Primer Orden",
        description: "Crea un nuevo modelo en blanco, agrega un bloque 'Step', una función de transferencia 'Transfer Fcn' y un 'Scope' para comprobar la respuesta temporal."
      }
    ],
    primaryAction: {
      label: "Documentación Simulink",
      url: "https://la.mathworks.com/products/simulink.html",
      isExternal: true
    },
    docUrl: "https://la.mathworks.com/help/simulink/"
  },
  {
    id: "arduino",
    name: "Arduino IDE",
    version: "v2.3+",
    category: "Entorno de Programación de Microcontroladores",
    icon: Cpu,
    shortDesc: "Software de código abierto para compilar y cargar el firmware de control PID, adquisición analógica y telemetría en el módulo Miacon.",
    badge: "Descarga Gratuita",
    badgeType: "free",
    requirements: [
      "Windows 10/11 (64-bit)",
      "Puerto USB tipo A o C disponible",
      "Permisos de administrador para instalación de drivers"
    ],
    steps: [
      {
        title: "Paso 1: Descargar Arduino IDE 2.x",
        description: "Descarga el instalador oficial para Windows desde el sitio web oficial de Arduino."
      },
      {
        title: "Paso 2: Configurar URL de Tarjetas Adicionales",
        description: "Abre Preferencias (Ctrl + Coma) y en 'Gestor de URLs Adicionales de Tarjetas' añade el repositorio oficial según el microcontrolador de tu módulo Miacon."
      },
      {
        title: "Paso 3: Instalar el Gestor de Placas",
        description: "Abre el menú lateral de Tarjetas (Board Manager), busca e instala el paquete correspondiente (ej. ESP32 by Espressif o Arduino AVR Boards)."
      },
      {
        title: "Paso 4: Instalar Librerías de Control & MQTT",
        description: "En el Gestor de Librerías (Library Manager), instala 'PubSubClient' de Nick O'Leary y 'ArduinoJson' para el manejo de tramas de telemetría."
      }
    ],
    primaryAction: {
      label: "Descargar Arduino IDE",
      url: "https://www.arduino.cc/en/software",
      isExternal: true
    },
    docUrl: "https://docs.arduino.cc/"
  },
  {
    id: "drivers",
    name: "Drivers USB-Serial",
    version: "CH340 / CP2102",
    category: "Conectividad Hardware & Enlace COM",
    icon: Plug,
    shortDesc: "Controladores indispensables para que tu sistema operativo reconozca el puerto serie USB del microcontrolador Miacon.",
    badge: "Descarga Gratuita",
    badgeType: "free",
    requirements: [
      "Cables de datos micro-USB o USB-C certificados (no solo de carga)",
      "Reconocimiento de puerto en Administrador de Dispositivos"
    ],
    steps: [
      {
        title: "Paso 1: Identificar el Chip de Conversión",
        description: "Revisa el circuito integrado cercano al conector USB del Miacon. Comúnmente corresponde al integrado CH340C/G o Silicon Labs CP2102."
      },
      {
        title: "Paso 2: Descargar e Instalar el Controlador",
        description: "Para CH340 descarga el ejecutable CH341SER.EXE desde el fabricante WCH. Para CP210x descarga el instalador oficial de Silicon Labs."
      },
      {
        title: "Paso 3: Verificar en el Administrador de Dispositivos",
        description: "Conecta el módulo Miacon. Abre 'Administrador de Dispositivos > Puertos (COM y LPT)' y comprueba que aparezca asignado (ej. COM3, COM4) sin símbolos de advertencia amarillo."
      }
    ],
    primaryAction: {
      label: "Descargar Driver CH340",
      url: "http://www.wch-ic.com/downloads/CH341SER_EXE.html",
      isExternal: true
    },
    docUrl: "https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers"
  },
  {
    id: "mqtt",
    name: "MQTT Broker (HiveMQ)",
    version: "Cloud Serverless",
    category: "Telemetría IIoT & Red de Tiempo Real",
    icon: Radio,
    shortDesc: "Servicio de mensajería ligera pub/sub para enviar y recibir variables de proceso, consignas remotas y participar en competencias docentes.",
    badge: "Cloud Gratuito",
    badgeType: "cloud",
    requirements: [
      "Conexión a Internet activa (WiFi 2.4 GHz para el microcontrolador)",
      "Navegador web moderno para el cliente de prueba"
    ],
    steps: [
      {
        title: "Paso 1: Crear Cuenta en HiveMQ Cloud",
        description: "Regístrate en console.hivemq.cloud de forma gratuita para desplegar un cluster broker gestionado en la nube."
      },
      {
        title: "Paso 2: Obtener Credenciales de Conexión",
        description: "Crea credenciales de acceso (Usuario y Contraseña) y copia la dirección del host (ej. `xxxxxx.hivemq.cloud`) y el puerto TLS seguro (8883) o WebSockets (8884)."
      },
      {
        title: "Paso 3: Probar con el Web Client",
        description: "Utiliza la herramienta integrada 'Web Client' de HiveMQ para suscribirte al tópico `miacon/+/telemetria` y verificar la llegada de tramas JSON en vivo."
      }
    ],
    primaryAction: {
      label: "Crear Broker en HiveMQ",
      url: "https://www.hivemq.com/mqtt-cloud-broker/",
      isExternal: true
    },
    docUrl: "https://www.hivemq.com/docs/"
  },
  {
    id: "nodered",
    name: "Node-RED & Dashboard",
    version: "v3.x / v4.x",
    category: "Supervisión SCADA & Flujos IIoT",
    icon: GitBranch,
    shortDesc: "Herramienta de programación visual basada en nodos para crear dashboards de monitoreo, registros en base de datos y alarmas industriales.",
    badge: "Módulo Avanzado",
    badgeType: "advanced",
    requirements: [
      "Node.js versión LTS instalada (v18 o v20+)",
      "Navegador web (acceso local en localhost:1880)"
    ],
    steps: [
      {
        title: "Paso 1: Instalar Node.js",
        description: "Descarga e instala Node.js LTS desde nodejs.org marcando la opción de herramientas adicionales."
      },
      {
        title: "Paso 2: Instalar Node-RED Globalmente",
        description: "Abre una terminal o símbolo del sistema (PowerShell / CMD) y ejecuta el comando de instalación:",
        code: "npm install -g --unsafe-perm node-red"
      },
      {
        title: "Paso 3: Iniciar el Servidor Local",
        description: "En tu terminal escribe `node-red`. Una vez arrancado, abre tu navegador e ingresa a `http://localhost:1880`.",
        code: "node-red % Inicia el entorno visual de diseño de flujos"
      },
      {
        title: "Paso 4: Instalar la Paleta Dashboard",
        description: "En el menú superior derecho de Node-RED, ve a 'Manage palette > Install' y busca `@flowfuse/node-red-dashboard` o `node-red-dashboard`."
      }
    ],
    primaryAction: {
      label: "Ver Guía de Node-RED",
      url: "https://nodered.org/docs/getting-started/",
      isExternal: true
    },
    docUrl: "https://flows.nodered.org/"
  }
];

export default function Herramientas() {
  const [expandedId, setExpandedId] = useState<string | null>("matlab");
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    matlab: false,
    arduino: false,
    drivers: false,
    mqtt: false
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getBadgeStyle = (type: SoftwareTool["badgeType"]) => {
    switch (type) {
      case "license":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "free":
        return "bg-green-50 text-green-700 border-green-200";
      case "cloud":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "advanced":
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-10 space-y-12">
      {/* 1. HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 shadow-sm">
          <Wrench className="w-3.5 h-3.5 text-blue-700" />
          <span>Setup Hub • Centro de Instalación & Configuración</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Herramientas & <span className="text-blue-700">Setup Hub</span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Prepara tu entorno de trabajo antes de ingresar a los laboratorios prácticos.
          Aquí encontrarás instaladores, paquetes de simulación y licencias institucionales requeridas para operar el módulo <strong className="text-blue-800">MIACON 2.0</strong>.
        </p>
      </div>

      {/* 2. APP STORE SOFTWARE GRID */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Ecosistema de Software</h2>
            <p className="text-xs text-slate-500 font-medium">Haz clic en cada tarjeta para desplegar los pasos guiados de instalación</p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 self-start sm:self-auto">
            6 Herramientas Disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOLS_DATA.map((tool) => {
            const isExpanded = expandedId === tool.id;
            const ToolIcon = tool.icon;

            return (
              <div
                key={tool.id}
                className={`bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "border-blue-600 shadow-xl shadow-blue-900/5 ring-2 ring-blue-500/20"
                    : "border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Card Header (Clickable Accordion) */}
                <button
                  onClick={() => toggleExpand(tool.id)}
                  className="w-full text-left p-6 sm:p-7 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      isExpanded ? "bg-blue-700 text-white shadow-md shadow-blue-200" : "bg-blue-50 text-blue-700 border border-blue-100"
                    }`}>
                      <ToolIcon className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black text-slate-900">{tool.name}</h3>
                        <span className="text-xs font-mono font-bold text-slate-400">{tool.version}</span>
                      </div>
                      <p className="text-xs font-semibold text-blue-700">{tool.category}</p>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">{tool.shortDesc}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getBadgeStyle(tool.badgeType)}`}>
                      {tool.badge}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-slate-400 bg-slate-100 transition-transform ${
                      isExpanded ? "rotate-180 bg-blue-50 text-blue-700" : ""
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Expanded Accordion Content */}
                {isExpanded && (
                  <div className="px-6 sm:px-7 pb-7 pt-2 border-t border-slate-100 bg-slate-50/60 space-y-6 animate-in fade-in duration-200">
                    {/* Requirements */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <ShieldCheck className="w-4 h-4 text-blue-700" />
                        <span>Requisitos de Sistema:</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                        {tool.requirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Numbered Steps */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Pasos de Configuración:
                      </h4>

                      <div className="space-y-3">
                        {tool.steps.map((step, idx) => (
                          <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200/70 space-y-2">
                            <div className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono-tech">
                                {idx + 1}
                              </span>
                              <div className="space-y-1 w-full">
                                <p className="text-xs font-bold text-slate-900">{step.title}</p>
                                <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>

                                {step.code && (
                                  <div className="mt-2 p-2.5 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono-tech flex items-center justify-between overflow-x-auto border border-slate-800">
                                    <code>{step.code}</code>
                                    <Terminal className="w-3.5 h-3.5 text-blue-400 ml-2 shrink-0" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <a
                        href={tool.primaryAction.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>{tool.primaryAction.label}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>

                      {tool.docUrl && (
                        <a
                          href={tool.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>Documentación</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. QUICK START CHECKLIST */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-400 border border-blue-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verificación Pre-Laboratorio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Checklist de Inicio Rápido
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Marca las casillas conforme completes cada instalación. Estarás 100% listo para ejecutar tu primer lazo de control en el Lab 0.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {[
              { id: "matlab", label: "MATLAB & Simulink instalados con licencia UIS", desc: "Incluye Control System Toolbox" },
              { id: "arduino", label: "Arduino IDE 2.x configurado", desc: "Con librerías PubSubClient y ArduinoJson" },
              { id: "drivers", label: "Drivers USB-Serial funcionando", desc: "Puerto COM reconocido sin advertencias" },
              { id: "mqtt", label: "Credenciales MQTT de HiveMQ listas", desc: "Host, puerto 8883 y usuario activo" },
            ].map((item) => {
              const isChecked = checklist[item.id];

              return (
                <button
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isChecked
                      ? "bg-green-950/40 border-green-600/60 text-green-300 shadow-sm"
                      : "bg-slate-800/60 border-slate-700/70 hover:border-slate-600 text-slate-300"
                  }`}
                >
                  <div className="mt-0.5">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 fill-green-950" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isChecked ? "text-white line-through decoration-green-500" : "text-slate-200"}`}>
                      {item.label}
                    </p>
                    <p className="text-[11px] text-slate-400 pt-0.5">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Info className="w-4 h-4 text-blue-400" />
              <span>¿Completaste el checklist? Ya puedes ingresar a los retos de laboratorio.</span>
            </div>

            <Link
              href="/laboratorios"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-green-900/40 hover:-translate-y-0.5 transition-all"
            >
              <span>Ir a Ruta de Laboratorios</span>
              <CheckCircle2 className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
