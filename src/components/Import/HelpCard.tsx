import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, CheckCircle, AlertTriangle, Download, Settings } from 'lucide-react';
import { HelpTip } from '@/types/ui';

const helpTips: HelpTip[] = [
  {
    icon: 'FileSpreadsheet',
    title: 'Formato de archivo',
    description: 'Solo se aceptan archivos Excel (.xlsx, .xls) con un tamaño máximo de 10 MB.'
  },
  {
    icon: 'Download',
    title: 'Usa la plantilla',
    description: 'Descarga la plantilla Excel para asegurar que tus datos tengan el formato correcto antes de importar.'
  },
  {
    icon: 'Settings',
    title: 'Configura las opciones',
    description: 'Ajusta el formato de fecha y separadores decimales según tus datos en el panel de configuración.'
  },
  {
    icon: 'CheckCircle',
    title: 'Revisa los resultados',
    description: 'Después de la importación, verás un resumen con el número de filas procesadas y cualquier error encontrado.'
  },
  {
    icon: 'AlertTriangle',
    title: 'Corrige errores',
    description: 'Si hay errores, la tabla detallada te mostrará exactamente qué filas necesitan corrección.'
  }
];

const iconMap = {
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Download,
  Settings
};

export const HelpCard = () => {
  return (
    <Card className="border-slate-200 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-700">
          Consejos útiles
        </CardTitle>
        <CardDescription className="text-sm text-slate-600">
          Guía rápida para importar tus archivos Excel
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-5">
          {helpTips.map((tip, index) => {
            const Icon = iconMap[tip.icon as keyof typeof iconMap];
            return (
              <div key={index} className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    {tip.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
