import type { Metadata } from "next";
import { LabGuide } from "@/components/lab-guide/LabGuide";
import { fundamentosPractica1 } from "@/data/labs/fundamentos-practica1";

export const metadata: Metadata = {
  title: "Práctica 1: ESP32 con MATLAB y Simulink | MIACON",
  description:
    "Guía por etapas para configurar una ESP32 con MATLAB y Simulink: instalación del paquete de soporte, conexión USB, puerto COM y selección de la tarjeta.",
};

export default function Lab1() {
  return <LabGuide data={fundamentosPractica1} />;
}
