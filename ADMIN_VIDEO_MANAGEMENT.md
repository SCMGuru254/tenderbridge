# Admin Video Management Guide

## How to Update Demo Videos

### Method 1: Quick Update (Code Change)

To change the demo video URL, edit the file `src/components/DemoVideoModal.tsx`:

```typescript
// Line 12 - Change the default videoUrl:
export const DemoVideoModal = ({ 
  isOpen, 
  onClose, 
  videoUrl = "https://www.youtube.com/embed/YOUR_NEW_VIDEO_ID" 
}: DemoVideoModalProps) => {
```

**Steps:**
1. Go to your YouTube video
2. Click "Share" → "Embed"
3. Copy the embed URL (format: `https://www.youtube.com/embed/VIDEO_ID`)
4. Replace the `videoUrl` default value in the code above
5. Commit and deploy changes

---

### Method 2: Database-Driven (Recommended for Future)

For dynamic video management without code changes, you can store video URLs in Supabase:

#### Step 1: Create a Settings Table

Run this migration in Supabase:

```sql
-- Create app_settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read settings
CREATE POLICY "Anyone can read settings"
  ON public.app_settings
  FOR SELECT
  USING (true);

-- Policy: Only admins can update settings
CREATE POLICY "Only admins can update settings"
  ON public.app_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Insert default demo video setting
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES ('demo_video', '{"url": "https://www.youtube.com/embed/XsvOvI6UcYU", "title": "SupplyChain KE Demo"}')
ON CONFLICT (setting_key) DO NOTHING;
```

#### Step 2: Create Admin Settings Page

Create a new page `src/pages/AdminSettings.tsx` where admins can update the video URL through a form.

#### Step 3: Update DemoVideoModal Component

Modify the component to fetch the video URL from the database:

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const DemoVideoModal = ({ isOpen, onClose }: DemoVideoModalProps) => {
  const { data: videoSettings } = useQuery({
    queryKey: ['demo-video-settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'demo_video')
        .single();
      
      return data?.setting_value || { url: 'https://www.youtube.com/embed/XsvOvI6UcYU' };
    }
  });

  const videoUrl = videoSettings?.url || 'https://www.youtube.com/embed/XsvOvI6UcYU';
  
  // ... rest of component
};
```

---

### Method 3: Environment Variables (For Multiple Environments)

Add to your `.env` file:

```env
VITE_DEMO_VIDEO_URL=https://www.youtube.com/embed/XsvOvI6UcYU
```

Then use in the component:

```typescript
const videoUrl = import.meta.env.VITE_DEMO_VIDEO_URL || "https://www.youtube.com/embed/XsvOvI6UcYU";
```

---

## Current Video Configuration

**Current Demo Video:** https://youtu.be/XsvOvI6UcYU

This video is embedded using the iframe format: `https://www.youtube.com/embed/XsvOvI6UcYU`

---

## Best Practices

1. **Always use embed format**: `https://www.youtube.com/embed/VIDEO_ID` (not the watch URL)
2. **Keep videos under 5 minutes** for better engagement
3. **Test video on mobile devices** to ensure it plays correctly
4. **Use YouTube unlisted videos** if you don't want them public on your channel
5. **Add captions/subtitles** to your videos for accessibility

---

## Multiple Videos Support

To add multiple videos (e.g., tutorial videos, feature demos), you can:

1. Create a `videos` table in Supabase
2. Store multiple videos with categories (demo, tutorial, testimonial)
3. Create a video gallery component
4. Let admins manage all videos from a dashboard

Would you like me to implement any of these methods?
