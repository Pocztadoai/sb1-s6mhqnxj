export interface CSVParseResult {
  contacts: Array<{
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    position?: string;
    phone?: string;
  }>;
  errors: string[];
  totalRows: number;
}

export function parseCSV(csvContent: string): CSVParseResult {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const contacts: CSVParseResult['contacts'] = [];
  const errors: string[] = [];
  
  // Validate required headers
  if (!headers.includes('email')) {
    errors.push('Plik CSV musi zawierać kolumnę "email"');
    return { contacts: [], errors, totalRows: lines.length - 1 };
  }
  
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(cell => cell.trim());
    
    if (row.length !== headers.length) {
      errors.push(`Wiersz ${i}: Niezgodna liczba kolumn`);
      continue;
    }
    
    const contact: any = {};
    
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = row[j].replace(/^["']|["']$/g, ''); // Remove quotes
      
      switch (header) {
        case 'email':
          if (!isValidEmail(value)) {
            errors.push(`Wiersz ${i}: Nieprawidłowy format e-maila: ${value}`);
            continue;
          }
          contact.email = value.toLowerCase();
          break;
        case 'firstname':
        case 'first_name':
        case 'first name':
        case 'imie':
        case 'imię':
          contact.firstName = value;
          break;
        case 'lastname':
        case 'last_name':
        case 'last name':
        case 'nazwisko':
          contact.lastName = value;
          break;
        case 'company':
        case 'firma':
          contact.company = value;
          break;
        case 'position':
        case 'job_title':
        case 'title':
        case 'stanowisko':
          contact.position = value;
          break;
        case 'phone':
        case 'phone_number':
        case 'telefon':
          contact.phone = value;
          break;
      }
    }
    
    if (contact.email) {
      contacts.push(contact);
    }
  }
  
  return {
    contacts,
    errors,
    totalRows: lines.length - 1
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}