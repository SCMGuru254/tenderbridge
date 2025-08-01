-- Create documents storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', false, 52428800, '{"application/pdf","application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain"}')
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for documents bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create ATS analyses table
CREATE TABLE IF NOT EXISTS public.ats_analyses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    file_path TEXT NOT NULL,
    analysis_result JSONB NOT NULL,
    analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ats_analyses
ALTER TABLE public.ats_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies for ats_analyses
CREATE POLICY "Users can view their own ATS analyses" ON public.ats_analyses
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ATS analyses" ON public.ats_analyses
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ATS analyses" ON public.ats_analyses
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ATS analyses" ON public.ats_analyses
FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER ats_analyses_updated_at
BEFORE UPDATE ON public.ats_analyses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();