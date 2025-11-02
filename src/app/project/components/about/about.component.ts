import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SchoolInfo {
  id: number;
  title: string;
  icon: string;
  content: string;
  color: string;
}

interface StaffMember {
  name: string;
  position: string;
  experience: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  schoolInfo: SchoolInfo[] = [
    {
      id: 1,
      title: 'Historia',
      icon: 'history',
      color: 'bg-blue-100 text-blue-800',
      content: 'Fundado en 1985, el Colegio San Miguel ha sido un pilar educativo en nuestra comunidad. Comenzamos con apenas 50 estudiantes y hoy contamos con más de 1,200 alumnos. Nuestra trayectoria de excelencia académica nos ha posicionado como uno de los mejores colegios de la región.'
    },
    {
      id: 2,
      title: 'Misión',
      icon: 'flag',
      color: 'bg-green-100 text-green-800',
      content: 'Formar ciudadanos integrales, críticos y creativos, capaces de contribuir al desarrollo sostenible de la sociedad. Promovemos valores de respeto, responsabilidad y solidaridad, mediante una educación de calidad que responda a los desafíos del mundo contemporáneo.'
    },
    {
      id: 3,
      title: 'Visión',
      icon: 'visibility',
      color: 'bg-purple-100 text-purple-800',
      content: 'Ser reconocidos como una institución educativa líder en innovación pedagógica, comprometida con la formación de seres humanos competentes, éticos y comprometidos con la transformación social para el año 2030.'
    },
    {
      id: 4,
      title: 'Valores Institucionales',
      icon: 'grade',
      color: 'bg-yellow-100 text-yellow-800',
      content: '• Respeto\n• Honestidad\n• Responsabilidad\n• Solidaridad\n• Excelencia\n• Innovación\n• Trabajo en equipo\n• Compromiso social\n• Perseverancia\n• Disciplina'
    },
    {
      id: 5,
      title: 'Normas del Colegio',
      icon: 'gavel',
      color: 'bg-red-100 text-red-800',
      content: '• Puntualidad en la asistencia a clases\n• Uniforme completo y correctamente portado\n• Respeto hacia compañeros, profesores y personal\n• Prohibido el uso de celulares durante clases\n• Mantener limpios los espacios comunes\n• Cumplir con las tareas asignadas\n• Participar activamente en clases'
    },
    {
      id: 6,
      title: 'Instalaciones',
      icon: 'school',
      color: 'bg-indigo-100 text-indigo-800',
      content: 'Contamos con 25 aulas equipadas, laboratorios de ciencia y computación, biblioteca con más de 10,000 volúmenes, canchas deportivas múltiples, auditorio para 300 personas, cafetería y áreas verdes para recreación.'
    }
  ];

 


}