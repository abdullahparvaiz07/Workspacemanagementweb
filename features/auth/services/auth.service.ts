import { createClient } from '@/lib/supabase/client';

class AuthService {
  private get supabase() {
    return createClient();
  }

  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    
    // Create profile if user exists and no error
    if (data.user) {
      const { error: profileError } = await (this.supabase.from('profiles') as any).insert([
        {
          id: data.user.id,
          email: email,
          full_name: fullName,
        },
      ]);
      
      if (profileError) throw profileError;
    }

    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  async getProfile(userId: string) {
    const { data, error } = await (this.supabase.from('profiles') as any)
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      // Profile doesn't exist (created via dashboard manually)
      // Auto-create the profile here
      const { data: userData } = await this.supabase.auth.getUser();
      const email = userData?.user?.email || 'unknown@example.com';
      const fullName = email.split('@')[0];

      const { data: newProfile, error: insertError } = await (this.supabase.from('profiles') as any)
        .insert([{ id: userId, email, full_name: fullName }])
        .select()
        .single();
        
      if (insertError) throw insertError;
      return newProfile;
    }

    return data;
  }
}

export const authService = new AuthService();
