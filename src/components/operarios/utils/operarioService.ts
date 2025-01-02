import { supabase } from "@/integrations/supabase/client";

export const checkCedulaExists = async (cedula: string, operatorId?: string): Promise<boolean> => {
  try {
    const query = supabase
      .from('operators')
      .select('id')
      .eq('cedula', cedula);
    
    // If we're updating an operator, exclude it from the check
    if (operatorId) {
      query.neq('id', operatorId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Error checking cédula:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkCedulaExists:', error);
    return false;
  }
};

export const uploadOperatorPhoto = async (photo: File): Promise<string | null> => {
  try {
    const fileExt = photo.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    
    if (!fileExt || !validExtensions.includes(fileExt)) {
      throw new Error("Invalid file type");
    }

    const fileName = `${Math.random()}.${fileExt}`;
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('operators-photos')
      .upload(fileName, photo);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('operators-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
};

export const saveOperator = async (operatorData: any, operatorId?: string) => {
  if (operatorId) {
    const { error } = await supabase
      .from('operators')
      .update(operatorData)
      .eq('id', operatorId);
    return { error };
  } else {
    const { error } = await supabase
      .from('operators')
      .insert(operatorData);
    return { error };
  }
};