import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const TemplateDownloadCard = () => {
  const handleDownload = () => {
    // Create a simple Excel template structure
    // In a real implementation, you would generate an actual Excel file
    // For now, we'll create a CSV that can be opened in Excel
    const templateContent = `Nombre,Apellido,Email,Teléfono,Fecha de Nacimiento,Dirección
Juan,Pérez,juan.perez@example.com,555-0100,01/01/1990,Calle Principal 123
María,González,maria.gonzalez@example.com,555-0101,15/03/1985,Avenida Central 456`;

    // Create blob with CSV content
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create temporary URL
    const url = URL.createObjectURL(blob);
    
    // Create temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla_importacion.csv';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-slate-200 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-700">
          Plantilla de importación
        </CardTitle>
        <CardDescription className="text-sm text-slate-600">
          Descarga la plantilla para preparar tus datos correctamente
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Descargar plantilla Excel
        </Button>
        <p className="text-xs text-slate-600 mt-4 leading-relaxed">
          La plantilla incluye las columnas requeridas y ejemplos de datos para facilitar la preparación de tu archivo.
        </p>
      </CardContent>
    </Card>
  );
};
