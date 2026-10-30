import { Bot, Boxes, Code2, Database } from 'lucide-react'

export const skillGroups = [
  {
    number: '01',
    title: 'Desarrollo de software',
    description: 'Aplicaciones modernas, sistemas heredados, motores y producto interactivo.',
    icon: Code2,
    skills: ['C#', 'ASP.NET / .NET', 'React', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C', 'Delphi', 'Windows Forms', 'HTML & CSS', 'SQL'],
  },
  {
    number: '02',
    title: 'Cloud, datos & entrega',
    description: 'Integraciones, automatización y despliegue de soluciones de principio a fin.',
    icon: Database,
    skills: ['Azure', 'Docker', 'Git', 'GitHub', 'REST APIs', 'Firebase', 'Google Cloud', 'Vercel', 'ETL', 'Excel & PowerPoint'],
  },
  {
    number: '03',
    title: 'Entornos & creación',
    description: 'Herramientas utilizadas para programar, diseñar y construir experiencias completas.',
    icon: Boxes,
    skills: ['Visual Studio', 'VS Code', 'IntelliJ IDEA', 'Android Studio', 'Unity Editor', 'Java AWT / Swing', 'Blender', 'Mixamo'],
  },
  {
    number: '04',
    title: 'IA, sistemas & seguridad',
    description: 'IA comercial y local, infraestructura propia y laboratorios técnicos controlados.',
    icon: Bot,
    skills: ['OpenAI / ChatGPT', 'Codex', 'LM Studio', 'OpenClaw', 'LLMs locales', 'Linux', 'Kali Linux', 'Metasploit'],
  },
]

export const professionalStrengths = [
  ['Aprendizaje autónomo', 'Investigo y convierto conocimiento nuevo en software funcional.'],
  ['Ownership end-to-end', 'Asumo el problema completo, desde el análisis hasta la entrega.'],
  ['Criterio de producto', 'Conecto decisiones técnicas con usuario, proceso y negocio.'],
  ['Comunicación transversal', 'Traduzco complejidad para perfiles técnicos y de dirección.'],
]
