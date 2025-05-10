import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string or Date object to a readable format
 * @param date Date string or Date object
 * @param options Date formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | undefined | null,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }
): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Processa URL de avatar para garantir que ele seja exibido corretamente
 * @param avatarUrl - URL do avatar do usuário
 * @returns URL processada para exibição
 */
export function processAvatarUrl(avatarUrl: string | null | undefined): string {
  if (!avatarUrl) return '';
  
  // Se for data URI (base64), retornar como está (usado como fallback)
  if (avatarUrl.startsWith('data:image/')) {
    return avatarUrl;
  }
  
  // Se for URL externa (http/https), retornar como está
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
    // Verificar se é uma URL do Supabase Storage e se a storage API está acessível
    if (avatarUrl.includes('supabase.co/storage/v1/object/public/')) {
      // URLs do Supabase Storage são válidas e permanentes, retornar como estão
      return avatarUrl;
    }
    
    // Outra URL externa normal
    return avatarUrl;
  }
  
  // Se for uma URL de blob, é temporária e não deve ser usada
  if (avatarUrl.startsWith('blob:')) {
    console.warn('Blob URL detected for avatar, these are temporary and should be avoided');
    return '';
  }
  
  // Se for caminho local começando com "/", é um path relativo
  if (avatarUrl.startsWith('/')) {
    // URL base é o domínio atual
    return `${window.location.origin}${avatarUrl}`;
  }
  
  // Se não se encaixar em nenhuma categoria, retornar como está
  return avatarUrl;
}
