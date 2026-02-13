// features/content/data/content.mock.ts
import { ContentItem, DiscoverChip } from "../types";

export const DISCOVER_CHIPS: DiscoverChip[] = [
  { id: "Todo", label: "Todo" },
  { id: "Actividad física", label: "Actividad física" },
  { id: "Medio ambiente", label: "Medio ambiente" },
  { id: "Bienestar", label: "Bienestar" },
  { id: "Comunidad", label: "Comunidad" },
];

export const FEATURED: ContentItem[] = [
  {
    id: "f1",
    title: "Yoga para la ansiedad nocturna",
    category: "Bienestar",
    type: "video",
    durationSec: 12 * 60 + 40,
    views: 2400,
    isNew: true,
    thumbnail:
      "https://images.unsplash.com/photo-1554311884-415bfda6f5ae?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "f2",
    title: "Hacer compost en casa sin complicarte",
    category: "Medio ambiente",
    type: "article",
    views: 1800,
    thumbnail:
      "https://images.unsplash.com/photo-1586201375754-1421e52c046d?auto=format&fit=crop&w=900&q=80",
  },
];

export const FEED: ContentItem[] = [
  {
    id: "c1",
    title: "Rutina corta: respiración 5 minutos",
    category: "Bienestar",
    type: "routine",
    durationSec: 5 * 60,
    views: 2400,
    isNew: true,
  },
  {
    id: "c2",
    title: "Reto: 7 días sin plástico",
    category: "Medio ambiente",
    type: "challenge",
    views: 5200,
  },
  {
    id: "c3",
    title: "Camina 20 min: rutina para empezar",
    category: "Actividad física",
    type: "routine",
    durationSec: 20 * 60,
    views: 8100,
  },
  {
    id: "c4",
    title: "Guía rápida: separar residuos en casa",
    category: "Medio ambiente",
    type: "article",
    views: 15000,
    isNew: true,
  },
  {
    id: "c5",
    title: "Únete a la limpieza comunitaria del fin de semana",
    category: "Comunidad",
    type: "challenge",
    views: 1200,
  },
];
