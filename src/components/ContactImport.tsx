import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, Users } from 'lucide-react';
import { parseCSV, CSVParseResult } from '../utils/csvParser';
import { Contact } from '../types';

interface ContactImportProps {
  onImport: (contacts: Contact[]) => void;
  onClose: () => void;
}

const ContactImport: React.FC<ContactImportProps> = ({ onImport, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Proszę wybrać plik CSV');
      return;
    }

    setIsUploading(true);
    try {
      const content = await file.text();
      const result = parseCSV(content);
      setParseResult(result);
    } catch (error) {
      console.error('Błąd podczas parsowania CSV:', error);
      alert('Błąd podczas odczytu pliku. Spróbuj ponownie.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImport = () => {
    if (!parseResult) return;

    const contacts: Contact[] = parseResult.contacts.map(contact => ({
      id: Math.random().toString(36).substr(2, 9),
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      company: contact.company,
      position: contact.position,
      phone: contact.phone,
      tags: [],
      status: 'active' as const,
      createdAt: new Date()
    }));

    onImport(contacts);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Import kontaktów</h2>
            <p className="text-sm text-gray-600">Wczytaj plik CSV z listą kontaktów</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {!parseResult ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isUploading ? 'Przetwarzanie...' : 'Przeciągnij plik CSV tutaj'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    lub kliknij, aby przeglądać i wybrać plik
                  </p>
                </div>
                
                {!isUploading && (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                      Wybierz plik CSV
                    </span>
                  </label>
                )}
              </div>
              
              <div className="mt-6 text-left bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Wymagania formatu CSV:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Musi zawierać kolumnę "email"</li>
                  <li>• Opcjonalne kolumny: firstName, lastName, company, position, phone</li>
                  <li>• Pierwszy wiersz powinien zawierać nagłówki kolumn</li>
                  <li>• Użyj separacji przecinkami</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Parse Results */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900">Podsumowanie importu</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Prawidłowe kontakty: {parseResult.contacts.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Łączna liczba wierszy: {parseResult.totalRows}</span>
                  </div>
                  {parseResult.errors.length > 0 && (
                    <div className="flex items-center space-x-2 col-span-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-600">Błędy: {parseResult.errors.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Errors */}
              {parseResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Błędy importu:</h4>
                  <div className="max-h-32 overflow-y-auto">
                    {parseResult.errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-700">{error}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Podgląd (pierwsze 5 kontaktów):</h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">E-mail</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Imię i nazwisko</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Firma</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stanowisko</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {parseResult.contacts.slice(0, 5).map((contact, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-900">{contact.email}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {contact.firstName || contact.lastName 
                                ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                                : '-'
                              }
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">{contact.company || '-'}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{contact.position || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setParseResult(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Wczytaj inny plik
                </button>
                <button
                  onClick={handleImport}
                  disabled={parseResult.contacts.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Importuj {parseResult.contacts.length} kontaktów
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactImport;