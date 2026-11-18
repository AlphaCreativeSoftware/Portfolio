type Experience = {
  id: string
  date: string
  company: string
  title: string
  description: string
  variant?: 'current' | 'independent'
  status?: string
}

export const currentExperience: Experience = {
  id: 'avos-tech',
  date: 'Feb. 2026 — Ahora',
  company: 'Prosegur AVOS Tech · Sector banca',
  title: 'Ingeniero de software',
  description: 'Encargado del desarrollo y mantenimiento de aplicaciones con ASP.NET, React, TypeScript y Azure. Participo en la estimación y planificación del trabajo técnico y en el mantenimiento de componentes críticos de la red operativa del BPO y de sistemas heredados en Delphi, C y Windows Forms.',
  variant: 'current',
  status: 'Actual',
}

export const experience: Experience[] = [
  currentExperience,
  {
    id: 'alpha-creative',
    date: '2020 — Actualidad',
    company: 'Alpha Creative · Marca propia',
    title: 'Fundador y creador de producto',
    description: 'Creación y desarrollo de una marca independiente bajo la que diseño, publico y comercializo software, productos digitales y proyectos editoriales. Gestión end-to-end de producto, identidad, contenido, distribución y presencia online.',
    variant: 'independent',
    status: 'En activo',
  },
  {
    id: 'financial-analysis',
    date: 'Nov. 2025 — Feb. 2026',
    company: 'Proyecto profesional · Sector Real Estate',
    title: 'Software de conciliación y análisis',
    description: 'Primer proyecto profesional: tres meses creando en Python una solución para transformar, validar y relacionar información financiera, generando análisis e informes automatizados.',
  },
  {
    id: 'unity-world',
    date: '2024 — 2025',
    company: 'DAM · Proyecto final',
    title: 'Mundo abierto en Unity 3D',
    description: 'Arquitectura de entidades, IA de peatones, vehículos, streaming asíncrono y optimización gráfica en un entorno completo e interactivo.',
  },
  {
    id: 'fruit-drop',
    date: '2024 · 3 meses',
    company: 'Alpha Creative · Producto independiente',
    title: 'Fruit Drop',
    description: 'Diseño, desarrollo y publicación de un videojuego móvil completo, integrando monetización, servicios cloud, rankings globales y persistencia de datos.',
  },
  {
    id: 'alpha-engine',
    date: '2023 — 2024',
    company: 'DAM · Proyecto destacado',
    title: 'AlphaEngine2D',
    description: 'Motor gráfico desarrollado desde cero en Java, convertido en proyecto de referencia académica para promociones posteriores.',
  },
]
