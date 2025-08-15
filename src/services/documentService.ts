import { supabase } from '@/integrations/supabase/client';

export interface DocumentUpload {
  id?: string;
  user_id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  document_type: string;
  upload_source: string;
  extracted_text?: string;
  created_at?: string;
  is_active?: boolean;
}

class DocumentService {
  // Upload limit from environment variable or default to 10MB
  private maxUploadSize = Number(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 10 * 1024 * 1024;
  
  // Allowed file types from environment variable or default list
  private allowedFileTypes = import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || 
    ['.pdf', '.doc', '.docx', '.txt', 'image/*'];

  async uploadDocument(
    file: File, 
    documentType: 'resume' | 'cover_letter' | 'certificate' | 'portfolio' | 'other', 
    userId: string
  ): Promise<DocumentUpload> {
    // Validate file size
    if (file.size > this.maxUploadSize) {
      throw new Error(`File size must be less than ${this.maxUploadSize / 1024 / 1024}MB`);
    }

    // Validate file type
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const fileType = typeof file.type === 'string' ? file.type : '';
    const isAllowedType = this.allowedFileTypes.some((type: string) => 
      type === `*.${fileExt}` || 
      type === `.${fileExt}` || 
  (typeof type === 'string' && type.includes('/*') && String(fileType).startsWith(type.split('/')[0]))
    );

    if (!isAllowedType) {
      throw new Error('File type not allowed');
    }

    // Generate unique filename
    const filename = `${userId}/${Date.now()}-${file.name}`;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filename, file as File);

    if (uploadError) throw uploadError;

    // Extract text content if possible
    let extractedText = '';
    if (file.type.includes('text')) {
      extractedText = await file.text();
    }

    // Create document record
    const documentData: DocumentUpload = {
      user_id: userId,
      filename: uploadData.path,
      original_name: file.name,
      file_path: uploadData.path,
      file_size: file.size,
      mime_type: file.type,
      document_type: documentType,
      upload_source: 'file_upload',
      extracted_text: extractedText,
      is_active: true
    };

    const { data: doc, error: dbError } = await supabase
      .from('document_uploads')
      .insert([documentData])
      .select()
      .single();

    if (dbError) throw dbError;

    return doc;
  }

  async getDocuments(userId: string) {
    const { data, error } = await supabase
      .from('document_uploads')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async deleteDocument(documentId: string, userId: string) {
    // Soft delete - mark as inactive
    const { error } = await supabase
      .from('document_uploads')
      .update({ is_active: false })
      .match({ id: documentId, user_id: userId });

    if (error) throw error;
  }

  async getDocumentUrl(filePath: string | undefined) {
    if (!filePath) throw new Error('filePath is required');
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}

export const documentService = new DocumentService();
