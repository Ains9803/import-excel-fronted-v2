import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ImportConfig } from '@/types/ui';

// Props interface for ConfigurationPanel
interface ConfigurationPanelProps {
  onConfigChange: (config: ImportConfig) => void;
}

// Default configuration
const DEFAULT_CONFIG: ImportConfig = {
  dateFormat: 'DD/MM/YYYY',
  decimalSeparator: '.',
  columnMapping: {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
  },
};

// Local storage key
const CONFIG_STORAGE_KEY = 'import-excel-config';

export const ConfigurationPanel = ({ onConfigChange }: ConfigurationPanelProps) => {
  // Local state for configuration
  const [config, setConfig] = useState<ImportConfig>(DEFAULT_CONFIG);

  // Load configuration from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        onConfigChange(parsedConfig);
      } catch (error) {
        console.error('Error loading saved configuration:', error);
      }
    }
  }, [onConfigChange]);

  // Save configuration to localStorage and notify parent
  const updateConfig = (updates: Partial<ImportConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    onConfigChange(newConfig);
  };

  // Handle date format change
  const handleDateFormatChange = (value: string) => {
    updateConfig({ dateFormat: value });
  };

  // Handle decimal separator change
  const handleDecimalSeparatorChange = (value: '.' | ',') => {
    updateConfig({ decimalSeparator: value });
  };

  // Handle column mapping change
  const handleColumnMappingChange = (field: string, value: string) => {
    updateConfig({
      columnMapping: {
        ...config.columnMapping,
        [field]: value,
      },
    });
  };

  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle>Configuración</CardTitle>
        <CardDescription>
          Personaliza el formato de importación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="options" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="options">Opciones</TabsTrigger>
            <TabsTrigger value="mapping">Mapeo</TabsTrigger>
          </TabsList>

          {/* Options Tab */}
          <TabsContent value="options" className="space-y-5 mt-6">
            {/* Date Format Select */}
            <div className="space-y-2">
              <Label htmlFor="date-format" className="text-sm font-medium">
                Formato de Fecha
              </Label>
              <Select
                value={config.dateFormat}
                onValueChange={handleDateFormatChange}
              >
                <SelectTrigger id="date-format" className="h-10">
                  <SelectValue placeholder="Selecciona formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="font-medium">DD/MM/YYYY</span>
                      <span className="text-xs text-slate-500">Ej: 25/12/2024</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MM/DD/YYYY">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="font-medium">MM/DD/YYYY</span>
                      <span className="text-xs text-slate-500">Ej: 12/25/2024</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="YYYY-MM-DD">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="font-medium">YYYY-MM-DD</span>
                      <span className="text-xs text-slate-500">Ej: 2024-12-25</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="DD-MM-YYYY">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="font-medium">DD-MM-YYYY</span>
                      <span className="text-xs text-slate-500">Ej: 25-12-2024</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="YYYY/MM/DD">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="font-medium">YYYY/MM/DD</span>
                      <span className="text-xs text-slate-500">Ej: 2024/12/25</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Decimal Separator Select */}
            <div className="space-y-2">
              <Label htmlFor="decimal-separator" className="text-sm font-medium">
                Separador Decimal
              </Label>
              <Select
                value={config.decimalSeparator}
                onValueChange={handleDecimalSeparatorChange}
              >
                <SelectTrigger id="decimal-separator" className="h-10">
                  <SelectValue placeholder="Selecciona separador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=".">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="font-medium">Punto (.)</span>
                      <span className="text-xs text-slate-500">Ej: 1234.56</span>
                    </div>
                  </SelectItem>
                  <SelectItem value=",">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="font-medium">Coma (,)</span>
                      <span className="text-xs text-slate-500">Ej: 1234,56</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Mapping Tab */}
          <TabsContent value="mapping" className="space-y-5 mt-6">
            <p className="text-sm text-slate-600 mb-2">
              Mapea las columnas de tu archivo Excel a los campos del sistema
            </p>

            {/* Nombre field */}
            <div className="space-y-2">
              <Label htmlFor="mapping-nombre">Nombre</Label>
              <Input
                id="mapping-nombre"
                placeholder="Ej: Columna A, Nombre, Name"
                value={config.columnMapping.nombre}
                onChange={(e) => handleColumnMappingChange('nombre', e.target.value)}
              />
            </div>

            {/* Apellido field */}
            <div className="space-y-2">
              <Label htmlFor="mapping-apellido">Apellido</Label>
              <Input
                id="mapping-apellido"
                placeholder="Ej: Columna B, Apellido, Last Name"
                value={config.columnMapping.apellido}
                onChange={(e) => handleColumnMappingChange('apellido', e.target.value)}
              />
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="mapping-email">Email</Label>
              <Input
                id="mapping-email"
                placeholder="Ej: Columna C, Email, Correo"
                value={config.columnMapping.email}
                onChange={(e) => handleColumnMappingChange('email', e.target.value)}
              />
            </div>

            {/* Teléfono field */}
            <div className="space-y-2">
              <Label htmlFor="mapping-telefono">Teléfono</Label>
              <Input
                id="mapping-telefono"
                placeholder="Ej: Columna D, Teléfono, Phone"
                value={config.columnMapping.telefono}
                onChange={(e) => handleColumnMappingChange('telefono', e.target.value)}
              />
            </div>

            {/* Fecha de Nacimiento field */}
            <div className="space-y-2">
              <Label htmlFor="mapping-fechaNacimiento">Fecha de Nacimiento</Label>
              <Input
                id="mapping-fechaNacimiento"
                placeholder="Ej: Columna E, Fecha Nac., Birth Date"
                value={config.columnMapping.fechaNacimiento}
                onChange={(e) => handleColumnMappingChange('fechaNacimiento', e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
