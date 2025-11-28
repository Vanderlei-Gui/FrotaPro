import React from 'react';
import { CompanySettings } from '../types';
import { Save } from 'lucide-react';

interface SettingsProps {
  settings: CompanySettings;
  onUpdate: (s: CompanySettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = React.useState(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setFormData({ ...formData, logoUrl: ev.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Configurações da Empresa</h2>
        <p className="text-slate-500">Personalize a identidade visual do seu sistema (White Label).</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-2">Logotipo da Empresa</label>
           <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                 {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                 ) : (
                    <span className="text-slate-400 text-xs text-center px-2">Sem Logo</span>
                 )}
              </div>
              <div>
                 <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                 "/>
                 <p className="mt-1 text-xs text-slate-500">Recomendado: PNG ou JPG, 400x400px.</p>
              </div>
           </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-2">Nome da Empresa</label>
           <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-2">Cor Primária (Hex)</label>
           <div className="flex items-center space-x-3">
              <input 
                type="color" 
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleChange}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input 
                type="text" 
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono text-slate-900"
              />
           </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
           <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2">
              <Save size={20} />
              <span>Salvar Alterações</span>
           </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;